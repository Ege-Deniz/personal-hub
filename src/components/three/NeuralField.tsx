"use client";

// NeuralField — the persistent GPGPU particle brain behind every act.
// "The brain is the interface": one canvas, one simulation, scroll morphs it.
//
// Architecture:
//   - GPUComputationRenderer (three-stdlib) runs a position+velocity sim in
//     float textures: spring-to-home, curl-noise idle drift, cursor repulsion,
//     disperse. Home positions are sampled from a neural GRAPH (cortex shell
//     with fbm folds + hub ganglia + edge fibers + dust halo) so the mass
//     reads as a system, not a blob.
//   - The render pass draws velocity-stretched soft sprites; energy (stored in
//     position.w) drives brightness so motion literally glows.
//   - A director in useFrame reads the act timeline (fieldState) and lerps
//     camera + sim parameters between per-act keyframes. Regions ignite during
//     the Disciplines act; the field condenses gold during Brain Operator;
//     it disperses in the finale.
// Visual DNA (palette, atmosphere, discharges, orbitals, post chain) is ported
// from SpatialBackground.tsx — same world, upgraded physics.

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  SMAA,
  ToneMapping,
} from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import { GPUComputationRenderer } from "three-stdlib";
import { fieldState, actTimeline, syncActs } from "@/lib/fieldState";
import { scrollState } from "@/lib/scrollState";

const POSTFX_ENABLED = process.env.NEXT_PUBLIC_POSTFX !== "0";

const BRAIN_R = 2.55;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const HUB_COUNT = 160;

// ── Deterministic PRNG + noise (ported DNA) ─────────────────────────────────
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash3 = (x: number, y: number, z: number) => {
  const h = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return h - Math.floor(h);
};
const noise3 = (x: number, y: number, z: number) => hash3(x, y, z) * 2 - 1;
const fbm = (x: number, y: number, z: number) => {
  let sum = 0;
  let amp = 1;
  let freq = 1;
  for (let i = 0; i < 4; i++) {
    sum += noise3(x * freq, y * freq, z * freq) * amp;
    amp *= 0.5;
    freq *= 2.07;
  }
  return sum;
};

// Region anchors — 4 contiguous lobes (Disciplines act ignition targets).
const ANCHORS: [number, number, number][] = [
  [-0.78, 0.38, 0.55], // 0 AI Agent Infrastructure
  [0.82, 0.42, 0.3], // 1 ML Foundations
  [-0.4, -0.45, -0.78], // 2 Spatial Web
  [0.66, -0.38, -0.62], // 3 Competitive FPS
];
function regionOf(x: number, y: number, z: number): number {
  const len = Math.max(Math.sqrt(x * x + y * y + z * z), 1e-5);
  let best = 0;
  let bestDot = -2;
  for (let k = 0; k < 4; k++) {
    const a = ANCHORS[k];
    const d = (x * a[0] + y * a[1] + z * a[2]) / len;
    if (d > bestDot) {
      bestDot = d;
      best = k;
    }
  }
  return best;
}

// Hub graph shared by home sampling + discharges.
function buildHubs() {
  const hubs: [number, number, number][] = [];
  for (let i = 0; i < HUB_COUNT; i++) {
    const k = i + 0.5;
    const fy = 1 - (2 * k) / HUB_COUNT;
    const fr = Math.sqrt(Math.max(0, 1 - fy * fy));
    const th = GOLDEN_ANGLE * k;
    const dx = Math.cos(th) * fr;
    const dz = Math.sin(th) * fr;
    const fold = fbm(dx * 1.9, fy * 1.9, dz * 1.9);
    const detail = fbm(dx * 4.3, fy * 4.3, dz * 4.3);
    const r = BRAIN_R * (1 + fold * 0.11 + detail * 0.035);
    hubs.push([dx * r, fy * r, dz * r]);
  }
  const edges: [number, number][] = [];
  const MAX_D2 = 1.9 * 1.9;
  for (let i = 0; i < HUB_COUNT; i++) {
    for (const off of [5, 8, 13, 21]) {
      const j = (i + off) % HUB_COUNT;
      const a = hubs[i];
      const b = hubs[j];
      const dx = a[0] - b[0];
      const dy = a[1] - b[1];
      const dz = a[2] - b[2];
      if (dx * dx + dy * dy + dz * dz < MAX_D2) edges.push([i, j]);
    }
  }
  return { hubs, edges };
}

