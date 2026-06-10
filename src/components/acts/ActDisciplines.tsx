"use client";

// ACT 3 — DISCIPLINES. A horizontal 4-panel track inside a vertical pin.
// Each panel entering the viewport ignites the matching region of the brain
// (the canvas derives the region from this act's progress). Panel layouts are
// structurally different so the pin earns its length.

import { useRef } from "react";
import { useActPin } from "./useActTrigger";

const PANELS = [
  {
    numeral: "01",
    title: "AI Agent Infrastructure",
    copy: "brain-operator, rowy-operator — computer-use QA, patch loops, durable handoffs. I build the tooling, not just the prompts.",
    tags: ["Claude", "MCP", "TypeScript"],
    layout: "left" as const,
  },
  {
    numeral: "02",
    title: "ML Foundations",
    copy: "Backprop and tree search built from scratch — the math under the models. Deepening it next at an AI master's.",
    tags: ["Python", "NumPy", "MCTS"],
    layout: "center" as const,
  },
  {
    numeral: "03",
    title: "Spatial Web",
    copy: "Three.js, R3F, custom GLSL — particle engines that feel cinematic, not templated.",
    tags: ["Three.js", "GLSL", "R3F"],
    layout: "right" as const,
  },
  {
    numeral: "04",
    title: "Competitive FPS",
    copy: "Valorant Radiant. CS2 Faceit Level 10. Frame-perfect decisions under pressure — the operator discipline behind the code.",
    tags: ["VALORANT", "CS2"],
    layout: "offset" as const,
  },
];

function Panel({ panel }: { panel: (typeof PANELS)[number] }) {
  const inner = (
    <>
      <div className="flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.32em] text-cyan/70">
        <span className="inline-block h-1 w-1 animate-pulse-dot rounded-full bg-cyan/70" />
        Region {panel.numeral} — online
      </div>
      <h3 className="text-shadow-hero font-display text-[clamp(2.4rem,5vw,4.4rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-white">
        {panel.title}
      </h3>
      <p className="max-w-md text-[0.92rem] leading-[1.75] text-white/45">
        {panel.copy}
      </p>
      <div className="flex flex-wrap gap-2.5">
        {panel.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/[0.1] px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-white/40"
          >
            {t}
          </span>
        ))}
      </div>
    </>
  );

  const numeral = (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none font-display text-[clamp(10rem,24vw,22rem)] font-extrabold leading-none tracking-[-0.06em] text-white/[0.04]"
    >
      {panel.numeral}
    </div>
  );

  if (panel.layout === "left") {
    return (
      <div className="flex h-full w-full items-center justify-between gap-10 px-[8%]">
        <div className="flex max-w-xl flex-col gap-6">{inner}</div>
        <div className="hidden md:block">{numeral}</div>
      </div>
    );
  }
  if (panel.layout === "center") {
    return (
      <div className="relative flex h-full w-full items-center justify-center px-[8%]">
        <div className="absolute inset-0 hidden items-center justify-center md:flex">
          {numeral}
        </div>
        <div className="relative z-10 flex max-w-xl flex-col items-center gap-6 text-center">
          {inner}
        </div>
      </div>
    );
  }
  if (panel.layout === "right") {
    return (
      <div className="flex h-full w-full items-center justify-between gap-10 px-[8%]">
        <div className="hidden self-end pb-[10vh] md:block">{numeral}</div>
        <div className="flex max-w-xl flex-col items-end gap-6 text-right max-md:items-start max-md:text-left">
          {inner}
        </div>
      </div>
    );
  }
  // offset
  return (
    <div className="flex h-full w-full items-end justify-start gap-10 px-[8%] pb-[16vh] max-md:items-center max-md:pb-0">
      <div className="flex max-w-xl flex-col gap-6">{inner}</div>
      <div className="hidden self-start pt-[12vh] md:block">{numeral}</div>
    </div>
  );
}

export default function ActDisciplines() {
  const ref = useRef<HTMLElement>(null);

  useActPin(3, ref, {
    length: "+=220%",
    build: (tl, el) => {
      const track = el.querySelector("[data-disc-track]");
      const dots = el.querySelectorAll("[data-disc-dot]");
      if (track) {
        tl.to(track, { xPercent: -75, duration: 0.88, ease: "none" }, 0.06);
      }
      dots.forEach((dot, i) => {
        const at = 0.06 + (0.88 / 4) * i + 0.05;
        tl.to(dot, { opacity: 1, scale: 1.4, duration: 0.02 }, at);
        if (i > 0) {
          tl.to(dots[i - 1], { opacity: 0.35, scale: 1, duration: 0.02 }, at);
        }
      });
    },
  });

  return (
    <section
      id="act-disciplines"
      ref={ref}
      className="relative z-10 min-h-screen overflow-hidden"
    >
      <div className="pointer-events-none absolute left-[6%] top-[10vh] z-20 flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.32em] text-cyan/70">
        <span className="h-px w-8 bg-cyan/40" />
        03 — Disciplines
      </div>

      <div
        data-disc-track
        className="flex h-auto w-full flex-col md:h-screen md:w-[400vw] md:flex-row"
      >
        {PANELS.map((p) => (
          <div
            key={p.numeral}
            className="min-h-[88vh] w-full flex-shrink-0 md:h-screen md:min-h-0 md:w-screen"
          >
            <Panel panel={p} />
          </div>
        ))}
      </div>

      {/* Track progress dots */}
      <div className="pointer-events-none absolute bottom-[7vh] left-1/2 z-20 hidden -translate-x-1/2 gap-3 md:flex">
        {PANELS.map((p, i) => (
          <span
            key={p.numeral}
            data-disc-dot
            className="h-1.5 w-1.5 rounded-full bg-cyan"
            style={{ opacity: i === 0 ? 1 : 0.35 }}
          />
        ))}
      </div>
    </section>
  );
}
