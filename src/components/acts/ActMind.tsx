"use client";

// ACT 1 — THE MIND. Canvas-pinned hero: kinetic split-type identity over the
// neural field. Scrub beats: dwell → headline releases upward → boot line
// hands off to the Operator act. Entrance plays when the loader completes.

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useActPin } from "./useActTrigger";

const LETTER_VARIANTS = {
  hidden: { opacity: 0, y: 32, filter: "blur(18px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
} as const;

function AnimatedLetters({
  text,
  className = "",
  baseDelay = 0,
  strokeOnly = false,
  play,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
  strokeOnly?: boolean;
  play: boolean;
}) {
  return (
    <motion.span
      className="inline-flex"
      initial="hidden"
      animate={play ? "visible" : "hidden"}
      transition={{ delayChildren: baseDelay, staggerChildren: 0.055 }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={LETTER_VARIANTS}
          className={`inline-block ${className}`}
          style={
            strokeOnly
              ? {
                  WebkitTextStroke: "2px rgba(0,229,255,0.18)",
                  color: "transparent",
                }
              : undefined
          }
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function ActMind({ play }: { play: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useActPin(1, ref, {
    length: "+=150%",
    build: (tl, el) => {
      const lines = el.querySelectorAll("[data-mind-line]");
      const aside = el.querySelectorAll("[data-mind-aside]");
      const boot = el.querySelector("[data-mind-boot]");
      const bootBar = el.querySelector("[data-mind-boot-bar]");

      // 0 → 0.30: dwell.
      tl.to({}, { duration: 0.3 });
      // Headline releases upward through its masks; asides slip away.
      tl.to(
        lines,
        { yPercent: -118, duration: 0.32, stagger: 0.05, ease: "power2.in" },
        0.3
      );
      tl.to(
        aside,
        { opacity: 0, y: -36, duration: 0.22, stagger: 0.03 },
        0.32
      );
      // Boot line hands off to the Operator.
      if (boot && bootBar) {
        tl.fromTo(
          boot,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.14 },
          0.66
        );
        tl.fromTo(
          bootBar,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.22, ease: "power1.inOut" },
          0.68
        );
        tl.to(boot, { opacity: 0, y: -16, duration: 0.1 }, 0.92);
      }
    },
  });

  return (
    <section
      id="act-mind"
      ref={ref}
      className="relative z-10 flex min-h-screen flex-col items-start justify-center overflow-hidden px-[5%]"
    >
      <div className="tex-wash pointer-events-none absolute inset-0 z-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-start">
        {/* Name — each line in an overflow mask so the scrub can release it */}
        <h1 className="mb-9 flex flex-col font-display text-[clamp(4.5rem,12vw,11rem)] font-extrabold uppercase leading-[0.92] tracking-[-4px]">
          <span className="overflow-hidden pb-1">
            <span data-mind-line className="block">
              <AnimatedLetters
                play={play}
                text="EGE"
                className="text-white text-shadow-hero"
                baseDelay={0.35}
              />
            </span>
          </span>
          <span className="ml-[clamp(2rem,8vw,10rem)] overflow-hidden pb-1">
            <span data-mind-line className="block">
              <AnimatedLetters play={play} text="DENIZ" baseDelay={0.75} strokeOnly />
            </span>
          </span>
        </h1>

        {/* Identity line */}
        <div data-mind-aside className="mb-7 ml-[clamp(1rem,4vw,5rem)] flex items-center gap-4">
          <motion.span
            className="block h-px bg-cyan/50"
            initial={{ width: 0 }}
            animate={play ? { width: "clamp(2.5rem,6vw,5.5rem)" } : { width: 0 }}
            transition={{ delay: 1.05, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
          <span className="inline-block overflow-hidden">
            <motion.span
              className="inline-block font-mono text-[clamp(0.7rem,1.05vw,0.95rem)] uppercase tracking-[0.4em] text-cyan"
              initial={{ y: "120%" }}
              animate={play ? { y: 0 } : { y: "120%" }}
              transition={{ delay: 1.0, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              AI-Native Developer
            </motion.span>
          </span>
        </div>

        {/* Subtitle + avatar */}
        <motion.div
          data-mind-aside
          className="ml-[clamp(1rem,4vw,5rem)] flex flex-wrap items-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="h-[68px] w-[68px] flex-shrink-0 overflow-hidden rounded-full border border-cyan/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/headset-character.png"
              alt="Ege Deniz"
              className="h-full w-full scale-[1.35] translate-y-[8%] object-cover"
            />
          </div>
          <p className="max-w-[440px] font-body text-[clamp(0.88rem,1.3vw,1.1rem)] leading-[1.75] text-white/70 text-shadow-hero">
            Building agent infrastructure and ML-grounded tools, shipped through
            spatial interfaces that don&apos;t look like the template.
          </p>
        </motion.div>

        {/* HUD coordinates */}
        <div
          data-mind-aside
          className="pointer-events-none absolute -bottom-[18vh] left-0 hidden items-center gap-3 font-mono text-[0.55rem] uppercase tracking-[0.3em] text-white/20 md:flex"
        >
          <span className="inline-block h-1 w-1 animate-pulse-dot rounded-full bg-cyan/70" />
          34°41&apos;N · 33°02&apos;E — SIGNAL LOCKED
        </div>
      </div>

      {/* Boot handoff line (revealed by scrub) */}
      <div
        data-mind-boot
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex w-[min(420px,70vw)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 opacity-0"
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.45em] text-cyan/80">
          Booting operator layer
        </span>
        <span
          data-mind-boot-bar
          className="block h-px w-full origin-left bg-gradient-to-r from-cyan via-cyan/60 to-transparent"
        />
      </div>

      {/* Scroll cue */}
      <motion.div
        data-mind-aside
        className="absolute bottom-14 right-[5%]"
        initial={{ opacity: 0 }}
        animate={play ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <a
          href="#act-operator"
          className="flex h-[42px] w-[42px] animate-bounce items-center justify-center rounded-full border border-cyan/15 bg-cyan/[0.02] transition-all hover:border-cyan"
          aria-label="Scroll to the operator act"
        >
          <ChevronDown className="h-4 w-4 text-cyan" />
        </a>
      </motion.div>
    </section>
  );
}
