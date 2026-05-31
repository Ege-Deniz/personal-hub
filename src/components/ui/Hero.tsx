"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const LETTER_VARIANTS = {
  hidden: { opacity: 0, y: 32, filter: "blur(18px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
} as const;

interface AnimatedLettersProps {
  text: string;
  className?: string;
  baseDelay?: number;
  strokeOnly?: boolean;
}

function AnimatedLetters({
  text,
  className = "",
  baseDelay = 0,
  strokeOnly = false,
}: AnimatedLettersProps) {
  return (
    <motion.span
      className="inline-flex"
      initial="hidden"
      animate="visible"
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

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative z-10 mx-auto flex min-h-screen scroll-mt-24 max-w-[1400px] flex-col items-start justify-center px-[5%]"
    >
      {/* Soft-premium texture: gradient wash + masked halftone, left-weighted so the brain stays clean */}
      <div className="tex-wash pointer-events-none absolute inset-0 z-0" aria-hidden="true" />
      <div
        className="tex-halftone pointer-events-none absolute inset-0 z-0 opacity-[0.35]"
        style={{
          WebkitMaskImage: "linear-gradient(to right, #000 28%, transparent 68%)",
          maskImage: "linear-gradient(to right, #000 28%, transparent 68%)",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full flex flex-col items-start">
        {/* Name — per-letter blur-in reveal */}
        <h1 className="mb-9 flex flex-col font-display text-[clamp(4.5rem,12vw,11rem)] font-extrabold uppercase leading-[0.92] tracking-[-4px]">
          <AnimatedLetters
            text="EGE"
            className="text-white text-shadow-hero"
            baseDelay={0.4}
          />
          <span className="ml-[clamp(2rem,8vw,10rem)]">
            <AnimatedLetters text="DENIZ" baseDelay={0.85} strokeOnly />
          </span>
        </h1>

        {/* Identity line — single quiet reveal */}
        <div className="ml-[clamp(1rem,4vw,5rem)] mb-7 flex items-center gap-4">
          <motion.span
            className="block h-px bg-cyan/50"
            initial={{ width: 0 }}
            animate={{ width: "clamp(2.5rem,6vw,5.5rem)" }}
            transition={{ delay: 1.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
          <span className="inline-block overflow-hidden">
            <motion.span
              className="inline-block font-mono text-[clamp(0.7rem,1.05vw,0.95rem)] uppercase tracking-[0.4em] text-cyan"
              initial={{ y: "120%" }}
              animate={{ y: 0 }}
              transition={{ delay: 1.1, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              AI-Native Developer
            </motion.span>
          </span>
        </div>

        {/* Subtitle */}
        <motion.div
          className="flex items-center gap-6 flex-wrap ml-[clamp(1rem,4vw,5rem)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-[68px] h-[68px] rounded-full overflow-hidden border border-cyan/15 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/headset-character.png"
              alt="Ege Deniz"
              className="w-full h-full object-cover scale-[1.35] translate-y-[8%]"
            />
          </div>
          <p className="font-body text-[clamp(0.88rem,1.3vw,1.1rem)] text-white/70 leading-[1.75] max-w-[440px] text-shadow-hero">
            Building agent infrastructure and ML-grounded tools, shipped through
            spatial interfaces that don&apos;t look like the template.
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-14 right-[5%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <a
            href="#hub"
            className="w-[42px] h-[42px] rounded-full flex items-center justify-center border border-cyan/15 bg-cyan/[0.02] hover:border-cyan transition-all animate-bounce"
            aria-label="Scroll to personal hub"
          >
            <ChevronDown className="w-4 h-4 text-cyan" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