// Home texture data: xyz = rest position, w = class (0..3 region, 4 dust, 5 warm core).
function buildHomeData(size: number): Float32Array {
  const rng = mulberry32(1337);
  const gauss = () => {
    const u = Math.max(rng(), 1e-9);
    const v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const { hubs, edges } = buildHubs();
  const count = size * size;
  const data = new Float32Array(count * 4);

  for (let i = 0; i < count; i++) {
    const roll = rng();
    let x = 0;
    let y = 0;
    let z = 0;
    let w = 0;

    if (roll < 0.42) {
      // Cortex shell with fbm folds.
      const k = i + 0.5;
      const fy = 1 - (2 * (k % count)) / count;
      const fr = Math.sqrt(Math.max(0, 1 - fy * fy));
      const th = GOLDEN_ANGLE * k;
      const dx = Math.cos(th) * fr;
      const dz = Math.sin(th) * fr;
      const fold = fbm(dx * 1.9, fy * 1.9, dz * 1.9);
      const detail = fbm(dx * 4.3, fy * 4.3, dz * 4.3);
      const r = BRAIN_R * (1 + fold * 0.11 + detail * 0.035);
      x = dx * r;
      y = fy * r;
      z = dz * r;
      w = regionOf(x, y, z);
    } else if (roll < 0.56) {
      // Volumetric interior — densest center ignites warm.
      const dx = gauss();
      const dy = gauss();
      const dz = gauss();
      const len = Math.max(Math.sqrt(dx * dx + dy * dy + dz * dz), 1e-5);
      const rad = (0.2 + Math.sqrt(rng()) * 0.66) * BRAIN_R;
      x = (dx / len) * rad;
      y = (dy / len) * rad;
      z = (dz / len) * rad;
      w = rad < BRAIN_R * 0.5 ? 5 : regionOf(x, y, z);
    } else if (roll < 0.84) {
      // Edge fibers — the graph made visible.
      const e = edges[Math.floor(rng() * edges.length)];
      const a = hubs[e[0]];
      const b = hubs[e[1]];
      const t = rng();
      x = a[0] + (b[0] - a[0]) * t + gauss() * 0.045;
      y = a[1] + (b[1] - a[1]) * t + gauss() * 0.045;
      z = a[2] + (b[2] - a[2]) * t + gauss() * 0.045;
      const h = t < 0.5 ? a : b;
      w = regionOf(h[0], h[1], h[2]);
    } else if (roll < 0.94) {
      // Ganglia puffs at hubs.
      const h = hubs[Math.floor(rng() * hubs.length)];
      x = h[0] + gauss() * 0.12;
      y = h[1] + gauss() * 0.12;
      z = h[2] + gauss() * 0.12;
      w = regionOf(h[0], h[1], h[2]);
    } else {
      // Dust halo.
      const dx = gauss();
      const dy = gauss();
      const dz = gauss();
      const len = Math.max(Math.sqrt(dx * dx + dy * dy + dz * dz), 1e-5);
      const rad = 3.1 + rng() * 3.2;
      x = (dx / len) * rad;
      y = (dy / len) * rad * 0.8;
      z = (dz / len) * rad;
      w = 4;
    }

    data[i * 4 + 0] = x;
    data[i * 4 + 1] = y;
    data[i * 4 + 2] = z;
    data[i * 4 + 3] = w;
  }
  return data;
}

// ── GLSL ─────────────────────────────────────────────────────────────────────
// Ashima 3D simplex noise (standard, verbatim).
const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
vec3 snoiseVec3(vec3 x){
  return vec3(
    snoise(x),
    snoise(x + vec3(123.4, 87.6, 231.9)),
    snoise(x + vec3(312.7, 9.4, 178.2))
  );
}
vec3 curlNoise(vec3 p){
  const float e = 0.12;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);
  vec3 x0 = snoiseVec3(p - dx); vec3 x1 = snoiseVec3(p + dx);
  vec3 y0 = snoiseVec3(p - dy); vec3 y1 = snoiseVec3(p + dy);
  vec3 z0 = snoiseVec3(p - dz); vec3 z1 = snoiseVec3(p + dz);
  float cx = (y1.z - y0.z) - (z1.y - z0.y);
  float cy = (z1.x - z0.x) - (x1.z - x0.z);
  float cz = (x1.y - x0.y) - (y1.x - y0.x);
  return normalize(vec3(cx, cy, cz) / (2.0 * e) + vec3(1e-5));
}
`;

// Velocity pass — forces tuned per-frame at 60fps, normalized via n60.
const VELOCITY_SHADER = /* glsl */ `
uniform sampler2D uHome;
uniform float uTime;
uniform float uDelta;
uniform float uStiffness;
uniform float uCurlAmp;
uniform float uSpread;
uniform float uRegion;
uniform float uDisperse;
uniform vec3 uPointer;
uniform float uPointerForce;
${SIMPLEX}
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture2D(texturePosition, uv).xyz;
  vec4 homeT = texture2D(uHome, uv);
  vec3 home = homeT.xyz * uSpread;
  float cls = homeT.w;
  vec3 vel = texture2D(textureVelocity, uv).xyz;
  float n60 = uDelta * 60.0;

  // Spring to home — dust is looser, drifts more freely.
  float isDust = step(3.5, cls) * (1.0 - step(4.5, cls));
  float stiff = uStiffness * mix(1.0, 0.3, isDust);
  vel += (home - pos) * stiff * n60;

  // Curl-noise idle — the field "thinks". Ignited region gets excited.
  float excite = 0.0;
  if (uRegion > -0.5 && abs(cls - uRegion) < 0.5) excite = 1.0;
  vec3 curl = curlNoise(pos * 0.62 + vec3(0.0, uTime * 0.045, 0.0));
  vel += curl * uCurlAmp * (1.0 + excite * 2.6) * n60;

  // Cursor repulsion — a thought disturbing the field; it self-heals.
  vec3 toP = pos - uPointer;
  float d = length(toP);
  float rad = 1.9;
  if (d < rad) {
    float fall = 1.0 - d / rad;
    vel += (toP / max(d, 0.06)) * fall * fall * uPointerForce * n60;
  }

  // Finale disperse — the shell releases.
  if (uDisperse > 0.001) {
    vec3 outDir = pos / max(length(pos), 0.05);
    vel += outDir * uDisperse * 0.05 * n60;
    vel += curl * uDisperse * 0.05 * n60;
  }

  // Breathing ripple along the home normal.
  float breath = sin(uTime * 0.42 + length(home) * 1.7) * 0.0011;
  vel += (home / max(length(home), 0.05)) * breath * n60;

  vel *= pow(0.90, n60);
  float spd = length(vel);
  if (spd > 0.09) vel *= 0.09 / spd;
  gl_FragColor = vec4(vel, 1.0);
}
`;

// Position pass — integrate; energy (w) = recent speed + traveling pulse wave.
const POSITION_SHADER = /* glsl */ `
uniform float uDelta;
uniform float uTime;
uniform float uPulseAmp;
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 posT = texture2D(texturePosition, uv);
  vec3 vel = texture2D(textureVelocity, uv).xyz;
  float n60 = uDelta * 60.0;
  vec3 pos = posT.xyz + vel * n60;

  float e = posT.w * pow(0.945, n60);
  e = max(e, length(vel) * n60 * 9.0);

  // Thinking pulse — a spherical wavefront sweeps the mass every ~7s.
  float pr = mod(uTime * 0.75, 7.0);
  if (pr < 3.4) {
    float band = exp(-pow((length(pos) - pr) * 2.6, 2.0));
    e += band * uPulseAmp;
  }
  e = clamp(e, 0.0, 1.5);
  gl_FragColor = vec4(pos, e);
}
`;

const RENDER_VERTEX = /* glsl */ `
attribute vec2 aRef;
attribute float aSeed;
uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
uniform sampler2D uHome;
uniform float uBoot;
uniform float uTime;
uniform float uSizeScale;
uniform float uSimOn;
varying float vEnergy;
varying float vCls;
varying vec2 vVelDir;
varying float vStretch;
varying float vSeed;
void main() {
  vec4 posT = texture2D(texturePosition, aRef);
  vec4 homeT = texture2D(uHome, aRef);
  vec3 vel = texture2D(textureVelocity, aRef).xyz * uSimOn;
  float cls = homeT.w;
  vec3 simPos = mix(homeT.xyz, posT.xyz, uSimOn);

  // Staggered boot assembly from a scattered shell.
  float h1 = fract(sin(aSeed * 78.233) * 43758.5453);
  float h2 = fract(sin(aSeed * 12.9898) * 24634.6345);
  float h3 = fract(sin(aSeed * 39.425) * 11369.426);
  vec3 scatterDir = normalize(vec3(h1, h2, h3) * 2.0 - 1.0 + vec3(0.0001));
  vec3 scatter = homeT.xyz * (1.7 + h1 * 2.1) + scatterDir * (2.6 + h2 * 6.0);
  float bootLocal = smoothstep(0.0, 1.0, clamp(uBoot * 1.55 - h3 * 0.55, 0.0, 1.0));
  vec3 p = mix(scatter, simPos, bootLocal);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float energy = mix(0.18 + 0.18 * sin(uTime * 1.6 + aSeed * 40.0), posT.w, uSimOn);
  vec4 mvVel = modelViewMatrix * vec4(vel, 0.0);
  vVelDir = mvVel.xy;
  vStretch = clamp(length(vel) * 30.0, 0.0, 1.0) * uSimOn;

  float sizeJit = 0.55 + h2 * 0.9;
  float isDust = step(3.5, cls) * (1.0 - step(4.5, cls));
  float isCore = step(4.5, cls);
  float clsSize = 1.0 + isDust * 0.35 + isCore * 0.5;
  gl_PointSize = uSizeScale * sizeJit * clsSize * (1.0 + energy * 0.9)
    * (1.0 / max(-mv.z, 0.1)) * (0.25 + 0.75 * bootLocal);

  vEnergy = energy;
  vCls = cls;
  vSeed = aSeed;
}
`;

const RENDER_FRAGMENT = /* glsl */ `
precision highp float;
uniform float uRegion;
uniform float uArtifact;
uniform float uWarm;
uniform float uDim;
varying float vEnergy;
varying float vCls;
varying vec2 vVelDir;
varying float vStretch;
varying float vSeed;
void main() {
  vec2 pc = gl_PointCoord - 0.5;
  // Rotate sprite space into the motion direction, elongate along it — comets.
  vec2 dir = normalize(vVelDir + vec2(1e-4));
  vec2 q = vec2(pc.x * dir.x + pc.y * dir.y, -pc.x * dir.y + pc.y * dir.x);
  q.x /= (1.0 + vStretch * 1.6);
  float d = length(q);
  float soft = smoothstep(0.5, 0.06, d);
  if (soft < 0.004) discard;
  float core = smoothstep(0.16, 0.0, d);

  vec3 deep = vec3(0.024, 0.21, 0.34);
  vec3 cyan = vec3(0.0, 0.898, 1.0);
  vec3 ice  = vec3(0.918, 0.988, 1.0);
  vec3 warm = vec3(1.0, 0.66, 0.40);
  vec3 gold = vec3(0.92, 0.70, 0.32);

  float e = clamp(vEnergy, 0.0, 1.4);
  vec3 col = mix(deep, cyan, clamp(e * 1.4, 0.0, 1.0));
  col = mix(col, ice, clamp(e - 0.55, 0.0, 0.6) * 1.1);

  float isCore = step(4.5, vCls);
  float isDust = step(3.5, vCls) * (1.0 - isCore);
  float structured = 1.0 - isDust - isCore;

  // Warm reactor core at rest (fades as the journey begins).
  col = mix(col, warm, isCore * uWarm * 0.85);

  // Disciplines ignition: lift the active lobe, dim the rest for focus.
  if (uRegion > -0.5) {
    float ignited = (abs(vCls - uRegion) < 0.5) ? 1.0 : 0.0;
    col += cyan * ignited * 0.4;
    col *= mix(1.0, 0.5, structured * (1.0 - ignited) * 0.85);
  }

  // Artifact zone: the brightest matter turns gold.
  col = mix(col, gold, uArtifact * clamp(e * 1.1 + isCore * 0.6, 0.0, 1.0) * 0.85);

  col += ice * core * (0.32 + e * 0.85);

  float alpha = soft * (0.06 + e * 0.32) * (1.0 - isDust * 0.55);
  gl_FragColor = vec4(col * uDim, alpha * min(uDim, 1.0));
}
`;

// ── Director keyframes (indexed by integer actT; K[k] = state as act k completes)
type Key = {
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
  stiff: number;
  curl: number;
  spread: number;
  dim: number;
  warm: number;
};
const KEYS: Key[] = [
  { pos: [-2.35, 0.18, 8.9], look: [0.85, 0.02, 0], fov: 45, stiff: 0.02, curl: 0.0042, spread: 1.0, dim: 1.0, warm: 1.0 },
  { pos: [-1.2, 0.32, 7.3], look: [0.3, 0.1, 0], fov: 46, stiff: 0.022, curl: 0.0038, spread: 1.04, dim: 0.55, warm: 0.55 },
  { pos: [0.0, 0.35, 6.2], look: [0.0, 0.15, 0], fov: 47, stiff: 0.024, curl: 0.0034, spread: 1.06, dim: 0.42, warm: 0.22 },
  { pos: [0.0, 0.05, 5.9], look: [0.0, 0.0, 0], fov: 48, stiff: 0.024, curl: 0.005, spread: 1.0, dim: 0.4, warm: 0.0 },
  { pos: [0.5, -0.05, 7.2], look: [0.0, 0.0, 0], fov: 45, stiff: 0.034, curl: 0.0026, spread: 0.84, dim: 0.5, warm: 0.0 },
  { pos: [-0.6, -1.05, 8.8], look: [-1.25, -0.4, 0], fov: 44, stiff: 0.022, curl: 0.003, spread: 1.05, dim: 0.26, warm: 0.0 },
  { pos: [-0.4, -0.85, 9.0], look: [-1.1, -0.28, 0], fov: 44, stiff: 0.02, curl: 0.0036, spread: 1.08, dim: 0.25, warm: 0.0 },
  { pos: [0.0, 0.05, 7.6], look: [0.0, 0.0, 0], fov: 46, stiff: 0.012, curl: 0.0055, spread: 1.35, dim: 0.6, warm: 0.0 },
];
const ss = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ramp = (t: number, a: number, b: number) => ss(clamp01((t - a) / (b - a)));

// Shared smoothed timeline for satellite components (1-frame lag acceptable).
const directorState = { actT: 0, artifact: 0 };

function Simulation({ isMobile }: { isMobile: boolean }) {
  const gl = useThree((s) => s.gl);
  const SIZE = isMobile ? 128 : 192;
  const COUNT = SIZE * SIZE;

  const pointerNdc = useRef(new THREE.Vector2(99, 99));
  const pointerWorld = useRef(new THREE.Vector3(99, 99, 0));
  const pointerPrev = useRef(new THREE.Vector3(99, 99, 0));
  const pointerBoost = useRef(0);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const actTRef = useRef(0);
  const camPos = useRef(new THREE.Vector3(-2.35, 0.18, 8.9));
  const camLook = useRef(new THREE.Vector3(0.85, 0.02, 0));
  const fovRef = useRef(45);

  useEffect(() => {
    if (isMobile) return; // touch: no pointer field interaction
    const onMove = (e: PointerEvent) => {
      pointerNdc.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    const onLeave = () => pointerNdc.current.set(99, 99);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [isMobile]);

  const { gpu, posVar, velVar, homeTex, simOk } = useMemo(() => {
    const homeData = buildHomeData(SIZE);
    const homeTex = new THREE.DataTexture(
      // TS 5.7 types Float32Array over ArrayBufferLike; three wants BufferSource.
      homeData as unknown as BufferSource,
      SIZE,
      SIZE,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    homeTex.needsUpdate = true;

    const gpu = new GPUComputationRenderer(SIZE, SIZE, gl);
    // iOS / Apple GPUs can't render to full-float targets (three.js #9628,
    // #19837) — swap the sim render targets to half float there. Slight
    // position quantization is invisible at mobile DPR; full float elsewhere.
    const isAppleTouch =
      typeof navigator !== "undefined" &&
      (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    const hasFloatRT = !!gl.extensions.get("EXT_color_buffer_float");
    if (isAppleTouch || !hasFloatRT) {
      gpu.setDataType(THREE.HalfFloatType);
    }
    const dtPos = gpu.createTexture();
    const dtVel = gpu.createTexture();
    // Seed positions from home, but keep w (energy) at zero — home's w is class.
    {
      const pd = dtPos.image.data as unknown as Float32Array;
      for (let i = 0; i < SIZE * SIZE; i++) {
        pd[i * 4 + 0] = homeData[i * 4 + 0];
        pd[i * 4 + 1] = homeData[i * 4 + 1];
        pd[i * 4 + 2] = homeData[i * 4 + 2];
        pd[i * 4 + 3] = 0;
      }
    }
    // velocities start at zero (createTexture zero-fills)

    const posVar = gpu.addVariable("texturePosition", POSITION_SHADER, dtPos);
    const velVar = gpu.addVariable("textureVelocity", VELOCITY_SHADER, dtVel);
    gpu.setVariableDependencies(posVar, [posVar, velVar]);
    gpu.setVariableDependencies(velVar, [posVar, velVar]);

    posVar.material.uniforms.uDelta = { value: 0.016 };
    posVar.material.uniforms.uTime = { value: 0 };
    posVar.material.uniforms.uPulseAmp = { value: 0.5 };

    velVar.material.uniforms.uHome = { value: homeTex };
    velVar.material.uniforms.uTime = { value: 0 };
    velVar.material.uniforms.uDelta = { value: 0.016 };
    velVar.material.uniforms.uStiffness = { value: 0.02 };
    velVar.material.uniforms.uCurlAmp = { value: 0.0042 };
    velVar.material.uniforms.uSpread = { value: 1.0 };
    velVar.material.uniforms.uRegion = { value: -1 };
    velVar.material.uniforms.uDisperse = { value: 0 };
    velVar.material.uniforms.uPointer = { value: new THREE.Vector3(99, 99, 0) };
    velVar.material.uniforms.uPointerForce = { value: 0.05 };

    const error = gpu.init();
    const simOk = error === null;
    if (!simOk) {
      // eslint-disable-next-line no-console
      console.warn("[NeuralField] GPGPU unavailable, falling back to static field:", error);
    }
    return { gpu, posVar, velVar, homeTex, simOk };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, SIZE]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const refs = new Float32Array(COUNT * 2);
    const seeds = new Float32Array(COUNT);
    const rng = mulberry32(7331);
    for (let i = 0; i < COUNT; i++) {
      refs[i * 2 + 0] = ((i % SIZE) + 0.5) / SIZE;
      refs[i * 2 + 1] = (Math.floor(i / SIZE) + 0.5) / SIZE;
      seeds[i] = rng();
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aRef", new THREE.BufferAttribute(refs, 2));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 50);
    return geo;
  }, [COUNT, SIZE]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: RENDER_VERTEX,
      fragmentShader: RENDER_FRAGMENT,
      uniforms: {
        texturePosition: { value: homeTex },
        textureVelocity: { value: homeTex },
        uHome: { value: homeTex },
        uBoot: { value: 0 },
        uTime: { value: 0 },
        uSizeScale: { value: 44 },
        uSimOn: { value: simOk ? 1 : 0 },
        uRegion: { value: -1 },
        uArtifact: { value: 0 },
        uWarm: { value: 1 },
        uDim: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
  }, [homeTex, simOk]);

  // Dispose GPU resources on unmount / breakpoint rebuild.
  useEffect(() => {
    return () => {
      try {
        const vars = (gpu as unknown as { variables?: Array<{ renderTargets: THREE.WebGLRenderTarget[] }> }).variables;
        vars?.forEach((v) => v.renderTargets?.forEach((rt) => rt.dispose()));
      } catch {
        /* dev-only safety */
      }
      homeTex.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [gpu, homeTex, geometry, material]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;

    // ── Act timeline (smoothed) ──
    // Recompute act progress from absolute scroll — deterministic, immune to
    // ScrollTrigger refresh/scrub transients.
    syncActs(scrollState.scroll);
    const targetT = actTimeline();
    actTRef.current = THREE.MathUtils.lerp(
      actTRef.current,
      targetT,
      1 - Math.exp(-dt * 5.5)
    );
    const actT = actTRef.current;
    directorState.actT = actT;

    const i0 = Math.min(Math.floor(actT), KEYS.length - 2);
    const f = ss(clamp01(actT - i0));
    const A = KEYS[i0];
    const B = KEYS[i0 + 1];
    const lerp = THREE.MathUtils.lerp;

    // Derived act signals.
    const artifact = ramp(actT, 3.0, 3.35) * (1 - ramp(actT, 4.0, 4.45));
    const disperse = ramp(actT, 6.25, 6.95);
    const inDisciplines = actT > 2.02 && actT < 3.0;
    const region = inDisciplines
      ? Math.min(3, Math.floor((actT - 2) * 4))
      : -1;
    directorState.artifact = artifact;

    // ── Pointer → world (z=0 plane) + velocity boost ──
    if (!isMobile && pointerNdc.current.x < 50) {
      raycaster.setFromCamera(pointerNdc.current, state.camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        const dist = hit.distanceTo(pointerPrev.current);
        pointerBoost.current = Math.min(
          1,
          pointerBoost.current * Math.exp(-dt * 3) + dist * 0.6
        );
        pointerPrev.current.copy(hit);
        pointerWorld.current.lerp(hit, 1 - Math.exp(-dt * 14));
      }
    } else {
      pointerWorld.current.set(99, 99, 0);
      pointerBoost.current *= Math.exp(-dt * 3);
    }

    // ── Sim uniforms + compute ──
    if (simOk) {
      const vU = velVar.material.uniforms;
      const pU = posVar.material.uniforms;
      vU.uTime.value = t;
      vU.uDelta.value = dt;
      vU.uStiffness.value = lerp(A.stiff, B.stiff, f);
      vU.uCurlAmp.value = lerp(A.curl, B.curl, f);
      vU.uSpread.value = lerp(A.spread, B.spread, f);
      vU.uRegion.value = region;
      vU.uDisperse.value = disperse;
      vU.uPointer.value.copy(pointerWorld.current);
      vU.uPointerForce.value = 0.05 + 0.13 * pointerBoost.current;
      pU.uTime.value = t;
      pU.uDelta.value = dt;
      pU.uPulseAmp.value = 0.45 + artifact * 0.45 + (region >= 0 ? 0.25 : 0);
      gpu.compute();
      material.uniforms.texturePosition.value =
        gpu.getCurrentRenderTarget(posVar).texture;
      material.uniforms.textureVelocity.value =
        gpu.getCurrentRenderTarget(velVar).texture;
    }

    // ── Render uniforms ──
    const m = material.uniforms;
    m.uBoot.value = fieldState.boot;
    m.uTime.value = t;
    m.uSizeScale.value = 28 * state.gl.getPixelRatio();
    m.uRegion.value = region;
    m.uArtifact.value = artifact;
    m.uWarm.value = lerp(A.warm, B.warm, f);
    m.uDim.value = lerp(A.dim, B.dim, f);

    // ── Camera rig ──
    const px = lerp(A.pos[0], B.pos[0], f);
    const py = lerp(A.pos[1], B.pos[1], f);
    const pz = lerp(A.pos[2], B.pos[2], f) + (isMobile ? 2.1 : 0);
    const lx = lerp(A.look[0], B.look[0], f);
    const ly = lerp(A.look[1], B.look[1], f);
    const lz = lerp(A.look[2], B.look[2], f);
    // Disciplines lateral travel: pan across the mass as regions ignite.
    const discLocal = clamp01(actT - 2);
    const pan = inDisciplines ? discLocal * 2.8 - 1.4 : 0;

    const smooth = 1 - Math.exp(-dt * 2.6);
    camPos.current.x = lerp(camPos.current.x, px + pan * 0.8, smooth);
    camPos.current.y = lerp(camPos.current.y, py, smooth);
    camPos.current.z = lerp(camPos.current.z, pz, smooth);
    camLook.current.x = lerp(camLook.current.x, lx + pan * 0.5, smooth);
    camLook.current.y = lerp(camLook.current.y, ly, smooth);
    camLook.current.z = lerp(camLook.current.z, lz, smooth);
    fovRef.current = lerp(fovRef.current, lerp(A.fov, B.fov, f), smooth);

    // Organic micro-drift.
    const bobX = Math.cos(t * 0.17) * 0.16;
    const bobY = Math.sin(t * 0.24) * 0.11;
    state.camera.position.set(
      camPos.current.x + bobX,
      camPos.current.y + bobY,
      camPos.current.z + Math.sin(t * 0.11) * 0.09
    );
    state.camera.lookAt(
      camLook.current.x + Math.sin(t * 0.19) * 0.04,
      camLook.current.y + Math.cos(t * 0.27) * 0.03,
      camLook.current.z
    );
    const cam = state.camera as THREE.PerspectiveCamera;
    if (cam.isPerspectiveCamera && Math.abs(cam.fov - fovRef.current) > 0.01) {
      cam.fov = fovRef.current;
      cam.updateProjectionMatrix();
    }
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

// ── Atmosphere skybox (ported; gold ambience keyed to the artifact act) ─────
function AtmosphereBg() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    matRef.current.uniforms.uGold.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uGold.value,
      directorState.artifact,
      1 - Math.exp(-delta * 4)
    );
  });

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uGold: { value: 0 } }),
    []
  );

  const vertexShader = /* glsl */ `
    varying vec3 vWorldDir;
    void main() {
      vWorldDir = normalize(position);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform float uTime;
    uniform float uGold;
    varying vec3 vWorldDir;

    float hash3(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
    }
    float vnoise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float n000 = hash3(i);
      float n100 = hash3(i + vec3(1.0, 0.0, 0.0));
      float n010 = hash3(i + vec3(0.0, 1.0, 0.0));
      float n110 = hash3(i + vec3(1.0, 1.0, 0.0));
      float n001 = hash3(i + vec3(0.0, 0.0, 1.0));
      float n101 = hash3(i + vec3(1.0, 0.0, 1.0));
      float n011 = hash3(i + vec3(0.0, 1.0, 1.0));
      float n111 = hash3(i + vec3(1.0, 1.0, 1.0));
      float n00 = mix(n000, n100, f.x);
      float n10 = mix(n010, n110, f.x);
      float n01 = mix(n001, n101, f.x);
      float n11 = mix(n011, n111, f.x);
      return mix(mix(n00, n10, f.y), mix(n01, n11, f.y), f.z);
    }
    float fbm3(vec3 p) {
      float s = 0.0;
      float a = 0.55;
      for (int i = 0; i < 5; i++) {
        s += vnoise(p) * a;
        p *= 2.07;
        a *= 0.52;
      }
      return s;
    }
    float stars(vec3 dir) {
      vec3 s = dir * 220.0;
      float n = hash3(floor(s));
      return smoothstep(0.9965, 0.9998, n);
    }

    void main() {
      vec3 d = normalize(vWorldDir);
      float t = uTime * 0.018;
      float driftA = fbm3(d * 2.2 + vec3(t, t * 0.62, -t * 0.41));
      float driftB = fbm3(d * 5.6 - vec3(t * 0.48, t * 0.22, t * 0.35));
      float nebula = driftA * 0.72 + driftB * 0.28;

      vec3 deepSpace  = vec3(0.003, 0.005, 0.013);
      vec3 nightTeal  = vec3(0.008, 0.028, 0.050);
      vec3 plasmaBlue = vec3(0.014, 0.028, 0.095);
      vec3 violetGas  = vec3(0.055, 0.018, 0.098);
      vec3 goldWarm   = vec3(0.195, 0.120, 0.032);

      float tealMix   = smoothstep(0.28, 0.62, nebula);
      float plasmaMix = smoothstep(0.44, 0.78, nebula);
      float violetMix = smoothstep(0.58, 0.88, nebula);
      float goldMix   = smoothstep(0.82, 0.97, nebula);

      vec3 col = deepSpace;
      col = mix(col, nightTeal,   tealMix * 0.55);
      col = mix(col, plasmaBlue,  plasmaMix * 0.45);
      col = mix(col, violetGas,   violetMix * 0.50);
      col += goldWarm * goldMix * 0.05;

      // Artifact-act ambience: the nebula warms gold around the product.
      col += goldWarm * uGold * (0.10 + nebula * 0.14);

      float vert = smoothstep(-0.6, 0.9, d.y);
      col *= mix(1.1, 0.58, vert);
      float horizon = exp(-pow(d.y, 2.0) * 7.0);
      col += vec3(0.008, 0.014, 0.026) * horizon * 0.30;

      col += vec3(0.75, 0.85, 1.0) * stars(d) * 0.32;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  return (
    <mesh scale={[140, 140, 140]} frustumCulled={false} renderOrder={-1}>
      <sphereGeometry args={[1, 48, 32]} />
      <shaderMaterial
        ref={matRef}
        side={THREE.BackSide}
        depthWrite={false}
        depthTest={false}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

// ── Neural discharges (ported; lightning arcs across the mass) ──────────────
const DISCHARGE_COUNT = 9;
const DISCHARGE_SEGMENTS = 18;

function Discharges() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const visRef = useRef(1);

  const { positions, arcAttribs } = useMemo(() => {
    const { hubs } = buildHubs();
    let seedState = 24601;
    const rng = () => {
      seedState = (seedState * 16807) % 2147483647;
      return seedState / 2147483647;
    };

    const VERTS_PER_ARC = DISCHARGE_SEGMENTS * 2;
    const pos = new Float32Array(DISCHARGE_COUNT * VERTS_PER_ARC * 3);
    const attrs = new Float32Array(DISCHARGE_COUNT * VERTS_PER_ARC * 2);

    for (let a = 0; a < DISCHARGE_COUNT; a++) {
      const i1 = Math.floor(rng() * hubs.length);
      const spread =
        Math.floor(hubs.length * 0.22) + Math.floor(rng() * hubs.length * 0.5);
      const i2 = (i1 + spread) % hubs.length;
      const p1 = hubs[i1];
      const p2 = hubs[i2];

      const mid = [
        (p1[0] + p2[0]) * 0.5,
        (p1[1] + p2[1]) * 0.5,
        (p1[2] + p2[2]) * 0.5,
      ];
      const dLen = Math.max(
        0.0001,
        Math.sqrt(mid[0] * mid[0] + mid[1] * mid[1] + mid[2] * mid[2])
      );
      const bow = 0.5 + rng() * 0.35;
      const arcMid = [
        mid[0] + (mid[0] / dLen) * bow,
        mid[1] + (mid[1] / dLen) * bow,
        mid[2] + (mid[2] / dLen) * bow,
      ];

      const pts: [number, number, number][] = [];
      for (let s = 0; s <= DISCHARGE_SEGMENTS; s++) {
        const t = s / DISCHARGE_SEGMENTS;
        const omt = 1 - t;
        const bx = omt * omt * p1[0] + 2 * omt * t * arcMid[0] + t * t * p2[0];
        const by = omt * omt * p1[1] + 2 * omt * t * arcMid[1] + t * t * p2[1];
        const bz = omt * omt * p1[2] + 2 * omt * t * arcMid[2] + t * t * p2[2];
        const jitter = 0.12 * Math.sin(t * Math.PI);
        pts.push([
          bx + (rng() - 0.5) * jitter,
          by + (rng() - 0.5) * jitter,
          bz + (rng() - 0.5) * jitter,
        ]);
      }

      for (let s = 0; s < DISCHARGE_SEGMENTS; s++) {
        const base = (a * VERTS_PER_ARC + s * 2) * 3;
        const att = (a * VERTS_PER_ARC + s * 2) * 2;
        const v1 = pts[s];
        const v2 = pts[s + 1];
        pos[base + 0] = v1[0];
        pos[base + 1] = v1[1];
        pos[base + 2] = v1[2];
        pos[base + 3] = v2[0];
        pos[base + 4] = v2[1];
        pos[base + 5] = v2[2];
        attrs[att + 0] = a;
        attrs[att + 1] = s / DISCHARGE_SEGMENTS;
        attrs[att + 2] = a;
        attrs[att + 3] = (s + 1) / DISCHARGE_SEGMENTS;
      }
    }
    return { positions: pos, arcAttribs: attrs };
  }, []);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uVis: { value: 1 } }),
    []
  );

  useFrame((state, delta) => {
    if (!matRef.current) return;
    const actT = directorState.actT;
    // Visible while the mind is the subject; returns for the finale.
    const target =
      Math.max(0, 1 - Math.max(0, actT - 0.85) * 0.9) * 0.9 +
      ramp(actT, 6.3, 6.8) * 0.55;
    visRef.current = THREE.MathUtils.lerp(
      visRef.current,
      target,
      1 - Math.exp(-delta * 4)
    );
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    matRef.current.uniforms.uVis.value = visRef.current;
  });

  const vertexShader = /* glsl */ `
    uniform float uTime;
    attribute vec2 aArc;
    varying float vArcIdx;
    varying float vT;
    void main() {
      vec3 p = position;
      float spin = uTime * 0.1;
      p.xz = mat2(cos(spin), -sin(spin), sin(spin), cos(spin)) * p.xz;
      vArcIdx = aArc.x;
      vT = aArc.y;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform float uTime;
    uniform float uVis;
    varying float vArcIdx;
    varying float vT;
    void main() {
      float cycle = 8.0;
      float offset = fract(sin(vArcIdx * 12.9898) * 43758.5453) * cycle;
      float phase = mod(uTime + offset, cycle);
      float activeDuration = 0.55;

      float vis = smoothstep(0.0, 0.04, phase) *
                  (1.0 - smoothstep(0.35, activeDuration, phase));

      float pulseCenter = (phase / activeDuration) * 1.15 - 0.075;
      float pulseDist = abs(vT - pulseCenter);
      float pulse = 1.0 - smoothstep(0.0, 0.14, pulseDist);

      float arcShape = sin(vT * 3.14159);
      float alpha = vis * (0.18 + pulse * 0.82) * arcShape * uVis;
      vec3 col = mix(vec3(0.08, 0.72, 1.0), vec3(0.95, 0.98, 1.0), pulse) *
                 (1.4 + pulse * 4.8);
      gl_FragColor = vec4(col, alpha);
    }
  `;

  return (
    <lineSegments frustumCulled={false} renderOrder={2}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aArc"
          args={[arcAttribs, 2]}
          count={arcAttribs.length / 2}
          array={arcAttribs}
          itemSize={2}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </lineSegments>
  );
}

