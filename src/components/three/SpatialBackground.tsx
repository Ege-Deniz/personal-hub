"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three-stdlib";

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
    const sourceGeometry = new THREE.IcosahedronGeometry(12.2, 5);
    const sampledGeometry = sourceGeometry.toNonIndexed() ?? sourceGeometry;
    const samplerA = new MeshSurfaceSampler(
      new THREE.Mesh(sampledGeometry)
    ).build();

    const pA = new Float32Array(PARTICLE_COUNT * 3);
    const pB = new Float32Array(PARTICLE_COUNT * 3);
    const pC = new Float32Array(PARTICLE_COUNT * 3);
    const particleSeeds = new Float32Array(PARTICLE_COUNT);
    const cols = new Float32Array(PARTICLE_COUNT * 3);
    const ambient = new Float32Array(PARTICLE_COUNT);

    const samplePoint = new THREE.Vector3();

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

      samplerA.sample(samplePoint);
      const shellWarp =
        1 +
        Math.sin(samplePoint.y * 0.26 + seed * 18) * 0.16 +
        Math.cos(samplePoint.x * 0.2 + seed * 11) * 0.08;
      samplePoint.multiplyScalar(shellWarp);
      samplePoint.x += 17.2 + Math.sin(samplePoint.y * 0.24) * 0.8;
      samplePoint.y += Math.cos(samplePoint.z * 0.18) * 0.45;
      samplePoint.z = samplePoint.z * 0.8 - 5.5;

      pA[baseIndex] = samplePoint.x;
      pA[baseIndex + 1] = samplePoint.y;
      pA[baseIndex + 2] = samplePoint.z;

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

    if (sampledGeometry !== sourceGeometry) sampledGeometry.dispose();
    sourceGeometry.dispose();

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
      float brainSpin = uTime * 0.16;
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

export default function SpatialBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-[#020308]">
      <Canvas
        frameloop="always"
        dpr={[1, 1]}
        camera={{ position: [0, 0, 38], fov: 45 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={["#020308"]} />
        <ambientLight intensity={0.35} />
        <Particles />
      </Canvas>
    </div>
  );
}
