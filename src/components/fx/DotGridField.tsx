"use client";

// Dot grid with orbital cursor physics — dots near the pointer break from the
// lattice and orbit in individually tilted 3D planes (inclination + ascension
// + phase assigned at build), winding down with an ease-out decay when the
// cursor leaves. 2D canvas, DPR-aware, rebuilt from the Framer "Dot Grid
// Background" reference. Callers: SystemsProof section background layer.

import { useEffect, useRef } from "react";

const SPACING = 34; // px lattice pitch
const DOT = 1.6; // px radius at rest
const IMPACT = 170; // px cursor influence radius
const ORBIT_R = 11; // px orbit radius at full influence
const SPEED = 1.35; // rad/s global clock

export default function DotGridField({ opacity = 0.5 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointer = { x: -9999, y: -9999 };

    type Dot = {
      x: number;
      y: number;
      inc: number; // orbital plane inclination
      asc: number; // plane rotation around the view axis
      phase: number;
      k: number; // current influence 0..1, eased
    };
    let dots: Dot[] = [];

    const size = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = SPACING / 2; y < height; y += SPACING) {
        for (let x = SPACING / 2; x < width; x += SPACING) {
          dots.push({
            x,
            y,
            inc: Math.random() * Math.PI * 0.6,
            asc: Math.random() * Math.PI * 2,
            phase: Math.random() * Math.PI * 2,
            k: 0,
          });
        }
      }
    };

    const ro = new ResizeObserver(size);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    size();

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const host = canvas.parentElement ?? canvas;
    host.addEventListener("pointermove", onMove as EventListener);
    host.addEventListener("pointerleave", onLeave);

    const start = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const t = ((now - start) / 1000) * SPEED;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      for (const d of dots) {
        const dx = d.x - pointer.x;
        const dy = d.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        const target = !reduced && dist < IMPACT ? 1 - dist / IMPACT : 0;
        // attack fast, release with ease-out decay
        d.k += (target - d.k) * (target > d.k ? 0.16 : 0.045);

        let px = d.x;
        let py = d.y;
        if (d.k > 0.004) {
          // point on a tilted circular orbit, projected to 2D
          const a = t + d.phase;
          const ox = Math.cos(a) * ORBIT_R * d.k;
          const oy = Math.sin(a) * ORBIT_R * d.k * Math.cos(d.inc);
          px += ox * Math.cos(d.asc) - oy * Math.sin(d.asc);
          py += ox * Math.sin(d.asc) + oy * Math.cos(d.asc);
        }

        const glow = d.k;
        const r = DOT + glow * 1.3;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242, 242, 238, ${(0.16 + glow * 0.7) * opacity})`;
        ctx.fill();
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
