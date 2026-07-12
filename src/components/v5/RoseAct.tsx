"use client";

// The rose act — the page goes silent and the machine blooms. id="system" is
// the contract SpatialBackground already listens for (uSystemStage), so the
// bloom is driven by arriving here — no shader changes. The caption is sticky
// and resolves ON the bloom: it mirrors the same #system-rect progress the
// shader runs, so the second line + morph receipt land as the rose completes.
// Silence held, then paid off.

import { useEffect, useRef, useState } from "react";

export default function RoseAct() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setResolved(true);
      return;
    }
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    // Tall sentinel spanning bloom-depth → section end. It intersects the
    // whole time you're in the payoff zone, so a single-frame jump past it
    // still resolves (unlike a 1px sentinel that IO can skip). Fires reliably
    // regardless of rAF/scroll-event throttling.
    const io = new IntersectionObserver(
      ([entry]) => setResolved(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="system"
      aria-label="The field forms a rose"
      className="relative z-10 min-h-[180vh] px-[4.5%]"
    >
      {/* bloom-depth → end sentinel: intersecting = the rose has formed */}
      <div
        ref={sentinelRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-[95vh] bottom-0 w-px"
      />
      <div className="sticky top-0 flex h-screen flex-col justify-center">
        <p
          className="max-w-[34ch] font-mono text-[11px] uppercase leading-[2.4] tracking-[3px] text-white/70"
          style={{ textShadow: "0 2px 24px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.8)" }}
        >
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
          className="mt-8 font-mono text-[9px] uppercase tracking-[2px] text-white/40"
          style={{
            opacity: resolved ? 1 : 0,
            transition: "opacity 0.9s ease 0.15s",
            textShadow: "0 2px 20px rgba(0,0,0,0.95)",
          }}
        >
          morph target: rose · hand-keyed · 6-keyframe camera rig
        </div>
      </div>
    </section>
  );
}
