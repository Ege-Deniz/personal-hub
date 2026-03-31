"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const TERMINAL_LINES = [
  "> [SYSTEM]: Initializing daily_growth.sh...",
  "> Voyage Log // Initialized.",
  "> [STATUS]: Epoch 0842 / ∞",
  "> [LOG]: 1% improvement committed. Precision locked.",
  "> Neural model compiled. Forward pass OK.",
  "> [RESULT]: Gradient descent towards excellence optimized.",
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

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
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

      return () => clearInterval(interval);
    }, 400);

    return () => clearTimeout(timer);
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
