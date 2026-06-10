"use client";

// ACT 4 — SIGNATURE ARTIFACT: Brain Operator (Direction A). The diptych
// holds; the climax panel hosts the site's ONE living object — the contained
// shard-brain. Gold remains caged to this act.

import { useRef } from "react";
import { ArrowUpRight, BrainCircuit, GitBranch, ShieldCheck } from "lucide-react";
import dynamic from "next/dynamic";
import { useActFlow } from "./useActTrigger";
import { Reveal } from "./Reveal";

const ArtifactBrain = dynamic(() => import("@/components/three/ArtifactBrain"), {
  ssr: false,
});

const MODES = ["Ask", "Trace", "Evolve", "Ship", "Pulse"];

const FEATURES = [
  {
    icon: GitBranch,
    title: "Handoff log",
    copy: "Sessions become durable context. What an agent searched, read, cited, missed, changed — recorded and handed to the next session.",
  },
  {
    icon: ShieldCheck,
    title: "Guarded apply",
    copy: "Write flows stay scoped and reviewable. The agent proposes; the vault keeps receipts.",
  },
  {
    icon: BrainCircuit,
    title: "Answer trace",
    copy: "Retrieval becomes debuggable. Every answer can show its sources — or its gaps.",
  },
];

export default function ActArtifact() {
  const ref = useRef<HTMLElement>(null);
  useActFlow(4, ref);

  return (
    <section
      id="act-artifact"
      ref={ref}
      className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-28 px-4 py-[12vh] md:px-8"
    >
      {/* Gold-numbered header — the one act allowed off the cyan rail */}
      <Reveal className="mb-12">
        <div className="flex items-baseline gap-4">
          <span className="tnum font-mono text-[0.68rem] tracking-[0.08em] text-gold/80">
            {"//"}03
          </span>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-gold/50">
            Signature Artifact
          </span>
          <span className="h-px flex-1 self-center bg-gold/[0.12]" />
        </div>
      </Reveal>

      <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
        {/* Identity column */}
        <div className="flex flex-col gap-7 md:sticky md:top-28 md:self-start">
          <Reveal>
            <h2 className="font-display text-[clamp(2.8rem,6.5vw,5.6rem)] font-extrabold leading-[0.88] tracking-[-0.06em] text-white">
              Brain
              <br />
              Operator
            </h2>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="max-w-md text-[0.92rem] leading-[1.8] text-white/45">
              An operating layer for local AI work. Brain Operator turns an
              Obsidian vault into agent devtools: inspect what Claude Code and
              Codex searched, read, cited, missed, changed, and handed to the
              next session.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-2">
              {MODES.map((mode) => (
                <span
                  key={mode}
                  className="rounded-full border border-gold/20 bg-gold/[0.05] px-3.5 py-1.5 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-gold/80"
                >
                  {mode}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://brainoperator.rowy.engineer/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-3 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[#05070d] transition-all hover:-translate-y-0.5 hover:bg-[#e5bd6a]"
              >
                Open live
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://github.com/Ege-Deniz/brain-operator"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-cyan/10 px-5 py-3 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white/35 transition-all hover:border-cyan/35 hover:bg-cyan/[0.04] hover:text-cyan"
              >
                GitHub
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Living object + features */}
        <div className="flex flex-col gap-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[14px] border border-gold/[0.14] bg-[#04060c] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              <ArtifactBrain className="h-[380px] w-full md:h-[460px]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#04060c] via-[#04060c]/55 to-transparent p-6 pt-16">
                <div className="font-mono text-[0.5rem] uppercase tracking-[0.3em] text-gold/70">
                  Live object — technical preview
                </div>
                <p className="mt-2 font-display text-[clamp(1.4rem,2.6vw,2.1rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-white">
                  The brain is the interface.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 0.05}>
                  <div className="flex gap-5 rounded-lg border border-white/[0.06] bg-black/20 p-5">
                    <Icon className="mt-1 h-4 w-4 flex-shrink-0 text-gold" />
                    <div>
                      <div className="font-display text-[1rem] font-bold tracking-[-0.02em] text-white">
                        {f.title}
                      </div>
                      <p className="mt-1.5 text-[0.78rem] leading-[1.7] text-white/35">
                        {f.copy}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
