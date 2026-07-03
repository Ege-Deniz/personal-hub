"use client";

// Wavy ticker — an infinite marquee whose glyphs ride a travelling sine wave
// (Framer "Wavy Ticker" reference, rebuilt natively). Pure DOM transforms on
// per-item spans, one rAF loop, scroll-velocity reactive: scrolling faster
// steepens the wave and speeds the belt.

import { useEffect, useRef } from "react";

export default function WavyTicker({
  items,
  speed = 60, // px/s baseline
  className,
}: {
  items: string[];
  speed?: number;
  className?: string;
}) {
  const beltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const belt = beltRef.current;
    if (!belt) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let x = 0;
    let last = performance.now();
    let lastScrollY = window.scrollY;
    let vel = 0;

    const spans = Array.from(
      belt.querySelectorAll<HTMLSpanElement>("[data-tick]"),
    );

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // scroll velocity feeds wave amplitude + belt speed
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      vel += (Math.min(Math.abs(dy), 60) - vel) * 0.08;

      const half = belt.scrollWidth / 2;
      x -= (speed + vel * 6) * dt;
      if (half > 0 && x <= -half) x += half;
      belt.style.transform = `translateX(${x}px)`;

      if (!reduced) {
        const t = now / 1000;
        const amp = 4 + vel * 0.35;
        for (let i = 0; i < spans.length; i++) {
          const r = spans[i].getBoundingClientRect();
          const phase = (r.left + r.width / 2) / 140;
          spans[i].style.transform = `translateY(${Math.sin(t * 2.4 + phase) * amp}px)`;
        }
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  const row = [...items, ...items];
  return (
    <div
      aria-hidden
      className={className}
      style={{ overflow: "hidden", whiteSpace: "nowrap" }}
    >
      <div ref={beltRef} style={{ display: "inline-block", willChange: "transform" }}>
        {[0, 1].map((half) => (
          <span key={half}>
            {row.map((item, i) => (
              <span
                key={`${half}-${i}`}
                data-tick
                style={{ display: "inline-block", willChange: "transform" }}
                className="mx-6"
              >
                {item}
                <span className="mx-6 text-cyan/40">·</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
