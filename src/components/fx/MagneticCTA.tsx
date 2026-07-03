"use client";

// Magnetic hover wrapper — the child leans toward the cursor inside a small
// radius and snaps back on leave (Nova Glow / Shader Button reference,
// restated in the gateway's quiet cyan language). Wraps any inline block;
// pointer-only, no effect on touch or reduced motion.

import { ReactNode, useEffect, useRef } from "react";

export default function MagneticCTA({
  children,
  strength = 0.32,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      if (Math.abs(pos.x - target.x) > 0.1 || Math.abs(pos.y - target.y) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = (e.clientX - (r.left + r.width / 2)) * strength;
      target.y = (e.clientY - (r.top + r.height / 2)) * strength;
      kick();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      kick();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <span ref={ref} style={{ display: "inline-block", willChange: "transform" }}>
      {children}
    </span>
  );
}
