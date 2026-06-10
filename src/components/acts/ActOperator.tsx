"use client";

// ACT 2 — THE OPERATOR. Pinned kinetic identity statements with an oversized
// ghost numeral. Three beats, each a structurally different alignment:
// left → right → center. Copy is factual: agent infra, ML from scratch,
// Maastricht trajectory.

import { useRef } from "react";
import { useActPin } from "./useActTrigger";

const STATEMENTS = [
  {
    align: "items-start text-left",
    lines: ["I build agent infrastructure", "that ships as product."],
    sub: "brain-operator · computer-use QA · LLM patch loops — tooling, not prompt demos.",
  },
  {
    align: "items-end text-right",
    lines: ["Grounded in ML", "from first principles."],
    sub: "Backprop and tree search written from scratch — thesis defense, June 2026.",
  },
  {
    align: "items-center text-center",
    lines: ["Next: AI master's.", "Maastricht — Sep 2026."],
    sub: "Cyprus now. The Netherlands next. The operator layer ships along.",
  },
];

export default function ActOperator() {
  const ref = useRef<HTMLElement>(null);

  useActPin(2, ref, {
    length: "+=170%",
    build: (tl, el) => {
      const numeral = el.querySelector("[data-op-numeral]");
      const beats = el.querySelectorAll("[data-op-beat]");

      if (numeral) {
        tl.fromTo(
          numeral,
          { yPercent: 14, opacity: 0.6 },
          { yPercent: -14, opacity: 1, duration: 1 },
          0
        );
      }

      const windows = [
        { inAt: 0.02, outAt: 0.3 },
        { inAt: 0.36, outAt: 0.64 },
        { inAt: 0.7, outAt: -1 }, // last beat rides into the next act
      ];
      beats.forEach((beat, i) => {
        const lines = beat.querySelectorAll("[data-op-line]");
        const sub = beat.querySelector("[data-op-sub]");
        const w = windows[i];
        tl.fromTo(
          lines,
          { yPercent: 112 },
          { yPercent: 0, duration: 0.12, stagger: 0.035, ease: "power2.out" },
          w.inAt
        );
        if (sub) {
          tl.fromTo(
            sub,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.08 },
            w.inAt + 0.08
          );
        }
        if (w.outAt > 0) {
          tl.to(
            lines,
            { yPercent: -112, duration: 0.1, stagger: 0.03, ease: "power2.in" },
            w.outAt
          );
          if (sub) tl.to(sub, { opacity: 0, y: -12, duration: 0.06 }, w.outAt);
        }
      });
    },
  });

  return (
    <section
      id="act-operator"
      ref={ref}
      className="relative z-10 flex min-h-screen items-center overflow-hidden px-[6%]"
    >
      {/* Ghost numeral */}
      <div
        data-op-numeral
        aria-hidden="true"
        className="pointer-events-none absolute right-[2%] top-1/2 -translate-y-1/2 select-none font-display text-[clamp(14rem,30vw,26rem)] font-extrabold leading-none tracking-[-0.06em] text-white/[0.035]"
      >
        02
      </div>

      <div className="pointer-events-none absolute left-[6%] top-[12vh] flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.32em] text-cyan/70">
        <span className="h-px w-8 bg-cyan/40" />
        02 — The Operator
      </div>

      <div className="relative mx-auto h-[60vh] w-full max-w-6xl max-md:h-auto">
        {STATEMENTS.map((s, i) => (
          <div
            key={i}
            data-op-beat
            className={`absolute inset-0 flex flex-col justify-center gap-6 ${s.align} max-md:relative max-md:inset-auto max-md:mb-16 max-md:h-auto max-md:!items-start max-md:!text-left`}
          >
            <h2 className="text-shadow-hero flex flex-col font-display text-[clamp(2.2rem,5.6vw,4.6rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-white">
              {s.lines.map((line, j) => (
                <span key={j} className="overflow-hidden pb-1">
                  <span data-op-line className="block max-md:!transform-none">
                    {line}
                  </span>
                </span>
              ))}
            </h2>
            <p
              data-op-sub
              className="max-w-md font-mono text-[0.68rem] uppercase leading-[1.9] tracking-[0.18em] text-white/35 max-md:!transform-none max-md:!opacity-100"
            >
              {s.sub}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
