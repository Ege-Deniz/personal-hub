"use client";

// WORK LEDGER (#hub) — shipped artifacts with verifiable receipts, replacing
// the old link-in-bio bento. Ledger rows over hairlines (no cards-in-cards);
// every chip is a fact that exists in a repo, a thesis, or a live domain.
// Brain Operator is intentionally absent here — it gets the flagship
// deep-dive section right below this one.

import { motion } from "framer-motion";
import MagneticCTA from "@/components/fx/MagneticCTA";
import { TextReveal } from "@/components/fx/TextFX";
import Terminal from "@/components/ui/Terminal";
import GlassCard from "@/components/ui/GlassCard";

type Artifact = {
  index: string;
  title: string;
  lane: string;
  description: string;
  receipts: string[];
  href: string;
  linkLabel: string;
};

const ARTIFACTS: Artifact[] = [
  {
    index: "01",
    title: "Backpropagation, from first principles",
    lane: "ML · systems",
    description:
      "BSc thesis: the backpropagation algorithm derived and implemented from scratch in C — a 35-10-6 network recognizing bipolar digit patterns, with a browser demo running the C-exported weights.",
    receipts: [
      "written in C",
      "converged @ epoch 207",
      "6/6 clean classification",
      "noise 100 / 100 / 98.3 %",
      "defended 2026-07-01",
    ],
    href: "https://backprop-public.vercel.app",
    linkLabel: "deck + live demo",
  },
  {
    index: "02",
    title: "SIBA",
    lane: "spatial web",
    description:
      "A WebGL experience site — three.js scenes, custom shaders, and motion built as one continuous piece rather than a page stack.",
    receipts: ["three.js + GLSL", "shipped on its own domain"],
    href: "https://siba.rowy.engineer",
    linkLabel: "siba.rowy.engineer",
  },
  {
    index: "03",
    title: "Zen Archery for Builders",
    lane: "agent discipline",
    description:
      "A former national archer's shot routine, rebuilt as session discipline for AI-assisted engineering. Public methodology repo, packaged as a Claude Code plugin.",
    receipts: ["public repo", "Claude plugin validates", "launched 2026-04-15"],
    href: "https://github.com/Ege-Deniz/zen-archery-for-builders",
    linkLabel: "github",
  },
  {
    index: "04",
    title: "This site",
    lane: "spatial web · meta",
    description:
      "The instrument you are inside right now: an instanced-particle field that morphs brain → field → rose as you scroll, with the camera on a six-keyframe rig.",
    receipts: ["5,360 instanced particles", "GPGPU morph targets", "open source"],
    href: "https://github.com/Ege-Deniz/personal-hub",
    linkLabel: "source",
  },
];

export default function ArtifactLedger() {
  return (
    <section
      id="hub"
      className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-24 px-4 md:px-8 py-24"
    >
      {/* glass scrim: calms the particle field behind the ledger text */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-3xl border border-cyan/[0.07]"
        style={{
          background:
            "radial-gradient(130% 110% at 28% 12%, rgba(3,8,18,0.88), rgba(3,8,18,0.55) 62%, rgba(3,8,18,0.28))",
          backdropFilter: "blur(7px)",
          WebkitBackdropFilter: "blur(7px)",
        }}
      />
      <div className="relative px-2 py-4 md:px-8 md:py-8">
        <div className="mb-3 font-mono text-[0.65rem] tracking-[4px] uppercase text-cyan/60 flex items-center gap-3">
          <span className="w-7 h-px bg-cyan/60" />
          {"// Work Ledger"}
        </div>
        <h2
          className="font-display text-[clamp(1.9rem,4.5vw,3.2rem)] font-bold tracking-tight text-white mb-2"
          aria-label="Shipped artifacts, with receipts."
        >
          <TextReveal>Shipped artifacts, with receipts.</TextReveal>
        </h2>
        <p className="text-[0.85rem] text-white/35 max-w-[52ch] leading-[1.7]">
          Every number below is verifiable — in a repo, a thesis, or a live
          domain. Nothing on this ledger is decoration.
        </p>

        <div className="mt-12 border-t border-cyan/[0.1]">
          {ARTIFACTS.map((a, i) => (
            <motion.article
              key={a.index}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-b border-cyan/[0.1] py-9 md:grid-cols-[64px_1.2fr_1fr_auto] md:items-baseline"
            >
              <span className="font-mono text-[0.7rem] text-gold/60 pt-1">
                {a.index}
              </span>
              <div>
                <h3 className="font-display text-[clamp(1.15rem,2.2vw,1.6rem)] font-bold text-white/90 group-hover:text-white transition-colors">
                  {a.title}
                </h3>
                <div className="mt-1 font-mono text-[0.55rem] uppercase tracking-[2.5px] text-cyan/45">
                  {a.lane}
                </div>
                <p className="mt-3 max-w-[46ch] text-[0.8rem] leading-[1.7] text-white/40">
                  {a.description}
                </p>
              </div>
              <ul className="col-start-2 md:col-start-3 flex flex-wrap content-start gap-2">
                {a.receipts.map((r) => (
                  <li
                    key={r}
                    className="rounded-md border border-cyan/[0.12] bg-cyan/[0.03] px-2.5 py-1 font-mono text-[0.58rem] tracking-[0.5px] text-white/50"
                  >
                    {r}
                  </li>
                ))}
              </ul>
              <div className="col-start-2 md:col-start-4 md:justify-self-end">
                <MagneticCTA>
                  <a
                    href={a.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-cyan/15 px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[1.5px] text-white/45 transition-all hover:border-cyan/50 hover:text-cyan hover:bg-cyan/[0.05]"
                  >
                    {a.linkLabel} ↗
                  </a>
                </MagneticCTA>
              </div>
            </motion.article>
          ))}
        </div>

        {/* live session log + operator context */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <GlassCard className="!p-0 min-h-[220px]" delay={0.1}>
            <Terminal />
          </GlassCard>
          <GlassCard delay={0.15}>
            <div className="p-6 h-full flex flex-col justify-center gap-4">
              <div className="font-mono text-[0.5rem] tracking-[3px] uppercase text-gold/50">
                Operator
              </div>
              <p className="text-[0.85rem] leading-[1.8] text-white/50 max-w-[46ch]">
                Computer engineering in Istanbul, base in Cyprus, next stop
                Maastricht — MSc in Artificial Intelligence, September 2026.
                Former national archer; the draw-and-release discipline now
                runs agent sessions instead of arrows.
              </p>
              <div className="font-mono text-[0.55rem] tracking-[2px] text-cyan/35 uppercase">
                34°41&apos;N · 33°02&apos;E — signal locked
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
