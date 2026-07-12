"use client";

// ASCII flow trail — cursor leaves a decaying wake of glyphs on a hidden
// character lattice. 2D canvas (no WebGL) so it can live in the first
// viewport without breaking the "hero reads with no WebGL" rule.
// Recreated natively from the Framer "ASCII Flow Trail" reference so it can
// share the gateway palette and stay dependency-free.

import { useEffect, useRef } from "react";

const GLYPHS = "01<>/{};=+*#@$%&λΣΔ∇ψ".split("");
const CELL = 18; // px lattice pitch
const DECAY = 0.94; // energy retained per frame
const RADIUS = 90; // px cursor influence

export default function AsciiFlowTrail({ opacity = 0.5 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return; // touch: skip

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let cols = 0;
    let rows = 0;
    let energy: Float32Array = new Float32Array(0);
    let chars: Uint8Array = new Uint8Array(0);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointer = { x: -9999, y: -9999, px: -9999, py: -9999 };

    const size = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
      energy = new Float32Array(cols * rows);
      chars = new Uint8Array(cols * rows);
      for (let i = 0; i < chars.length; i++) {
        chars[i] = Math.floor(Math.random() * GLYPHS.length);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `11px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    };

    const ro = new ResizeObserver(size);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    size();

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      if (pointer.px < -999) {
        pointer.px = pointer.x;
        pointer.py = pointer.y;
      }
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
      pointer.px = -9999;
      pointer.py = -9999;
    };
    const host = canvas.parentElement ?? canvas;
    host.addEventListener("pointermove", onMove as EventListener);
    host.addEventListener("pointerleave", onLeave);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      // inject energy along the pointer path
      if (pointer.x > -999) {
        const steps = 4;
        for (let s = 0; s < steps; s++) {
          const ix = pointer.px + ((pointer.x - pointer.px) * s) / steps;
          const iy = pointer.py + ((pointer.y - pointer.py) * s) / steps;
          const cx = Math.floor(ix / CELL);
          const cy = Math.floor(iy / CELL);
          const r = Math.ceil(RADIUS / CELL);
          for (let gy = cy - r; gy <= cy + r; gy++) {
            for (let gx = cx - r; gx <= cx + r; gx++) {
              if (gx < 0 || gy < 0 || gx >= cols || gy >= rows) continue;
              const dx = gx * CELL + CELL / 2 - ix;
              const dy = gy * CELL + CELL / 2 - iy;
              const d = Math.hypot(dx, dy);
              if (d < RADIUS) {
                const idx = gy * cols + gx;
                const boost = 1 - d / RADIUS;
                if (boost > energy[idx]) {
                  energy[idx] = boost;
                  // re-roll the glyph when it lights up — feels alive
                  if (Math.random() < 0.35) {
                    chars[idx] = Math.floor(Math.random() * GLYPHS.length);
                  }
                }
              }
            }
          }
        }
        pointer.px = pointer.x;
        pointer.py = pointer.y;
      }

      // draw + decay
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const idx = gy * cols + gx;
          const e = energy[idx];
          if (e < 0.02) continue;
          energy[idx] = e * DECAY;
          const a = Math.min(1, e) * opacity;
          // hot core reads gold, wake reads cyan — the gateway two-tone
          ctx.fillStyle =
            e > 0.75 ? `rgba(212, 168, 83, ${a})` : `rgba(242, 242, 238, ${a})`;
          ctx.fillText(
            GLYPHS[chars[idx]],
            gx * CELL + CELL / 2,
            gy * CELL + CELL / 2,
          );
        }
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove as EventListener);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    />
  );
}
