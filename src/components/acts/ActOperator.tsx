"use client";

// ACT 2 — THE OPERATOR (Direction A). Three stacked statements under a
// numbered header. No pin, no crossfade theatre — hairline-separated
// typographic blocks that reveal once and stay.

import { useRef } from "react";
import { useActFlow } from "./useActTrigger";
import { ActHeader, Reveal } from "./Reveal";

const STATEMENTS = [
  {
    lines: ["I build agent infrastructure", "that ships as product."],
    sub: "brain-operator · computer-use QA · LLM patch loops — tooling, not prompt demos.",
  },
  {
    lines: ["Grounded in ML", "from first principles."],
    sub: "Backprop and tree search written from scratch — thesis defense, June 2026.",
  },
  {
    lines: ["Next: AI master's.", "Maastricht — Sep 2026."],
    sub: "Cyprus now. The Netherlands next. The operator layer ships along.",
  },
];

export default function ActOperator() {
  const ref = useRef<HTMLElement>(null);
  useActFlow(2, ref);

  return (
    <section
      id="act-operator"
      ref={ref}
      className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-28 px-4 py-[14vh] md:px-8"
    >
      <ActHeader index="01" title="The Operator" className="mb-14" />

      <div className="flex flex-col">
        {STATEMENTS.map((s, i) => (
          <Reveal key={i} delay={0.05}>
            <div
              className={`border-t border-white/[0.07] py-12 md:py-16 ${
                i === 2 ? "border-b" : ""
              }`}
            >
              <div className="grid items-baseline gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
                <h2 className="text-shadow-hero font-display text-[clamp(1.9rem,4.6vw,3.8rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-white">
                  {s.lines[0]}
                  <br />
                  {s.lines[1]}
                </h2>
                <p className="text-shadow-hero font-mono text-[0.66rem] uppercase leading-[2] tracking-[0.18em] text-white/45 md:justify-self-end md:text-right">
                  {s.sub}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
