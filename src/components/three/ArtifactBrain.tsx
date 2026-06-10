"use client";

// ArtifactBrain — the ONE living object on the site (Direction A:
// Typographic Authority). A contained, calm port of the tuned
// SpatialBackground shard-brain: crisp tetrahedra, cortex folds, warm core,
// neural edge lines, slow spin, breathing. No scroll coupling, no pointer
// physics, no pulse theatrics. Lives inside the Brain Operator act only —
// motion tied to subject.

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";

const COUNT = 3200;
const BRAIN_RADIUS = 13.8;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const COLOR_PALETTE = [
  new THREE.Color("#00E5FF"),
  new THREE.Color("#3AD9FF"),
  new THREE.Color("#9FE9FF"),
  new THREE.Color("#E8FBFF"),
];
const WARM_CORE = new THREE.Color("#FFB070");

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

function Shards() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, seeds, colors } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const sds = new Float32Array(COUNT);
    const cols = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const k = i + 0.5;
      const seed = hash3(k * 0.173, k * 0.219, 7.3);
      sds[i] = seed;

      const fy = 1 - (2 * k) / COUNT;
      const fr = Math.sqrt(Math.max(0, 1 - fy * fy));
      const th = GOLDEN_ANGLE * k;
      const dx = Math.cos(th) * fr;
      const dz = Math.sin(th) * fr;

      const interior = hash3(k * 0.331, 1.13, k * 0.197) < 0.28;
      let r: number;
      if (interior) {
        const rn = hash3(k * 0.119, 2.7, k * 0.353);
        r = (0.22 + Math.sqrt(rn) * 0.68) * BRAIN_RADIUS;
      } else {
        const fold = fbm(dx * 1.9, fy * 1.9, dz * 1.9);
        const detail = fbm(dx * 4.3, fy * 4.3, dz * 4.3);
        r = BRAIN_RADIUS * (1 + fold * 0.11 + detail * 0.035);
      }

      pos[i * 3 + 0] = dx * r;
      pos[i * 3 + 1] = fy * r;
      pos[i * 3 + 2] = dz * r;

      let color: THREE.Color;
      if (interior && r < BRAIN_RADIUS * 0.55) {
        color = WARM_CORE;
      } else {
        color = COLOR_PALETTE[3];
        if (seed < 0.42) color = COLOR_PALETTE[0];
        else if (seed < 0.72) color = COLOR_PALETTE[1];
        else if (seed < 0.9) color = COLOR_PALETTE[2];
      }
      cols[i * 3 + 0] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return { positions: pos, seeds: sds, colors: cols };
  }, []);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const vertexShader = /* glsl */ `
    uniform float uTime;
    attribute vec3 aPos;
    attribute float aSeed;
    attribute vec3 aColor;
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      // Slow whole-brain spin.
      float spin = uTime * 0.085;
      mat2 rot = mat2(cos(spin), -sin(spin), sin(spin), cos(spin));
      vec3 inst = aPos;
      inst.xz = rot * inst.xz;

      // Breathing: global radial pulse + per-shard ripple.
      float len = max(length(inst), 0.001);
      vec3 dir = inst / len;
      float breath = 1.0 + sin(uTime * 0.42) * 0.028;
      float ripple = sin(uTime * 0.62 + aSeed * 6.2831) * 0.22;
      inst = dir * (len * breath + ripple);

      // Per-shard tumble.
      float ang = uTime * (0.7 + aSeed * 2.2) + aSeed * 6.2831;
      mat2 rx = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
      float a2 = ang * 0.8;
      mat2 ry = mat2(cos(a2), -sin(a2), sin(a2), cos(a2));
      float warm = step(0.2, aColor.r - aColor.b);
      float scale = mix(0.08, 0.32, aSeed) * mix(1.0, 1.7, warm);
      vec3 local = position * scale;
      local.yz = rx * local.yz;
      local.xz = ry * local.xz;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(inst + local, 1.0);

      float flicker = 0.72 + 0.28 * sin(uTime * (1.8 + aSeed * 7.0) + aSeed * 48.0);
      float brightness = (0.55 + flicker * 0.75) * mix(1.0, 1.5, warm);
      vColor = aColor * brightness;
      vAlpha = clamp((0.24 + flicker * 0.42) * mix(1.0, 1.5, warm), 0.12, 0.98);
    }
  `;

  const fragmentShader = /* glsl */ `
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      gl_FragColor = vec4(vColor, vAlpha);
    }
  `;

  return (
    <instancedMesh
      args={[undefined as unknown as THREE.BufferGeometry, undefined as unknown as THREE.Material, COUNT]}
      frustumCulled={false}
    >
      <tetrahedronGeometry args={[1, 0]}>
        <instancedBufferAttribute attach="attributes-aPos" args={[positions, 3]} />
        <instancedBufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <instancedBufferAttribute attach="attributes-aColor" args={[colors, 3]} />
      </tetrahedronGeometry>
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </instancedMesh>
  );
}

