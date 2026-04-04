"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/~`αβγδεζηθικλμνξοπρστυφχψω∑∏∫∂∇∞≈≠≤≥";

interface InferenceTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

/**
 * Text that rapidly cycles through random characters before
 * "inferring" and locking into the final English string.
 */
export default function InferenceText({
  text,
  className = "",
  delay = 0,
  speed = 30,
}: InferenceTextProps) {
  const [display, setDisplay] = useState("");
  const [resolved, setResolved] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;
    let interval: ReturnType<typeof setInterval> | undefined;

    const timeout = setTimeout(() => {
      let currentResolved = 0;
      interval = setInterval(() => {
        if (currentResolved >= text.length) {
          clearInterval(interval);
          setDisplay(text);
          setResolved(text.length);
          return;
        }

        // Build display: resolved chars + random cycling chars for the rest
        let result = text.slice(0, currentResolved);
        for (let i = currentResolved; i < text.length; i++) {
          if (text[i] === " ") {
            result += " ";
          } else {
            result += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          }
        }
        setDisplay(result);

        // Resolve one more character every few ticks
        if (Math.random() > 0.4) {
          currentResolved++;
          setResolved(currentResolved);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [isInView, text, delay, speed]);

  return (
    <span ref={ref} className={className}>
      {display || text}
    </span>
  );
}
