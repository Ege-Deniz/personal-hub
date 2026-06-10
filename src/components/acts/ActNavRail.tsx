"use client";

// Fixed act-navigation rail — seven dots tracking the act timeline.
// Click scrolls via Lenis when available. Hidden on mobile.

import { useEffect, useState } from "react";
import { actTimeline, syncActs } from "@/lib/fieldState";
import { scrollState } from "@/lib/scrollState";

const ACTS = [
  { id: "act-mind", label: "Mind" },
  { id: "act-operator", label: "Operator" },
  { id: "act-disciplines", label: "Disciplines" },
  { id: "act-artifact", label: "Artifact" },
  { id: "act-systems", label: "Systems" },
  { id: "act-signal", label: "Signal" },
  { id: "act-channel", label: "Channel" },
];

type LenisLike = {
  scrollTo: (target: HTMLElement | string, opts?: { duration?: number }) => void;
};

export default function ActNavRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      // The rail owns act-state sync now that no canvas director runs.
      syncActs(scrollState.scroll);
      const t = actTimeline();
      const idx = Math.max(0, Math.min(6, Math.floor(t + 0.02)));
      setActive((prev) => (prev === idx ? prev : idx));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    if (lenis) lenis.scrollTo(el, { duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Act navigation"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex"
    >
      {ACTS.map((a, i) => {
        const isActive = i === active;
        return (
          <button
            key={a.id}
            onClick={() => go(a.id)}
            className="group flex items-center gap-3"
            aria-label={`Go to ${a.label}`}
          >
            <span
              className={`font-mono text-[0.5rem] uppercase tracking-[0.25em] transition-all duration-300 ${
                isActive
                  ? "text-cyan opacity-100"
                  : "translate-x-1 text-white/30 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              }`}
            >
              {a.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "h-2 w-2 bg-cyan shadow-[0_0_8px_rgba(0,229,255,0.6)]"
                  : "h-1.5 w-1.5 border border-cyan/40 bg-transparent group-hover:bg-cyan/30"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
