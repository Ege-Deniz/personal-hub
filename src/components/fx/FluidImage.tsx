"use client";

// Fluid image — cursor-driven liquid displacement over an image (Framer
// "Fluid Image" reference, rebuilt as a ~150-line raw WebGL fragment shader;
// no three.js overhead for a single quad). The pointer injects ripples whose
// energy decays over time. Falls back to a plain <img> without WebGL, on
// touch, or under reduced motion.

import { useEffect, useRef, useState } from "react";

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uMouse;      // uv space
uniform vec2 uVel;        // pointer velocity, uv/frame
uniform float uTime;
uniform float uEnergy;    // 0..1 ripple energy
uniform vec2 uTexScale;   // cover-fit scaling

void main() {
  vec2 uv = vUv;
  vec2 toMouse = uv - uMouse;
  float d = length(toMouse);
  // travelling ripple ring around the cursor, energy-decayed
  float ring = sin(d * 42.0 - uTime * 7.0) * exp(-d * 6.5) * uEnergy;
  // directional smear along pointer velocity
  vec2 offset = normalize(toMouse + 1e-5) * ring * 0.035 + uVel * exp(-d * 8.0) * 0.6;
  vec2 suv = (uv - 0.5) * uTexScale + 0.5 + offset;
  vec3 col = texture2D(uTex, suv).rgb;
  // faint cyan energy sheen on the disturbance
  col += vec3(0.0, 0.9, 1.0) * abs(ring) * 0.18;
  gl_FragColor = vec4(col, 1.0);
}`;

export default function FluidImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(hover: none)").matches
    ) {
      setFallback(true);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
    const gl = canvas.getContext("webgl", { antialias: false });
    if (!gl) {
      setFallback(true);
      return;
    }
    host.appendChild(canvas);

    const compile = (type: number, srcCode: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, srcCode);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uVel = gl.getUniformLocation(prog, "uVel");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uEnergy = gl.getUniformLocation(prog, "uEnergy");
    const uTexScale = gl.getUniformLocation(prog, "uTexScale");

    const tex = gl.createTexture();
    let imgW = 1;
    let imgH = 1;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgW = img.naturalWidth;
      imgH = img.naturalHeight;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      size();
    };
    img.src = src;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => {
      const r = host.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      // cover-fit: scale uv so the texture fills without stretching
      const cAsp = r.width / Math.max(1, r.height);
      const iAsp = imgW / Math.max(1, imgH);
      if (cAsp > iAsp) gl.uniform2f(uTexScale, 1, iAsp / cAsp);
      else gl.uniform2f(uTexScale, cAsp / iAsp, 1);
    };
    const ro = new ResizeObserver(size);
    ro.observe(host);
    size();

    const mouse = { x: 0.5, y: 0.5, px: 0.5, py: 0.5 };
    let energy = 0;
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = 1 - (e.clientY - r.top) / r.height;
      energy = Math.min(1, energy + 0.12);
    };
    host.addEventListener("pointermove", onMove);

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      energy *= 0.965;
      const vx = (mouse.x - mouse.px) * 0.9;
      const vy = (mouse.y - mouse.py) * 0.9;
      mouse.px += (mouse.x - mouse.px) * 0.25;
      mouse.py += (mouse.y - mouse.py) * 0.25;
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform2f(uVel, vx, vy);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform1f(uEnergy, energy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeChild(canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [src]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
      role="img"
      aria-label={alt}
    >
      {fallback && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
    </div>
  );
}
