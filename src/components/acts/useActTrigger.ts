"use client";

// Shared ScrollTrigger wiring for the act spine.
// Desktop: pinned, scrubbed act that writes its local progress into fieldState.
// Mobile / reduced-motion: no pin — a lightweight scrub keeps the WebGL
// director fed so the field still travels, just without scroll theatre.

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { actRanges } from "@/lib/fieldState";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Keep the registered range in sync with the trigger's measured start/end
// (re-measured on every ScrollTrigger.refresh).
function track(index: number, st: ScrollTrigger) {
  const write = () => {
    actRanges[index] = { start: st.start, end: st.end };
  };
  write();
  const onRefresh = () => write();
  ScrollTrigger.addEventListener("refresh", onRefresh);
  return () => {
    ScrollTrigger.removeEventListener("refresh", onRefresh);
    actRanges[index] = null;
  };
}

export const DESKTOP_MOTION =
  "(min-width: 769px) and (prefers-reduced-motion: no-preference)";
export const MOBILE_OR_REDUCED =
  "(max-width: 768px), (prefers-reduced-motion: reduce)";

/** Pinned act. `build` adds scrubbed beats to the timeline (desktop only). */
export function useActPin(
  index: number,
  ref: RefObject<HTMLElement | null>,
  opts: {
    /** pin duration beyond the first viewport, e.g. "+=150%" */
    length: string;
    build?: (tl: gsap.core.Timeline, el: HTMLElement) => void;
  }
) {
  // Acts are static one-mount components; run once.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(DESKTOP_MOTION, () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: opts.length,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });
      opts.build?.(tl, el);
      const untrack = tl.scrollTrigger ? track(index, tl.scrollTrigger) : null;
      return () => untrack?.();
    });

    mm.add(MOBILE_OR_REDUCED, () => {
      const st = ScrollTrigger.create({
        trigger: el,
        // Act 1 sits at the document top — anchor its progress there so the
        // field rests in the hero state on load instead of mid-travel.
        start: index === 1 ? "top top" : "top 70%",
        end: "bottom 35%",
      });
      const untrack = track(index, st);
      return () => untrack();
    });

    return () => mm.revert();
  }, []);
}

/** Natural-flow act (no pin) — still feeds the field director. */
export function useActFlow(
  index: number,
  ref: RefObject<HTMLElement | null>,
  opts?: { start?: string; end?: string }
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: opts?.start ?? "top 75%",
      end: opts?.end ?? "bottom 55%",
    });
    const untrack = track(index, st);
    return () => {
      untrack();
      st.kill();
    };
  }, []);
}
