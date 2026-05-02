"use client";

import { ArrowUpRight, BrainCircuit, GitBranch, ShieldCheck } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

const MODES = ["Ask", "Trace", "Evolve", "Ship", "Pulse"];

export default function BrainOperatorFeature() {
  return (
    <section
      id="brain-operator"
      className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-28 px-4 pt-4 pb-12 md:px-8"
    >
      <div className="mb-4 flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[4px] text-gold/70">
        <span className="h-px w-8 bg-gold/40" />
        Featured Artifact
      </div>

      <GlassCard className="relative overflow-hidden" delay={0.08}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(circle at 82% 24%, rgba(212,168,83,0.16), transparent 34%), radial-gradient(circle at 12% 92%, rgba(0,229,255,0.08), transparent 28%)",
          }}
        />

        <div className="relative grid gap-8 p-5 sm:p-7 lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
          <div className="order-2 flex min-h-[420px] flex-col justify-between gap-8 lg:order-none">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/15 bg-gold/[0.06] px-3 py-1.5 font-mono text-[0.55rem] uppercase tracking-[2.5px] text-gold/80">
                <BrainCircuit className="h-3.5 w-3.5" />
                Brain Operator · technical preview
              </div>

              <h2 className="max-w-2xl font-display text-[clamp(2.6rem,7vw,5.8rem)] font-extrabold leading-[0.85] tracking-[-0.07em] text-white">
                An operating layer for local AI work.
              </h2>

              <p className="mt-5 max-w-xl text-[0.82rem] leading-[1.8] text-white/45">
                Brain Operator turns an Obsidian vault into agent devtools:
                inspect what Claude Code and Codex searched, read, cited,
                missed, changed, and handed to the next session.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: GitBranch,
                  title: "Handoff log",
                  copy: "Sessions become durable context.",
                },
                {
                  icon: ShieldCheck,
                  title: "Guarded apply",
                  copy: "Write flows stay scoped and reviewable.",
                },
                {
                  icon: BrainCircuit,
                  title: "Answer trace",
                  copy: "Retrieval becomes debuggable.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-lg border border-white/[0.06] bg-black/20 p-4"
                  >
                    <Icon className="mb-3 h-4 w-4 text-gold" />
                    <div className="font-display text-[0.95rem] font-bold tracking-[-0.04em] text-white">
                      {item.title}
                    </div>
                    <p className="mt-1.5 text-[0.68rem] leading-[1.55] text-white/30">
                      {item.copy}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="brain-preview-shell order-1 relative min-h-[430px] overflow-hidden rounded-xl border border-gold/[0.12] bg-[#05070d]/70 shadow-[0_30px_80px_rgba(0,0,0,0.35)] lg:order-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brain-operator-preview.avif"
              alt="Brain Operator landing page with a cinematic particle brain hero"
              className="brain-preview-image absolute inset-0 h-full w-full object-cover opacity-80 saturate-[1.08]"
            />
            <div className="brain-preview-breath absolute inset-0" aria-hidden="true" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,transparent_0,rgba(5,7,13,0.04)_22%,rgba(5,7,13,0.74)_82%),linear-gradient(180deg,rgba(5,7,13,0.18),rgba(5,7,13,0.88))]" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#05070d] via-[#05070d]/70 to-transparent" />

            <div className="relative z-10 m-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <div className="font-mono text-[0.48rem] uppercase tracking-[3px] text-gold/60">
                  cinematic frontend
                </div>
                <div className="mt-1 font-display text-[1.15rem] font-bold tracking-[-0.04em] text-white">
                  Brain Operator
                </div>
              </div>
              <div className="rounded-full border border-gold/20 bg-gold/[0.08] px-3 py-1 font-mono text-[0.5rem] uppercase tracking-[2px] text-gold">
                v0.6.1
              </div>
            </div>

            <div className="relative z-10 mx-4 mt-6 grid grid-cols-5 gap-2">
              {MODES.map((mode) => (
                <div
                  key={mode}
                  className="rounded-full border border-gold/20 bg-black/35 py-2 text-center font-mono text-[0.5rem] text-white/55 backdrop-blur-md"
                >
                  {mode}
                </div>
              ))}
            </div>

            <div className="relative z-10 mt-36 px-5 sm:mt-44 sm:px-6">
              <div className="max-w-md">
                <div className="font-mono text-[0.5rem] uppercase tracking-[3px] text-gold/60">
                  product signal
                </div>
                <p className="mt-3 font-display text-[clamp(1.8rem,4.5vw,3rem)] font-extrabold leading-[0.9] tracking-[-0.06em] text-white">
                  The brain is the interface.
                </p>
                <p className="mt-3 max-w-sm text-[0.72rem] leading-[1.7] text-white/42">
                  The portfolio preview shows the real landing surface: dark
                  field, breathing particle brain, and a cinematic product
                  hero instead of a dashboard diagram.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-7 flex flex-wrap gap-3 px-5 pb-5 sm:px-6 sm:pb-6">
              <a
                href="https://brainoperator.rowy.engineer/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-gold/20 bg-gold px-4 py-2.5 font-mono text-[0.58rem] uppercase tracking-[1.6px] text-[#05070d] transition-all hover:-translate-y-0.5 hover:bg-[#e5bd6a]"
              >
                Open live
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://github.com/Ege-Deniz/brain-operator"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-cyan/10 px-4 py-2.5 font-mono text-[0.58rem] uppercase tracking-[1.6px] text-white/35 transition-all hover:border-cyan/35 hover:bg-cyan/[0.04] hover:text-cyan"
              >
                GitHub
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
