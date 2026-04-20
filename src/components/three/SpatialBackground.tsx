"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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

const POSTFX_ENABLED = process.env.NEXT_PUBLIC_POSTFX !== "0";

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

const CORE_PARTICLE_COUNT = 5000;
const AMBIENT_PARTICLE_COUNT = 360;
const PARTICLE_COUNT = CORE_PARTICLE_COUNT + AMBIENT_PARTICLE_COUNT;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const COLOR_PALETTE = [
  new THREE.Color("#00F2FE"),
  new THREE.Color("#0055FF"),
  new THREE.Color("#7000FF"),
  new THREE.Color("#FFD700"),
];

const Particles = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const scrollTargetRef = useRef(0);
  const systemStageTargetRef = useRef(0);
  const systemSectionRef = useRef<HTMLElement | null>(null);
  const pointerNdcRef = useRef(new THREE.Vector2(999, 999));
  const pointerWorldRef = useRef(new THREE.Vector3(999, 999, 0));
  const parallaxRef = useRef(new THREE.Vector2(0, 0));
  const hoverTargetRef = useRef(0);
  const hoverMixRef = useRef(0);

  useEffect(() => {
    const updateScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      scrollTargetRef.current = THREE.MathUtils.clamp(
        window.scrollY / maxScroll,
        0,
        1
      );

      if (!systemSectionRef.current) {
        systemSectionRef.current = document.getElementById("system");
      }

      if (systemSectionRef.current) {
        const rect = systemSectionRef.current.getBoundingClientRect();
        const stageSpan = window.innerHeight + rect.height;
        systemStageTargetRef.current = THREE.MathUtils.clamp(
          (window.innerHeight - rect.top) / stageSpan,
          0,
          1
        );
      }
    };

    const resetPointer = () => {
      pointerNdcRef.current.set(999, 999);
      hoverTargetRef.current = 0;
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerNdcRef.current.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
      hoverTargetRef.current = 1;
    };

    updateScroll();

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, {
      capture: true,
      passive: true,
    });
    window.addEventListener("pointerleave", resetPointer, { passive: true });
    window.addEventListener("blur", resetPointer);

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      window.removeEventListener("pointermove", handlePointerMove, true);
      window.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("blur", resetPointer);
    };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uSystemStage: { value: 0 },
      uMobileMix: { value: 0 },
      uMouse: { value: new THREE.Vector3(999, 999, 0) },
      uParallax: { value: new THREE.Vector2(0, 0) },
      uHover: { value: 0 },
    }),
    []
  );

  const { posA, posB, posC, seeds, colors, ambientFlags } = useMemo(() => {
    const pA = new Float32Array(PARTICLE_COUNT * 3);
    const pB = new Float32Array(PARTICLE_COUNT * 3);
    const pC = new Float32Array(PARTICLE_COUNT * 3);
    const particleSeeds = new Float32Array(PARTICLE_COUNT);
    const cols = new Float32Array(PARTICLE_COUNT * 3);
    const ambient = new Float32Array(PARTICLE_COUNT);

    const BRAIN_RADIUS = 13.8;
    const BRAIN_CX = 17.2;
    const BRAIN_CZ = -5.5;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseIndex = i * 3;
      const seed = Math.random();
      particleSeeds[i] = seed;
      const isAmbient = i >= CORE_PARTICLE_COUNT;
      ambient[i] = isAmbient ? 1 : 0;

      if (isAmbient) {
        const ambientAngle = i * GOLDEN_ANGLE;
        const ambientRadius = 16 + Math.pow(seed, 0.48) * 34;
        const ambientX =
          Math.cos(ambientAngle) * ambientRadius +
          (Math.random() - 0.5) * 4 +
          2.8;
        const ambientY =
          (Math.random() - 0.5) * 28 + Math.sin(ambientAngle * 1.6) * 3.5;
        const ambientZ = (Math.random() - 0.5) * 20;

        pA[baseIndex] = ambientX;
        pA[baseIndex + 1] = ambientY;
        pA[baseIndex + 2] = ambientZ;
        pB[baseIndex] = ambientX;
        pB[baseIndex + 1] = ambientY;
        pB[baseIndex + 2] = ambientZ;
        pC[baseIndex] = ambientX;
        pC[baseIndex + 1] = ambientY;
        pC[baseIndex + 2] = ambientZ;

        const colorRoll = seed;
        let color = COLOR_PALETTE[3];
        if (colorRoll < 0.42) color = COLOR_PALETTE[0];
        else if (colorRoll < 0.72) color = COLOR_PALETTE[1];
        else if (colorRoll < 0.9) color = COLOR_PALETTE[2];
        cols[baseIndex] = color.r;
        cols[baseIndex + 1] = color.g;
        cols[baseIndex + 2] = color.b;
        continue;
      }

      // Fibonacci-lattice direction on unit sphere.
      const coreIdx = i + 0.5;
      const fibY = 1 - (2 * coreIdx) / CORE_PARTICLE_COUNT;
      const fibR = Math.sqrt(Math.max(0, 1 - fibY * fibY));
      const fibTheta = GOLDEN_ANGLE * coreIdx;
      const dirX = Math.cos(fibTheta) * fibR;
      const dirZ = Math.sin(fibTheta) * fibR;
      const dirY = fibY;

      // ~28% volumetric interior, ~72% surface shell with organic cortex folds.
      const interiorRoll = hash3(coreIdx * 0.173, coreIdx * 0.219, 7.3);
      const isInterior = interiorRoll < 0.28;

      let radialScale: number;
      if (isInterior) {
        // Weighted toward outer interior (sqrt for volume-balanced distribution).
        const rNorm = hash3(coreIdx * 0.331, 1.13, coreIdx * 0.197);
        radialScale = 0.22 + Math.sqrt(rNorm) * 0.68;
      } else {
        const foldNoise = fbm(dirX * 1.9, dirY * 1.9, dirZ * 1.9);
        const detailNoise = fbm(dirX * 4.3, dirY * 4.3, dirZ * 4.3);
        radialScale = 1 + foldNoise * 0.11 + detailNoise * 0.035;
      }
      const brainRadius = BRAIN_RADIUS * radialScale;

      pA[baseIndex] = BRAIN_CX + dirX * brainRadius;
      pA[baseIndex + 1] = dirY * brainRadius;
      pA[baseIndex + 2] = BRAIN_CZ + dirZ * brainRadius;

      const fieldAngle = i * GOLDEN_ANGLE;
      const fieldRadius = 12 + Math.pow(seed, 0.45) * 42;
      pB[baseIndex] =
        Math.cos(fieldAngle) * fieldRadius +
        Math.sin(seed * 16 + fieldAngle) * 1.8;
      pB[baseIndex + 1] =
        (Math.random() - 0.5) * 38 +
        Math.sin(fieldAngle * 0.65) * 2.2;
      pB[baseIndex + 2] =
        Math.sin(fieldAngle) * fieldRadius * 0.35 +
        (Math.random() - 0.5) * 24;

      const t = i / CORE_PARTICLE_COUNT;
      const roseAngle = i * GOLDEN_ANGLE * 1.56 + seed * 0.95;
      const roseCenterX = 15.8;
      const roseCenterY = 1.8;
      const roseCenterZ = -4.0;
      const leafAngle = seed * Math.PI * 2;

      if (t < 0.68) {
        const petalT = t / 0.68;
        const shell = Math.pow(petalT, 0.78);
        const spiralAngle = roseAngle + shell * 4.2;
        const petalWave = Math.sin(spiralAngle * 4.0 + shell * 10.5);
        const petalRadius =
          1.0 + shell * 5.8 + petalWave * (0.3 + shell * 0.95);
        const budLift = Math.pow(1 - shell, 0.8);

        pC[baseIndex] =
          roseCenterX +
          Math.cos(spiralAngle) * petalRadius * 1.2 +
          shell * 1.35 +
          Math.sin(shell * Math.PI * 2 + seed * 5.0) * 0.22;
        pC[baseIndex + 1] =
          roseCenterY +
          Math.sin(spiralAngle) * petalRadius * 0.78 +
          budLift * 2.9 -
          shell * 0.9 +
          Math.abs(Math.sin(spiralAngle * 1.8 + seed * 2.0)) * 0.2;
        pC[baseIndex + 2] =
          roseCenterZ +
          Math.sin(spiralAngle) * petalRadius * 0.46 +
          Math.sin(shell * 8.0 + seed * 6.0) * 0.2;
      } else if (t < 0.84) {
        const stemT = (t - 0.68) / 0.16;
        const stemRadius = 0.12 + seed * 0.14;

        pC[baseIndex] =
          19.4 +
          stemT * 4.5 +
          Math.sin(stemT * Math.PI * 1.4) * 0.22 +
          Math.cos(leafAngle) * stemRadius;
        pC[baseIndex + 1] =
          -1.0 -
          stemT * 11.8 +
          Math.sin(leafAngle) * stemRadius * 0.35;
        pC[baseIndex + 2] =
          roseCenterZ +
          Math.sin(stemT * Math.PI + seed * 4.0) * 0.18 +
          Math.sin(leafAngle) * stemRadius * 0.8;
      } else if (t < 0.92) {
        const leafT = (t - 0.84) / 0.08;
        const leafWidth = Math.sin(leafT * Math.PI) * (1.8 + seed * 1.2);

        pC[baseIndex] =
          20.4 + leafT * 4.2 + Math.cos(leafAngle) * leafWidth * 0.45;
        pC[baseIndex + 1] =
          -4.0 +
          leafT * 3.8 +
          Math.sin(leafAngle) * leafWidth * 0.55 +
          Math.sin(seed * 18.0 + leafT * 8.0) * 0.08;
        pC[baseIndex + 2] =
          roseCenterZ + Math.sin(leafAngle) * leafWidth * 0.28;
      } else {
        const leafT = (t - 0.92) / 0.08;
        const leafWidth = Math.sin(leafT * Math.PI) * (1.7 + seed * 1.1);

        pC[baseIndex] =
          20.8 + leafT * 4.0 + Math.cos(leafAngle) * leafWidth * 0.5;
        pC[baseIndex + 1] =
          -8.3 +
          leafT * 1.8 -
          Math.sin(leafAngle) * leafWidth * 0.52 +
          Math.cos(seed * 16.0 + leafT * 7.0) * 0.08;
        pC[baseIndex + 2] =
          roseCenterZ + Math.sin(leafAngle) * leafWidth * 0.28;
      }

      const colorRoll = seed;
      let color = COLOR_PALETTE[3];
      if (colorRoll < 0.42) color = COLOR_PALETTE[0];
      else if (colorRoll < 0.72) color = COLOR_PALETTE[1];
      else if (colorRoll < 0.9) color = COLOR_PALETTE[2];

      cols[baseIndex] = color.r;
      cols[baseIndex + 1] = color.g;
      cols[baseIndex + 2] = color.b;
    }

    return {
      posA: pA,
      posB: pB,
      posC: pC,
      seeds: particleSeeds,
      colors: cols,
      ambientFlags: ambient,
    };
  }, []);

  useFrame((state, delta) => {
    if (!materialRef.current || !meshRef.current) return;

    const smoothing = 1 - Math.exp(-delta * 8);
    hoverMixRef.current = THREE.MathUtils.lerp(
      hoverMixRef.current,
      hoverTargetRef.current,
      1 - Math.exp(-delta * 12)
    );
    pointerWorldRef.current.set(
      (pointerNdcRef.current.x * state.viewport.width) / 2,
      (pointerNdcRef.current.y * state.viewport.height) / 2,
      0
    );
    if (hoverTargetRef.current) {
      parallaxRef.current.lerp(pointerNdcRef.current, 1 - Math.exp(-delta * 4));
    } else {
      parallaxRef.current.multiplyScalar(Math.exp(-delta * 4));
    }

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uProgress.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uProgress.value,
      scrollTargetRef.current,
      smoothing
    );
    materialRef.current.uniforms.uSystemStage.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uSystemStage.value,
      systemStageTargetRef.current,
      1 - Math.exp(-delta * 7)
    );
    materialRef.current.uniforms.uMobileMix.value = THREE.MathUtils.clamp(
      (22 - state.viewport.width) / 10,
      0,
      1
    );
    materialRef.current.uniforms.uMouse.value.lerp(
      pointerWorldRef.current,
      1 - Math.exp(-delta * 14)
    );
    materialRef.current.uniforms.uParallax.value.copy(parallaxRef.current);
    materialRef.current.uniforms.uHover.value = hoverMixRef.current;

    meshRef.current.rotation.y = 0;
    meshRef.current.rotation.x = 0;
  });

  const vertexShader = `
    uniform float uTime;
    uniform float uProgress;
    uniform float uSystemStage;
    uniform float uMobileMix;
    uniform float uHover;
    uniform vec2 uParallax;
    uniform vec3 uMouse;
    
    attribute vec3 aPosA;
    attribute vec3 aPosB;
    attribute vec3 aPosC;
    attribute float aSeed;
    attribute float aAmbient;
    attribute vec3 aColor;
    
    varying vec3 vColor;
    varying float vAlpha;

    const vec2 BRAIN_CENTER_XZ = vec2(17.2, -5.5);
    const vec2 LATTICE_CENTER_XZ = vec2(18.0, -4.0);
    const vec3 BRAIN_ANCHOR_MOBILE = vec3(3.0, -5.8, -5.5);
    const vec3 ROSE_ANCHOR_MOBILE = vec3(0.0, -1.8, -4.0);

    void main() {
      float brainSpin = uTime * 0.14;
      mat2 brainRot = mat2(
        cos(brainSpin),
        -sin(brainSpin),
        sin(brainSpin),
        cos(brainSpin)
      );
      vec3 brainPos = aPosA;
      brainPos.xz -= BRAIN_CENTER_XZ;
      brainPos.xz = brainRot * brainPos.xz;
      brainPos.xz += BRAIN_CENTER_XZ;

      // Breathing: global radial pulse + per-particle ripple along surface normal.
      vec3 brainCenter3 = vec3(BRAIN_CENTER_XZ.x, 0.0, BRAIN_CENTER_XZ.y);
      vec3 brainRel = brainPos - brainCenter3;
      float brainLen = length(brainRel);
      float brainLenSafe = max(brainLen, 0.001);
      vec3 brainDir = brainRel / brainLenSafe;
      float globalBreath = 1.0 + sin(uTime * 0.42) * 0.028;
      float ripple = sin(uTime * 0.62 + aSeed * 6.2831) * 0.22;
      brainPos = brainDir * (brainLen * globalBreath + ripple) + brainCenter3;

      brainPos = mix(
        brainPos,
        (brainPos - vec3(BRAIN_CENTER_XZ.x, 0.0, BRAIN_CENTER_XZ.y)) * 0.58 +
          BRAIN_ANCHOR_MOBILE,
        uMobileMix
      );

      vec3 fieldPos = aPosB;
      fieldPos += vec3(
        sin(uTime * 0.25 + aSeed * 18.0) * 0.7,
        cos(uTime * 0.22 + aSeed * 12.0) * 0.55,
        sin(uTime * 0.18 + aSeed * 20.0) * 0.65
      );

      float helixSpin = sin(uTime * 0.18) * 0.08;
      mat2 helixRot = mat2(
        cos(helixSpin),
        -sin(helixSpin),
        sin(helixSpin),
        cos(helixSpin)
      );
      vec3 latticePos = aPosC;
      float stageTravel = smoothstep(0.04, 0.42, uSystemStage);
      latticePos.x = LATTICE_CENTER_XZ.x + (latticePos.x - LATTICE_CENTER_XZ.x) * mix(0.88, 1.32, stageTravel);
      latticePos.y = latticePos.y * mix(0.84, 1.4, stageTravel) + mix(-2.4, 0.8, stageTravel);
      latticePos.z += mix(-2.8, 0.0, stageTravel);
      latticePos.xz -= LATTICE_CENTER_XZ;
      latticePos.xz = helixRot * latticePos.xz;
      latticePos.xz += LATTICE_CENTER_XZ;
      latticePos.y += sin(uTime * 0.3 + aSeed * 10.0) * 0.16;
      latticePos = mix(
        latticePos,
        (latticePos - vec3(LATTICE_CENTER_XZ.x, 0.8, LATTICE_CENTER_XZ.y)) *
          0.4 +
          ROSE_ANCHOR_MOBILE +
          vec3(
            -1.2,
            smoothstep(0.8, -8.0, latticePos.y) * -4.2,
            0.0
          ),
        uMobileMix
      );

      float fieldMix = smoothstep(0.05, 0.48, uProgress);
      float latticeMix = smoothstep(0.04, 0.38, uSystemStage);

      vec3 instPos = mix(brainPos, fieldPos, fieldMix);
      instPos = mix(instPos, latticePos, latticeMix);
      instPos = mix(instPos, aPosB, aAmbient);

      float depthParallax = 0.8 + clamp(instPos.z * 0.035, -0.35, 0.55);
      instPos.xy +=
        uParallax *
        vec2(1.0, 0.68) *
        depthParallax *
        mix(0.25, 1.0, aAmbient);

      vec2 mouseDelta = instPos.xy - uMouse.xy;
      float distSq = dot(mouseDelta, mouseDelta);
      float fieldHoverTrim = mix(1.0, 0.78, fieldMix * (1.0 - latticeMix));
      float interactionRadius = mix(5.3, 7.4, uHover) * fieldHoverTrim;
      float radiusSq = interactionRadius * interactionRadius;
      float proximity = max(1.0 - distSq / max(radiusSq, 0.0001), 0.0);
      float forceMask =
        proximity *
        proximity *
        uHover *
        mix(1.0, 0.45, latticeMix) *
        mix(1.0, 0.2, aAmbient);
      float zLift = 0.25 + abs(instPos.z) * 0.06;
      float invLen = inversesqrt(distSq + zLift * zLift + 0.08);
      vec3 dir = vec3(mouseDelta * invLen, zLift * invLen);
      instPos +=
        dir *
        forceMask *
        (3.35 + aSeed * 4.2) *
        fieldHoverTrim *
        (0.65 + 0.35 * sin(uTime * 4.0 + aSeed * 50.0));

      float scale = mix(0.08, 0.32, aSeed);
      scale *=
        mix(1.0, 0.78, fieldMix) *
        mix(1.0, 0.72, latticeMix) +
        forceMask * 0.28;
      scale = mix(scale, scale * 0.86 + forceMask * 0.08, aAmbient);
      vec3 localPos = position * scale;

      float angleLocal = uTime * (0.7 + aSeed * 2.2) + aSeed * 6.2831;
      mat2 rotX = mat2(
        cos(angleLocal),
        -sin(angleLocal),
        sin(angleLocal),
        cos(angleLocal)
      );
      mat2 rotY = mat2(
        cos(angleLocal * 0.8),
        -sin(angleLocal * 0.8),
        sin(angleLocal * 0.8),
        cos(angleLocal * 0.8)
      );
      
      localPos.yz = rotX * localPos.yz;
      localPos.xz = rotY * localPos.xz;

      vec3 finalPos = instPos + localPos;

      vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      float flicker = 0.72 + 0.28 * sin(uTime * (1.8 + aSeed * 7.0) + aSeed * 48.0);
      float heat = mix(1.0, 1.5, latticeMix);
      float coreBrightness = (0.55 + flicker * 0.75 + forceMask * 0.9) * heat;
      float ambientBrightness = 0.5 + flicker * 0.7 + forceMask * 0.5;
      float brightness = mix(coreBrightness, ambientBrightness, aAmbient);
      vColor = aColor * brightness;
      float coreAlpha = clamp(0.24 + flicker * 0.42 + forceMask * 0.34, 0.12, 0.95);
      float ambientAlpha = clamp(0.16 + flicker * 0.28 + forceMask * 0.12, 0.12, 0.6);
      vAlpha = mix(coreAlpha, ambientAlpha, aAmbient);
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      gl_FragColor = vec4(vColor, vAlpha); 
    }
  `;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined as any, undefined as any, PARTICLE_COUNT]}
      frustumCulled={false}
    >
      <tetrahedronGeometry args={[1, 0]}>
        <instancedBufferAttribute attach="attributes-aPosA" count={PARTICLE_COUNT} array={posA} itemSize={3} />
        <instancedBufferAttribute attach="attributes-aPosB" count={PARTICLE_COUNT} array={posB} itemSize={3} />
        <instancedBufferAttribute attach="attributes-aPosC" count={PARTICLE_COUNT} array={posC} itemSize={3} />
        <instancedBufferAttribute attach="attributes-aSeed" count={PARTICLE_COUNT} array={seeds} itemSize={1} />
        <instancedBufferAttribute attach="attributes-aAmbient" count={PARTICLE_COUNT} array={ambientFlags} itemSize={1} />
        <instancedBufferAttribute attach="attributes-aColor" count={PARTICLE_COUNT} array={colors} itemSize={3} />
      </tetrahedronGeometry>

      <shaderMaterial
        ref={materialRef}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </instancedMesh>
  );
};

