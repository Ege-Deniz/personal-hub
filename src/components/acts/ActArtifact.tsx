"use client";

// ACT 4 — SIGNATURE ARTIFACT: Brain Operator. Sticky diptych: the identity
// column holds while feature beats crossfade; the climax expands the live
// product surface from letterbox to full bleed. The ONLY zone where gold is
// allowed in chrome — the field itself turns gold behind it.

import { useRef } from "react";
import { ArrowUpRight, BrainCircuit, GitBranch, ShieldCheck } from "lucide-react";
import { useActPin } from "./useActTrigger";

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

  useActPin(4, ref, {
    length: "+=180%",
    build: (tl, el) => {
      const beats = el.querySelectorAll("[data-art-beat]");
      const climax = el.querySelector("[data-art-climax]");
      const caption = el.querySelector("[data-art-caption]");

      const windows = [
        { inAt: 0.03, outAt: 0.2 },
        { inAt: 0.24, outAt: 0.41 },
        { inAt: 0.45, outAt: 0.6 },
      ];
      beats.forEach((beat, i) => {
        const w = windows[i];
        tl.fromTo(
          beat,
          { opacity: 0, y: 44 },
          { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
          w.inAt
        );
        tl.to(
          beat,
          { opacity: 0, y: -38, duration: 0.08, ease: "power2.in" },
          w.outAt
        );
      });

      if (climax) {
        tl.fromTo(
          climax,
          {
            opacity: 0,
            scale: 0.94,
            clipPath: "inset(14% 10% 14% 10% round 14px)",
          },
          {
            opacity: 1,
            scale: 1,
            clipPath: "inset(0% 0% 0% 0% round 14px)",
            duration: 0.3,
            ease: "power2.inOut",
          },
          0.64
        );
        if (caption) {
          tl.fromTo(
            caption,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.1 },
            0.84
          );
        }
      }
    },
  });

  return (
    <section
      id="act-artifact"
      ref={ref}
      className="relative z-10 min-h-screen overflow-hidden px-[6%] py-[10vh] md:py-0"
    >
      <div className="mx-auto grid h-full min-h-screen w-full max-w-7xl items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
        {/* Sticky identity column — gold zone */}
        <div className="flex flex-col gap-7 py-[6vh]">
          <div className="inline-flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.32em] text-gold/70">
            <span className="h-px w-8 bg-gold/40" />
            04 — Signature Artifact
          </div>

          <h2 className="font-display text-[clamp(2.8rem,6.5vw,5.6rem)] font-extrabold leading-[0.88] tracking-[-0.06em] text-white">
            Brain
            <br />
            Operator
          </h2>

          <p className="max-w-md text-[0.92rem] leading-[1.8] text-white/45">
            An operating layer for local AI work. Brain Operator turns an
            Obsidian vault into agent devtools: inspect what Claude Code and
            Codex searched, read, cited, missed, changed, and handed to the
            next session.
          </p>

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

          <div className="mt-2 flex flex-wrap gap-3">
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
        </div>

        {/* Beats + climax column */}
        <div className="relative h-[70vh] max-md:h-auto max-md:pb-[8vh]">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                data-art-beat
                className="absolute inset-0 flex flex-col items-start justify-center gap-5 max-md:relative max-md:mb-10 max-md:!opacity-100 max-md:!transform-none"
              >
                <Icon className="h-6 w-6 text-gold" />
                <h3 className="font-display text-[clamp(1.6rem,3vw,2.6rem)] font-bold tracking-[-0.04em] text-white">
                  {f.title}
                </h3>
                <p className="max-w-md text-[0.9rem] leading-[1.8] text-white/40">
                  {f.copy}
                </p>
              </div>
            );
          })}

          {/* Climax: the live surface expands to full bleed */}
          <div
            data-art-climax
            className="absolute inset-0 overflow-hidden rounded-[14px] border border-gold/[0.14] bg-[#05070d]/70 opacity-0 shadow-[0_30px_80px_rgba(0,0,0,0.45)] max-md:relative max-md:mt-4 max-md:aspect-[4/3] max-md:!opacity-100 max-md:[clip-path:none]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brain-operator-preview.png"
              alt="Brain Operator — cinematic particle-brain product hero"
              className="absolute inset-0 h-full w-full object-cover opacity-85 saturate-[1.08]"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,transparent_0,rgba(5,7,13,0.05)_24%,rgba(5,7,13,0.72)_85%)]" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#05070d] via-[#05070d]/65 to-transparent" />
            <div
              data-art-caption
              className="absolute bottom-0 left-0 z-10 p-7 opacity-0 max-md:!opacity-100"
            >
              <div className="font-mono text-[0.5rem] uppercase tracking-[0.3em] text-gold/70">
                Product signal — technical preview
              </div>
              <p className="mt-3 max-w-sm font-display text-[clamp(1.6rem,3.2vw,2.6rem)] font-extrabold leading-[0.92] tracking-[-0.05em] text-white">
                The brain is the interface.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
