"use client";

// SESSION CHROME — the concept layer: rowy.engineer is a live agent session
// whose mission is "introduce the operator." This file owns the two pieces
// of persistent evidence: the session header strip and the trace rail
// (a scroll-synced session log — the site's signature interaction).

import { useEffect, useRef, useState } from "react";
import { actTimeline, syncActs } from "@/lib/fieldState";
import { scrollState } from "@/lib/scrollState";
import { useClock } from "@/hooks/useClock";

export const SESSION_STEPS = [
  { id: "act-mind", call: "query operator", label: "identity" },
  { id: "act-operator", call: "read operator.md", label: "statements" },
  { id: "act-disciplines", call: "search disciplines/", label: "4 results" },
  { id: "act-artifact", call: "open brain-operator", label: "artifact" },
  { id: "act-systems", call: "list shipped/", label: "5 systems" },
  { id: "act-signal", call: "signal --live", label: "human layer" },
  { id: "act-channel", call: "handoff", label: "to visitor" },
];

type LenisLike = {
  scrollTo: (target: HTMLElement | string, opts?: { duration?: number }) => void;
};

/** Thin fixed strip under the navbar: session identity + mission + clock. */
export function SessionHeader() {
  const time = useClock();
  return (
    <div className="pointer-events-none fixed left-8 top-[64px] z-40 hidden items-center gap-4 font-mono text-[0.52rem] uppercase tracking-[0.22em] text-white/25 lg:flex">
      <span className="flex items-center gap-2">
        <span className="inline-block h-1 w-1 animate-pulse-dot rounded-full bg-cyan/80" />
        session rowy.engineer
      </span>
      <span className="text-white/15">/</span>
      <span>mission: introduce the operator</span>
      <span className="text-white/15">/</span>
      <span className="tnum">{time}</span>
    </div>
  );
}

/** The trace rail — session log accumulating as the visitor scrolls. */
export default function TraceRail() {
  const [active, setActive] = useState(0);
  const startRef = useRef<number | null>(null);
  const [stamps, setStamps] = useState<string[]>(() => SESSION_STEPS.map(() => ""));

  useEffect(() => {
    if (startRef.current === null) startRef.current = performance.now();
    let raf = 0;
    const loop = () => {
      syncActs(scrollState.scroll);
      const t = actTimeline();
      const idx = Math.max(0, Math.min(6, Math.floor(t + 0.02)));
      setActive((prev) => {
        if (idx !== prev) {
          // Stamp newly-reached steps with real session-relative time.
          setStamps((old) => {
            const next = [...old];
            for (let i = 0; i <= idx; i++) {
              if (!next[i]) {
                const ms = performance.now() - (startRef.current ?? 0);
                const s = Math.floor(ms / 1000);
                next[i] = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
              }
            }
            return next;
          });
        }
        return idx;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    if (lenis) lenis.scrollTo(el, { duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Session trace"
      className="fixed right-6 top-1/2 z-40 hidden w-[210px] -translate-y-1/2 flex-col gap-[7px] lg:flex"
    >
      {SESSION_STEPS.map((s, i) => {
        const reached = i <= active;
        const isActive = i === active;
        return (
          <button
            key={s.id}
            onClick={() => go(s.id)}
            className={`group flex items-baseline gap-2 text-left font-mono text-[0.52rem] tracking-[0.08em] transition-colors duration-300 ${
              isActive ? "text-cyan" : reached ? "text-white/35" : "text-white/15"
            }`}
            aria-label={`Go to ${s.call}`}
          >
            <span className="tnum w-[34px] flex-shrink-0 text-right">
              {stamps[i] || "--:--"}
            </span>
            <span className="flex-shrink-0">
              {isActive ? "▸" : reached ? "✓" : "·"}
            </span>
            <span className="truncate lowercase group-hover:text-cyan">
              {s.call}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
