"use client";

// Shared calm-reveal primitives for the typographic act system.
// One rule: content appears with a single opacity + 8px rise, once,
// honoring prefers-reduced-motion. No character flights, no masks.

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Numbered act header: `//01 — The Operator` + hairline rule. */
export function ActHeader({
  index,
  title,
  className = "",
}: {
  index: string;
  title: string;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <div className="flex items-baseline gap-4">
        <span className="tnum font-mono text-[0.68rem] tracking-[0.08em] text-cyan/80">
          {"//"}
          {index}
        </span>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-white/40">
          {title}
        </span>
        <span className="h-px flex-1 self-center bg-white/[0.07]" />
      </div>
    </Reveal>
  );
}
