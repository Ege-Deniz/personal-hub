"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function ChapterGate() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="architecture"
      className="relative z-10 scroll-mt-24 px-4 pt-24 pb-8 text-center"
    >
      <motion.div
        ref={ref}
        className="max-w-[52rem] mx-auto py-9 px-8 rounded-xl glass relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-20"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--cyan), transparent)",
          }}
        />
        {/* Scan line */}
        <div
          className="absolute left-0 right-0 h-px animate-scan-line"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--cyan), transparent)",
          }}
        />
        <div className="font-mono text-[0.45rem] tracking-[3.5px] uppercase text-cyan mb-3 opacity-40">
          {"// System Access Granted"}
        </div>
        <div className="font-display text-[clamp(1.2rem,2.5vw,1.9rem)] font-semibold tracking-tight text-white/70 leading-[1.35]">
          The shell disperses.
          <br />
          The <span className="font-serif italic text-white">systems graph</span>{" "}
          comes online.
        </div>
        <div className="mt-3 text-[0.75rem] text-white/25 max-w-[22rem] mx-auto">
          Visual storytelling hands off to the infrastructure, inference, and
          execution stack underneath.
        </div>
      </motion.div>
    </section>
  );
}
