"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

type System = {
  index: string;
  name: string;
  line: string;
  tags: string[];
  status: string;
  href?: string;
};

// Honest data only — tech tags and status, no fabricated metrics.
const SYSTEMS: System[] = [
  {
    index: "01",
    name: "Brain Operator",
    line: "Agent devtools over an Obsidian vault: inspect what Claude Code and Codex searched, cited, missed, changed, and handed to the next session.",
    tags: ["Next.js", "R3F", "Agent SDK"],
    status: "Live",
    href: "https://brainoperator.rowy.engineer/",
  },
  {
    index: "02",
    name: "rowy-operator",
    line: "Mission-based personal AI operator with computer-use QA and an LLM patch loop that proposes, applies, and verifies changes.",
    tags: ["TypeScript", "Claude", "MCP"],
    status: "In development",
  },
  {
    index: "03",
    name: "SIBA E-Motion",
    line: "Brand and dealership surface for an electric-mobility company, built on a reactive canvas field.",
    tags: ["WebGL", "Canvas", "Brand"],
    status: "Live",
    href: "https://siba.rowy.engineer/",
  },
  {
    index: "04",
    name: "Neural Engine",
    line: "The field behind this page: a five-thousand-particle instanced brain with neural edges, discharges, and a custom postprocessing chain.",
    tags: ["Three.js", "GLSL", "R3F"],
    status: "Live",
    href: "https://rowy.engineer/",
  },
  {
    index: "05",
    name: "Backprop from scratch",
    line: "A neural network trained and visualized from first principles, no framework, to show the math under the models.",
    tags: ["Python", "NumPy", "ML"],
    status: "Case study",
  },
];

function SystemRow({ system, i }: { system: System; i: number }) {
  const Wrapper = system.href ? "a" : "div";
  const wrapperProps = system.href
    ? { href: system.href, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay: i * 0.06 }}
    >
      <Wrapper
        {...wrapperProps}
        className="group relative block border-t border-white/[0.08] py-7 transition-colors duration-500 hover:border-cyan/30 sm:py-9"
      >
        {/* shine-hairline on hover */}
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[radial-gradient(60%_100%_at_50%_0%,var(--accent),transparent_70%)] opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-60" />

        <div className="flex items-baseline gap-5 sm:gap-10">
          <span className="font-mono text-[0.7rem] tabular-nums tracking-[0.2em] text-white/25 transition-colors duration-500 group-hover:text-cyan">
            {system.index}
          </span>

          <div className="flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h3 className="font-display text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-[0.95] tracking-[-0.03em] text-white/90 transition-transform duration-500 group-hover:translate-x-1.5">
                {system.name}
              </h3>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-white/30">
                  {system.status}
                </span>
                {system.href && (
                  <ArrowUpRight className="h-4 w-4 text-white/30 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan" />
                )}
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-[0.85rem] leading-[1.7] text-white/40">
              {system.line}
            </p>

            <div className="mt-4 flex flex-wrap gap-2.5">
              {system.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/[0.1] px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-white/40 transition-colors duration-500 group-hover:border-cyan/20 group-hover:text-white/55"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Wrapper>
    </motion.div>
  );
}

export default function SelectedSystems() {
  return (
    <section
      id="systems"
      className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-28 px-4 pb-16 pt-10 md:px-8"
    >
      <div className="mb-3 flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.32em] text-cyan/70">
        <span className="h-px w-8 bg-cyan/40" />
        Selected Systems
      </div>
      <h2 className="mb-10 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-white">
        Things I&apos;ve shipped, end to end.
      </h2>

      <div>
        {SYSTEMS.map((s, i) => (
          <SystemRow key={s.index} system={s} i={i} />
        ))}
        <div className="border-t border-white/[0.08]" />
      </div>
    </section>
  );
}
