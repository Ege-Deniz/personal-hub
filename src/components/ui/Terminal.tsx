"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

// Real receipts only — every line below is verifiable in a repo, a thesis,
// or a public artifact. No cosplay telemetry.
const TERMINAL_LINES = [
  "> session: rowy.engineer — operator console",
  "> brain-operator v0.6.6 · parser 117/117 · apply-guard e2e 6/6",
  "> thesis: backpropagation in C · 35-10-6 · converged @ epoch 207",
  "> noise robustness 100 / 100 / 98.3 % at 1 / 3 / 5 flipped pixels",
  "> defended 2026-07-01 · BSc Computer Engineering",
  "> next: MSc Artificial Intelligence · Maastricht · 2026-09",
];

export default function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const currentLineRef = useRef(0);
  const [currentChar, setCurrentChar] = useState(0);

  // Sync ref with state
  useEffect(() => {
    currentLineRef.current = currentLine;
  }, [currentLine]);

  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;
    let interval: ReturnType<typeof setInterval> | undefined;

    const timer = setTimeout(() => {
      interval = setInterval(() => {
        setCurrentChar((prev) => {
          const line = TERMINAL_LINES[currentLineRef.current];
          if (!line) {
            clearInterval(interval);
            return prev;
          }
          if (prev < line.length) return prev + 1;
          return prev;
        });
      }, 12);
    }, 400);

    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [isInView, currentLine]);

  useEffect(() => {
    const line = TERMINAL_LINES[currentLine];
    if (!line || !started.current) return;

    if (currentChar >= line.length) {
      const timeout = setTimeout(() => {
        setLines((prev) => [...prev, line]);
        setCurrentLine((prev) => prev + 1);
        setCurrentChar(0);
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [currentChar, currentLine]);

  const activeLine = TERMINAL_LINES[currentLine];
  const partialText = activeLine ? activeLine.slice(0, currentChar) : "";

  return (
    <div ref={ref} className="h-full flex flex-col bg-[rgba(3,8,18,0.8)] rounded-xl overflow-hidden">
      {/* Terminal header */}
      <div className="flex gap-[5px] px-3.5 py-2.5 bg-black/30 border-b border-cyan/[0.04]">
        <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
        <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
        <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
      </div>

      {/* Terminal body */}
      <div className="p-3.5 font-mono text-[0.65rem] text-cyan/60 leading-[1.75] flex-grow flex flex-col gap-[3px]">
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
        {activeLine && (
          <span className="block">
            {partialText}
            <span className="text-cyan animate-blink">|</span>
          </span>
        )}
      </div>
    </div>
  );
}