const Atmosphere = () => {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      scrollRef.current = THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useFrame((state, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    matRef.current.uniforms.uScroll.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uScroll.value,
      scrollRef.current,
      1 - Math.exp(-delta * 4)
    );
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
    }),
    []
  );

  const vertexShader = `
    varying vec3 vWorldDir;
    void main() {
      vWorldDir = normalize(position);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform float uScroll;
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
      float pt = smoothstep(0.9965, 0.9998, n);
      return pt;
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
      col += goldWarm * goldMix * 0.22;

      // Scroll-driven tint: push warmer toward rose state.
      vec3 warmShift = vec3(0.024, 0.010, -0.006) * smoothstep(0.35, 0.9, uScroll);
      col += warmShift * (0.4 + nebula * 0.5);

      // Subtle vertical gradient + horizon glow.
      float vert = smoothstep(-0.6, 0.9, d.y);
      col *= mix(1.1, 0.58, vert);
      float horizon = exp(-pow(d.y, 2.0) * 7.0);
      col += vec3(0.008, 0.014, 0.026) * horizon * 0.30;

      // Stars — keep faint, let bloom catch only brightest.
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
};

type CameraKeyframe = {
  t: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
};

const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  { t: 0.0, pos: [0, 0, 38], look: [0, 0, -4], fov: 45 },
  { t: 0.22, pos: [2.2, -0.6, 33], look: [4, -0.8, -4], fov: 44 },
  { t: 0.48, pos: [-3.4, -2.6, 40], look: [0, -1.4, -4], fov: 46 },
  { t: 0.72, pos: [2.2, -2.8, 29], look: [9.5, -1.6, -4], fov: 44 },
  { t: 0.9, pos: [1.0, -1.2, 34], look: [10.5, 0.2, -4], fov: 45 },
  { t: 1.0, pos: [0.0, -0.2, 40], look: [2.0, -0.2, -4], fov: 45 },
];

const smoothstep = (x: number) => x * x * (3 - 2 * x);

const CameraRig = () => {
  const scrollRef = useRef(0);
  const basePosRef = useRef(new THREE.Vector3(0, 0, 38));
  const baseLookRef = useRef(new THREE.Vector3(0, 0, -4));
  const baseFovRef = useRef(45);
  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpLook = useMemo(() => new THREE.Vector3(), []);
  const finalLook = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      scrollRef.current = THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useFrame(({ camera, clock }, delta) => {
    const t = scrollRef.current;

    // Keyframe lookup.
    let k1 = CAMERA_KEYFRAMES[0];
    let k2 = CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1];
    for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
      if (t <= CAMERA_KEYFRAMES[i + 1].t) {
        k1 = CAMERA_KEYFRAMES[i];
        k2 = CAMERA_KEYFRAMES[i + 1];
        break;
      }
    }
    const local = (t - k1.t) / Math.max(k2.t - k1.t, 0.0001);
    const eased = smoothstep(THREE.MathUtils.clamp(local, 0, 1));

    tmpPos.set(
      THREE.MathUtils.lerp(k1.pos[0], k2.pos[0], eased),
      THREE.MathUtils.lerp(k1.pos[1], k2.pos[1], eased),
      THREE.MathUtils.lerp(k1.pos[2], k2.pos[2], eased)
    );
    tmpLook.set(
      THREE.MathUtils.lerp(k1.look[0], k2.look[0], eased),
      THREE.MathUtils.lerp(k1.look[1], k2.look[1], eased),
      THREE.MathUtils.lerp(k1.look[2], k2.look[2], eased)
    );
    const targetFov = THREE.MathUtils.lerp(k1.fov, k2.fov, eased);

    const smooth = 1 - Math.exp(-delta * 2.4);
    basePosRef.current.lerp(tmpPos, smooth);
    baseLookRef.current.lerp(tmpLook, smooth);
    baseFovRef.current = THREE.MathUtils.lerp(
      baseFovRef.current,
      targetFov,
      smooth
    );

    // Organic micro-drift overlaid on smoothed base (non-lerped for persistence).
    const tm = clock.elapsedTime;
    const bobY = Math.sin(tm * 0.24) * 0.22;
    const bobX = Math.cos(tm * 0.17) * 0.32;
    const bobZ = Math.sin(tm * 0.11) * 0.18;

    camera.position.set(
      basePosRef.current.x + bobX,
      basePosRef.current.y + bobY,
      basePosRef.current.z + bobZ
    );
    finalLook.copy(baseLookRef.current);
    finalLook.x += Math.sin(tm * 0.19) * 0.08;
    finalLook.y += Math.cos(tm * 0.27) * 0.06;
    camera.lookAt(finalLook);

    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const persp = camera as THREE.PerspectiveCamera;
      const fovBreath =
        baseFovRef.current + Math.sin(tm * 0.31) * 0.35;
      if (Math.abs(persp.fov - fovBreath) > 0.01) {
        persp.fov = fovBreath;
        persp.updateProjectionMatrix();
      }
    }
  });

  return null;
};

export default function SpatialBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-[#020308]">
      <Canvas
        frameloop="always"
        dpr={[1, 2]}
        camera={{ position: [0, 0, 38], fov: 45 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
        }}
      >
        <color attach="background" args={["#020308"]} />
        <ambientLight intensity={0.35} />
        <CameraRig />
        <Atmosphere />
        <Particles />
        {POSTFX_ENABLED && (
          <EffectComposer
            multisampling={0}
            frameBufferType={THREE.HalfFloatType}
            disableNormalPass
          >
            <Bloom
              intensity={1.35}
              luminanceThreshold={0.08}
              luminanceSmoothing={0.9}
              mipmapBlur
              radius={0.9}
              levels={8}
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
