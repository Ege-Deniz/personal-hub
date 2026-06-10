"use client";

// ACT 1 — THE MIND (Direction A: Typographic Authority).
// Type-only hero: one clip reveal on load, then still. No canvas, no
// character flights, no pin. The confidence is in the stillness.

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useActFlow } from "./useActTrigger";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export default function ActMind({ play }: { play: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  useActFlow(1, ref, { start: "top top", end: "bottom 40%" });

  const shown = play || !!reduce;

  return (
    <section
      id="act-mind"
      ref={ref}
      className="relative z-10 flex min-h-screen flex-col items-start justify-center px-[5%]"
    >
      <div className="tex-wash pointer-events-none absolute inset-0 z-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-start">
        {/* The session's first query — the site's premise in one line */}
        <motion.div
          className="mb-6 flex items-center gap-3 font-mono text-[0.72rem] lowercase tracking-[0.06em] text-cyan/80"
          initial={reduce ? false : { opacity: 0 }}
          animate={shown ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <span>&gt; query: who is the operator?</span>
          <span className="inline-block h-[1.1em] w-[7px] animate-blink bg-cyan/70" />
        </motion.div>

        {/* Name — the answer outputs once, then permanent */}
        <motion.h1
          className="mb-9 flex flex-col font-display text-[clamp(4.5rem,12vw,11rem)] font-extrabold uppercase leading-[0.92] tracking-[-4px]"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
        >
          <span className="text-white text-shadow-hero">EGE</span>
          <span
            className="ml-[clamp(2rem,8vw,10rem)]"
            style={{
              WebkitTextStroke: "2px rgba(0,229,255,0.22)",
              color: "transparent",
            }}
          >
            DENIZ
          </span>
        </motion.h1>

        {/* Identity line */}
        <motion.div
          className="mb-7 ml-[clamp(1rem,4vw,5rem)] flex items-center gap-4"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.55 }}
        >
          <span className="block h-px w-[clamp(2.5rem,6vw,5.5rem)] bg-cyan/50" />
          <span className="font-mono text-[clamp(0.7rem,1.05vw,0.95rem)] uppercase tracking-[0.4em] text-cyan">
            AI-Native Developer
          </span>
        </motion.div>

        {/* Subtitle + avatar */}
        <motion.div
          className="ml-[clamp(1rem,4vw,5rem)] flex flex-wrap items-center gap-6"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.65 }}
        >
          <div className="h-[68px] w-[68px] flex-shrink-0 overflow-hidden rounded-full border border-cyan/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/headset-character.png"
              alt="Ege Deniz"
              className="h-full w-full scale-[1.35] translate-y-[8%] object-cover"
            />
          </div>
          <p className="max-w-[440px] font-body text-[clamp(0.88rem,1.3vw,1.1rem)] leading-[1.75] text-white/70">
            Building agent infrastructure and ML-grounded tools, shipped through
            spatial interfaces that don&apos;t look like the template.
          </p>
        </motion.div>

        {/* Receipt line */}
        <motion.div
          className="pointer-events-none absolute -bottom-[16vh] left-0 hidden items-center gap-3 font-mono text-[0.55rem] lowercase tracking-[0.18em] text-white/20 md:flex"
          initial={reduce ? false : { opacity: 0 }}
          animate={shown ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <span className="text-cyan/50">✓</span> operator identified · 34°41&apos;n
          33°02&apos;e · signal locked
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-14 right-[5%]"
        initial={reduce ? false : { opacity: 0 }}
        animate={shown ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.05 }}
      >
        <a
          href="#act-operator"
          className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-cyan/15 bg-cyan/[0.02] transition-colors hover:border-cyan"
          aria-label="Scroll to the operator act"
        >
          <ChevronDown className="h-4 w-4 text-cyan" />
        </a>
      </motion.div>
    </section>
  );
}
