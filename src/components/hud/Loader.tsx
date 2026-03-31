"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 7 + 2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setVisible(false);
            setTimeout(onComplete, 600);
          }, 500);
          return 100;
        }
        return next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-abyss flex flex-col items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <div className="font-mono text-[0.55rem] tracking-[0.4em] uppercase text-cyan/50 mb-10">
            Charting Course
          </div>
          <div className="w-[200px] h-px bg-cyan/[0.08] relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full transition-[width] duration-100"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, var(--cyan), rgba(0,229,255,0.4))",
              }}
            />
          </div>
          <div className="font-display text-[3.2rem] font-light text-white mt-6 tracking-[-0.04em]">
            {Math.floor(progress)}
          </div>
          <div className="font-mono text-[0.45rem] text-cyan/25 mt-4 tracking-[0.25em]">
            34°41&apos;N · 33°02&apos;E — SIGNAL LOCKED
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