function Edges() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const positions = useMemo(() => {
    const surface: [number, number, number][] = [];
    for (let i = 0; i < COUNT; i++) {
      const k = i + 0.5;
      if (hash3(k * 0.331, 1.13, k * 0.197) < 0.28) continue;
      const fy = 1 - (2 * k) / COUNT;
      const fr = Math.sqrt(Math.max(0, 1 - fy * fy));
      const th = GOLDEN_ANGLE * k;
      const dx = Math.cos(th) * fr;
      const dz = Math.sin(th) * fr;
      const fold = fbm(dx * 1.9, fy * 1.9, dz * 1.9);
      const detail = fbm(dx * 4.3, fy * 4.3, dz * 4.3);
      const r = BRAIN_RADIUS * (1 + fold * 0.11 + detail * 0.035);
      surface.push([dx * r, fy * r, dz * r]);
    }
    const K_OFFSETS = [8, 13, 21, 34];
    const MAX_D2 = 4.2;
    const out: number[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < surface.length; i++) {
      for (const off of K_OFFSETS) {
        const j = (i + off) % surface.length;
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const a = surface[i];
        const b = surface[j];
        const ddx = a[0] - b[0];
        const ddy = a[1] - b[1];
        const ddz = a[2] - b[2];
        if (ddx * ddx + ddy * ddy + ddz * ddz > MAX_D2) continue;
        out.push(a[0], a[1], a[2], b[0], b[1], b[2]);
      }
    }
    return new Float32Array(out);
  }, []);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const vertexShader = /* glsl */ `
    uniform float uTime;
    void main() {
      vec3 p = position;
      float spin = uTime * 0.085;
      p.xz = mat2(cos(spin), -sin(spin), sin(spin), cos(spin)) * p.xz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }
  `;
  const fragmentShader = /* glsl */ `
    uniform float uTime;
    void main() {
      float pulse = 0.78 + 0.32 * sin(uTime * 0.55);
      gl_FragColor = vec4(vec3(0.02, 0.82, 1.0) * 0.65 * pulse, 0.16);
    }
  `;

  return (
    <lineSegments frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </lineSegments>
  );
}

export default function ArtifactBrain({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Mount the canvas only once the panel approaches the viewport.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "240px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={`pointer-events-none ${className}`}>
      {visible && (
        <Canvas
          frameloop="always"
          dpr={[1, 1.75]}
          camera={{ position: [0, 0, 34], fov: 45 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.NoToneMapping,
          }}
        >
          <Edges />
          <Shards />
          <EffectComposer multisampling={0} frameBufferType={THREE.HalfFloatType} enableNormalPass={false}>
            <Bloom
              intensity={1.05}
              luminanceThreshold={0.16}
              luminanceSmoothing={0.85}
              mipmapBlur
              radius={0.78}
              levels={7}
            />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          </EffectComposer>
        </Canvas>
      )}
    </div>
  );
}