// ── Orbital probes (ported; tilted rings, fade after the hero) ───────────────
const ORBITAL_PROBE_COUNT = 220;

function Orbitals() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const visRef = useRef(1);

  const { positions, ringData } = useMemo(() => {
    const pos = new Float32Array(ORBITAL_PROBE_COUNT * 3);
    const meta = new Float32Array(ORBITAL_PROBE_COUNT * 4);
    for (let i = 0; i < ORBITAL_PROBE_COUNT; i++) {
      const ringIdx = i % 4;
      const seed = hash3(i * 0.137, i * 0.241, i * 0.339);
      meta[i * 4 + 0] = ringIdx;
      meta[i * 4 + 1] = seed * Math.PI * 2;
      meta[i * 4 + 2] = 1 + (seed - 0.5) * 0.18;
      meta[i * 4 + 3] = 1 + (seed - 0.5) * 0.6;
    }
    return { positions: pos, ringData: meta };
  }, []);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uVis: { value: 1 } }),
    []
  );

  useFrame((state, delta) => {
    if (!matRef.current) return;
    const actT = directorState.actT;
    const target = Math.max(0, 1 - Math.max(0, actT - 0.6) * 1.1);
    visRef.current = THREE.MathUtils.lerp(
      visRef.current,
      target,
      1 - Math.exp(-delta * 4)
    );
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    matRef.current.uniforms.uVis.value = visRef.current;
  });

  const vertexShader = /* glsl */ `
    uniform float uTime;
    attribute vec4 aRing;
    varying float vSpark;
    void main() {
      float ringIdx = aRing.x;
      float phase = aRing.y;
      float radiusScale = aRing.z;
      float speedScale = aRing.w;

      float baseRadius = 3.6;
      float tiltX, tiltZ, spinSpeed;
      if (ringIdx < 0.5)      { tiltX = 0.12;  tiltZ = 0.28;  spinSpeed = 0.18; }
      else if (ringIdx < 1.5) { tiltX = -0.35; tiltZ = 0.08;  spinSpeed = -0.12; }
      else if (ringIdx < 2.5) { tiltX = 0.55;  tiltZ = -0.20; spinSpeed = 0.09; }
      else                    { tiltX = -0.15; tiltZ = -0.45; spinSpeed = 0.22; }

      float angle = phase + uTime * spinSpeed * speedScale;
      float r = baseRadius * radiusScale;
      vec3 local = vec3(cos(angle) * r, 0.0, sin(angle) * r);

      mat3 tilt = mat3(
        cos(tiltZ), -sin(tiltZ) * cos(tiltX),  sin(tiltZ) * sin(tiltX),
        sin(tiltZ),  cos(tiltZ) * cos(tiltX), -cos(tiltZ) * sin(tiltX),
        0.0,         sin(tiltX),               cos(tiltX)
      );
      local = tilt * local;
      local *= 1.0 + sin(uTime * 0.38 + phase * 2.1) * 0.04;

      vec4 mv = modelViewMatrix * vec4(local, 1.0);
      gl_Position = projectionMatrix * mv;
      float dist = -mv.z;
      gl_PointSize = clamp(1.4 + 60.0 / dist, 1.0, 4.6) * (0.8 + radiusScale * 0.4);
      vSpark = smoothstep(0.92, 1.0, sin(uTime * (1.0 + speedScale) + phase * 4.2) * 0.5 + 0.5);
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform float uVis;
    varying float vSpark;
    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float d = dot(uv, uv);
      float soft = smoothstep(0.25, 0.0, d);
      vec3 col = mix(vec3(0.05, 0.9, 1.0), vec3(0.85, 0.97, 1.0), vSpark) * (1.0 + vSpark * 1.8);
      gl_FragColor = vec4(col, soft * uVis * 0.85);
    }
  `;

  return (
    <points frustumCulled={false} renderOrder={2}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={ORBITAL_PROBE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRing"
          args={[ringData, 4]}
          count={ORBITAL_PROBE_COUNT}
          array={ringData}
          itemSize={4}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
}

export default function NeuralField() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-[#020308]">
      <Canvas
        frameloop="always"
        dpr={isMobile ? [1, 1.5] : [1, 1.75]}
        camera={{ position: [-2.35, 0.18, 8.9], fov: 45 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
        }}
      >
        <color attach="background" args={["#020308"]} />
        <AtmosphereBg />
        <Discharges />
        <Orbitals />
        <Simulation key={isMobile ? "m" : "d"} isMobile={isMobile} />
        {POSTFX_ENABLED && (
          <EffectComposer
            multisampling={0}
            frameBufferType={THREE.HalfFloatType}
            enableNormalPass={false}
          >
            <Bloom
              intensity={0.75}
              luminanceThreshold={0.38}
              luminanceSmoothing={0.8}
              mipmapBlur
              radius={0.7}
              levels={7}
            />
            <ChromaticAberration
              offset={new THREE.Vector2(0.0012, 0.0012)}
              blendFunction={BlendFunction.NORMAL}
              radialModulation={true}
              modulationOffset={0.35}
            />
            <Vignette eskil={false} offset={0.28} darkness={0.62} />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
            <SMAA />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
