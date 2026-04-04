"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import InferenceText from "../hud/InferenceText";

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

        {/* Name */}
        <motion.h1
          className="mb-9 flex flex-col font-display text-[clamp(4.5rem,12vw,11rem)] font-extrabold uppercase leading-[0.92] tracking-[-4px]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-white text-shadow-hero">EGE</span>
          <span
            className="ml-[clamp(2rem,8vw,10rem)] text-transparent"
            style={{ WebkitTextStroke: "2px rgba(0,229,255,0.18)" }}
          >
            DENIZ
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          className="flex items-center gap-6 flex-wrap ml-[clamp(1rem,4vw,5rem)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
            Architecting immersive web experiences, intelligent systems, &{" "}
            <span className="font-serif italic text-gold text-[1.1em]">
              elite digital environments
            </span>{" "}
            and graphics and applications.
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-14 right-[5%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
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
