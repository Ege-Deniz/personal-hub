"use client";

// The rose act — the page goes silent and the machine blooms. id="system" is
// the contract SpatialBackground already listens for (uSystemStage), so the
// bloom is driven by arriving here — no shader changes. The caption is sticky
// and resolves ON the bloom: it mirrors the same #system-rect progress the
// shader runs, so the second line + morph receipt land as the rose completes.
// Silence held, then paid off.

import { useEffect, useRef, useState } from "react";

export default function RoseAct() {
  const ref = useRef<HTMLElement>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setResolved(true);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // same shape SpatialBackground uses for uSystemStage; the bloom peaks
      // partway through, so resolve the caption a beat after the midpoint.
      const p = (vh - rect.top) / (rect.height + vh);
      setResolved(p > 0.5);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="system"
      aria-label="The field forms a rose"
      className="relative z-10 min-h-[180vh] px-[4.5%]"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center">
        <p className="max-w-[34ch] font-mono text-[11px] uppercase leading-[2.4] tracking-[3px] text-white/45">
          the same 5,360 particles,
          <br />
          asked to be a rose —
          <br />
          <span
            style={{
              opacity: resolved ? 1 : 0,
              transform: resolved ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
              display: "inline-block",
              color: "rgba(242,242,238,0.9)",
            }}
          >
            — and it holds.
          </span>
        </p>
        <div
          className="mt-8 font-mono text-[9px] uppercase tracking-[2px] text-white/25"
          style={{
            opacity: resolved ? 1 : 0,
            transition: "opacity 0.9s ease 0.15s",
          }}
        >
          morph target: rose · hand-keyed · 6-keyframe camera rig
        </div>
      </div>
    </section>
  );
}
