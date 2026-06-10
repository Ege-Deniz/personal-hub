"use client";

// ACT 3 — DISCIPLINES (Direction A). Four catalog rows under a numbered
// header — the same system rhythm as Selected Systems. No horizontal track,
// no region theatrics; the discipline IS the content.

import { useRef } from "react";
import { useActFlow } from "./useActTrigger";
import { ActHeader, Reveal } from "./Reveal";

const DISCIPLINES = [
  {
    numeral: "01",
    title: "AI Agent Infrastructure",
    copy: "brain-operator, rowy-operator — computer-use QA, patch loops, durable handoffs. I build the tooling, not just the prompts.",
    tags: ["Claude", "MCP", "TypeScript"],
  },
  {
    numeral: "02",
    title: "ML Foundations",
    copy: "Backprop and tree search built from scratch — the math under the models. Deepening it next at an AI master's.",
    tags: ["Python", "NumPy", "MCTS"],
  },
  {
    numeral: "03",
    title: "Spatial Web",
    copy: "Three.js, R3F, custom GLSL — particle engines that feel cinematic, not templated.",
    tags: ["Three.js", "GLSL", "R3F"],
  },
  {
    numeral: "04",
    title: "Competitive FPS",
    copy: "Valorant Radiant. CS2 Faceit Level 10. Frame-perfect decisions under pressure — the operator discipline behind the code.",
    tags: ["VALORANT", "CS2"],
  },
];

export default function ActDisciplines() {
  const ref = useRef<HTMLElement>(null);
  useActFlow(3, ref);

  return (
    <section
      id="act-disciplines"
      ref={ref}
      className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-28 px-4 py-[12vh] md:px-8"
    >
      <ActHeader index="02" title="Disciplines" className="mb-12" />

      <div>
        {DISCIPLINES.map((d, i) => (
          <Reveal key={d.numeral} delay={i * 0.04}>
            <div className="group border-t border-white/[0.07] py-9 transition-colors duration-500 hover:border-cyan/25 md:py-11">
              <div className="flex items-baseline gap-6 sm:gap-12">
                <span
                  aria-hidden="true"
                  className="text-outline tnum select-none font-display text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-none tracking-[-0.04em]"
                >
                  {d.numeral}
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                    <h3 className="font-display text-[clamp(1.6rem,3.4vw,2.8rem)] font-bold leading-[1] tracking-[-0.03em] text-white/90">
                      {d.title}
                    </h3>
                    <div className="hidden gap-2.5 md:flex">
                      {d.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/[0.1] px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-white/40"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 max-w-2xl text-[0.85rem] leading-[1.7] text-white/40">
                    {d.copy}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2.5 md:hidden">
                    {d.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/[0.1] px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-white/40"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
        <div className="border-t border-white/[0.07]" />
      </div>
    </section>
  );
}
