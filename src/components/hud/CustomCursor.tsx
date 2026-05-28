"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const TARGETS = "a, button, .glass, .act-btn, [data-cursor]";

export default function CustomCursor() {
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const ringX = useSpring(0, { stiffness: 250, damping: 28, mass: 0.5 });
  const ringY = useSpring(0, { stiffness: 250, damping: 28, mass: 0.5 });
  const [hovering, setHovering] = useState(false);
  const magnetEl = useRef<Element | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "ontouchstart" in window) return;

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      const el = magnetEl.current;
      if (el) {
        // Magnetic: ring eases toward element center, partially pulled by the pointer
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        ringX.set(cx + (e.clientX - cx) * 0.35);
        ringY.set(cy + (e.clientY - cy) * 0.35);
      } else {
        ringX.set(e.clientX);
        ringY.set(e.clientY);
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest(TARGETS);
      if (t) {
        magnetEl.current = t;
        setHovering(true);
      }
    };

    const onOut = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest(TARGETS);
      if (t && t === magnetEl.current) {
        magnetEl.current = null;
        setHovering(false);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [dotX, dotY, ringX, ringY]);

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[99999] hidden h-1.5 w-1.5 rounded-full bg-cyan md:block"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
        }}
        animate={{ scale: hovering ? 0 : 1 }}
        transition={{ duration: 0.2, ease: EASE }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[99999] hidden rounded-full border border-cyan/60 md:block"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? 54 : 30,
          height: hovering ? 54 : 30,
          opacity: hovering ? 0.9 : 0.4,
          backgroundColor: hovering ? "rgba(0,229,255,0.08)" : "rgba(0,229,255,0)",
        }}
        transition={{ duration: 0.3, ease: EASE }}
      />
    </>
  );
}
