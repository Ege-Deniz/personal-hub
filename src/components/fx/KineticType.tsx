"use client";

// Kinetic type — display text that physically reacts to scroll velocity:
// skew, vertical stretch and letter-spacing breathe with how hard the page
// is being pushed (Codrops ScrollTextMotion / kinetic-typography lineage).
// One rAF loop, transform-only (no layout), settles to identity at rest.

import { ReactNode, useEffect, useRef } from "react";

export default function KineticType({
  children,
  intensity = 1,
  className,
}: {
  children: ReactNode;
  intensity?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let lastY = window.scrollY;
    let vel = 0; // smoothed px/frame

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      // fast attack, slow release
      vel += (dy - vel) * (Math.abs(dy) > Math.abs(vel) ? 0.3 : 0.08);

      const v = Math.max(-40, Math.min(40, vel)) * intensity;
      const skew = v * 0.18; // deg
      const stretch = 1 + Math.min(0.14, Math.abs(v) * 0.004);
      el.style.transform = `skewY(${skew * 0.12}deg) skewX(${-skew * 0.22}deg) scaleY(${stretch})`;
      el.style.letterSpacing = `${Math.abs(v) * 0.02}px`;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [intensity]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: "transform", transformOrigin: "0% 100%" }}
    >
      {children}
    </div>
  );
}
