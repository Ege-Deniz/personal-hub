"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import InferenceText from "../hud/InferenceText";

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

function padZ(n: number, width = 2) {
  return n.toString().padStart(width, "0");
}

function formatUptime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${padZ(h)}:${padZ(m)}:${padZ(s)}`;
}

function LiveHUD() {
  const [uptime, setUptime] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const [localTime, setLocalTime] = useState("--:--:--");

  useEffect(() => {
    const startedAt = Date.now();
    const tick = () => {
      const now = new Date();
      setUptime(Math.floor((Date.now() - startedAt) / 1000));
      setLocalTime(
        `${padZ(now.getHours())}:${padZ(now.getMinutes())}:${padZ(now.getSeconds())}`
      );
      const max = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      setScrollPct(
        Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100)))
      );
    };
    tick();
    const intervalId = window.setInterval(tick, 500);
    const onScroll = () => tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.55, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="mt-7 ml-[clamp(1rem,4vw,5rem)] flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.55rem] uppercase tracking-[2.5px] text-white/35"
      aria-hidden="true"
    >
      <span>
        <span className="text-cyan/60">build</span>{" "}
        <span className="text-white/55">0.4.20</span>
      </span>
      <span>
        <span className="text-cyan/60">uptime</span>{" "}
        <span className="text-white/55 tabular-nums">
          {formatUptime(uptime)}
        </span>
      </span>
      <span>
        <span className="text-cyan/60">scroll</span>{" "}
        <span className="text-white/55 tabular-nums">{padZ(scrollPct)}%</span>
      </span>
      <span>
        <span className="text-cyan/60">local</span>{" "}
        <span className="text-white/55 tabular-nums">{localTime}</span>
      </span>
      <span>
        <span className="text-cyan/60">lat</span>{" "}
        <span className="text-white/55">34.70°N</span>
      </span>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative z-10 mx-auto flex min-h-screen scroll-mt-24 max-w-[1400px] flex-col items-start justify-center px-[5%]"
    >
      <div className="relative z-10 w-full flex flex-col items-start">
        {/* Top rule */}
        <motion.div
          className="w-full border-t border-cyan/[0.12] pt-5 mb-10 flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="font-mono text-[0.65rem] tracking-[4px] uppercase text-cyan flex items-center gap-3">
            <span className="w-7 h-px bg-cyan" />
            <InferenceText text="System.Init()" />
          </div>
          <div className="font-mono text-[0.5rem] tracking-[2px] uppercase text-white/25 flex items-center gap-2">
            <span className="w-[5px] h-[5px] rounded-full bg-cyan shadow-[0_0_8px_rgba(0,229,255,0.4)] animate-pulse-dot" />
            Neural Simulation Active
          </div>
        </motion.div>

        {/* Name — per-letter blur-in reveal */}
        <h1 className="mb-9 flex flex-col font-display text-[clamp(4.5rem,12vw,11rem)] font-extrabold uppercase leading-[0.92] tracking-[-4px]">
          <AnimatedLetters
            text="EGE"
            className="text-white text-shadow-hero"
            baseDelay={0.5}
          />
          <span className="ml-[clamp(2rem,8vw,10rem)]">
            <AnimatedLetters text="DENIZ" baseDelay={0.95} strokeOnly />
          </span>
        </h1>

        {/* Subtitle */}
        <motion.div
          className="flex items-center gap-6 flex-wrap ml-[clamp(1rem,4vw,5rem)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-[68px] h-[68px] rounded-full overflow-hidden shadow-[0_0_20px_rgba(0,229,255,0.12)] border border-cyan/15 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/headset-character.png"
              alt="Ege Deniz"
              className="w-full h-full object-cover scale-[1.35] translate-y-[8%]"
            />
          </div>
          <p className="font-body text-[clamp(0.88rem,1.3vw,1.1rem)] text-white/70 leading-[1.75] max-w-[420px] text-shadow-hero">
            Building AI-native tools with a spatial edge — agent workflows,
            custom shaders, and{" "}
            <span className="font-serif italic text-gold text-[1.1em]">
              cinematic landings
            </span>{" "}
            that don&apos;t look like the template.
          </p>
        </motion.div>

        {/* Live HUD ticker */}
        <LiveHUD />

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-14 right-[5%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <a
            href="#hub"
            className="w-[42px] h-[42px] rounded-full flex items-center justify-center border border-cyan/15 bg-cyan/[0.02] hover:border-cyan hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all animate-bounce"
            aria-label="Scroll to personal hub"
          >
            <ChevronDown className="w-4 h-4 text-cyan" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
