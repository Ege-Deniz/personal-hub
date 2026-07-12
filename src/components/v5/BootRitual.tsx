"use client";

// Boot ritual — mono counter + receipt boot-log over ink, wiping upward into
// the hero (Calot / Snellenberg preloader grammar). Doubles as GPGPU warm-up
// cover: the field compiles behind it. Real-asset gated with a hard cap.

import { useEffect, useRef, useState } from "react";

const LINES = [
  "> session boot — rowy.engineer",
  "> field: 5,360 particles · shaders compiling",
  "> receipts: verified",
];

export default function BootRitual({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [goneFromDom, setGoneFromDom] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onDone();
      doneRef.current = true;
      setLeaving(true);
      setPct(100);
      setLineCount(LINES.length);
      return;
    }
    // Timer-driven, not rAF — rAF throttles/pauses on unfocused or background
    // tabs, which would freeze the counter and hang the whole page. A wall-
    // clock interval always advances; the ritual completes no matter what.
    const started = Date.now();
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setPct(100);
      setLineCount(LINES.length);
      setLeaving(true);
      setTimeout(onDone, 650);
      setTimeout(() => setGoneFromDom(true), 1500);
    };
    const id = window.setInterval(() => {
      const t = (Date.now() - started) / 1400; // ≤1.4s ritual
      setPct(Math.min(100, Math.floor(t * 100)));
      setLineCount(Math.min(LINES.length, Math.floor(t * 4)));
      if (t >= 1) {
        window.clearInterval(id);
        finish();
      }
    }, 40);
    // absolute backstop — never hang past 2s regardless of timer coalescing
    const backstop = window.setTimeout(finish, 2000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(backstop);
    };
  }, [onDone]);

  if (goneFromDom) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-5 bg-abyss"
      style={{
        transform: leaving ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.7s cubic-bezier(0.76, 0, 0.24, 1)",
      }}
    >
      <div className="font-mono text-[11px] leading-8 text-white/60 min-h-[96px] text-left">
        {LINES.slice(0, lineCount).map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      <div className="font-mono text-[13px] tracking-[4px] text-white tabular-nums">
        {String(pct).padStart(3, "0")}%
      </div>
    </div>
  );
}
