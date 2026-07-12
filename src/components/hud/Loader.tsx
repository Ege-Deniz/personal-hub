"use client";

// Session boot — choreographed, deterministic preloader. No fake random
// increments: a fixed 1.7s timeline whose boot lines name the real things
// being mounted (field, ledger, session log). Reduced motion boots in 0.4s.

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  onComplete: () => void;
}

const BOOT_LINES: [number, string][] = [
  [0, "boot: particle field · 5,360 instanced"],
  [34, "mount: work ledger · 4 artifacts"],
  [64, "attach: session log · receipts"],
  [88, "signal locked"],
];

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DURATION = reduced ? 400 : 1700;
    const start = performance.now();
    let done = false;

    // setInterval (not rAF): rAF is paused in background tabs, which would
    // strand the page on the boot screen until the tab gains focus.
    const interval = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / DURATION);
      // ease-out so the bar lands softly instead of slamming into 100
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased * 100);
      if (t >= 1 && !done) {
        done = true;
        window.clearInterval(interval);
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 600);
        }, 350);
      }
    }, 24);
    return () => window.clearInterval(interval);
  }, [onComplete]);

  const line = BOOT_LINES.reduce(
    (acc, [at, text]) => (progress >= at ? text : acc),
    BOOT_LINES[0][1],
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-abyss flex flex-col items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <div className="font-mono text-[0.55rem] tracking-[0.4em] uppercase text-cyan/50 mb-10">
            Session Boot
          </div>
          <div className="w-[200px] h-px bg-cyan/[0.08] relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, var(--cyan), rgba(242,242,238,0.4))",
              }}
            />
          </div>
          <div className="font-display text-[3.2rem] font-light text-white mt-6 tracking-[-0.04em] tabular-nums">
            {Math.floor(progress)}
          </div>
          <div
            aria-live="polite"
            className="font-mono text-[0.5rem] text-cyan/40 mt-3 tracking-[0.2em] uppercase h-4"
          >
            {line}
          </div>
          <div className="font-mono text-[0.45rem] text-cyan/25 mt-2 tracking-[0.25em]">
            34°41&apos;N · 33°02&apos;E
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
