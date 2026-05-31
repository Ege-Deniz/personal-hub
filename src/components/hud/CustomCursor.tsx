"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;
// Only real interactive targets grow the ring. No magnetism (it caused the
// ring to snap to element centers and stick/teleport over large bento cards).
const TARGETS = "a, button, [data-cursor], .act-btn";

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 32, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 350, damping: 32, mass: 0.4 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "ontouchstart" in window) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(TARGETS)) setHovering(true);
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(TARGETS)) setHovering(false);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [x, y]);

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[99999] hidden h-1.5 w-1.5 rounded-full bg-cyan md:block"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
        }}
        animate={{ scale: hovering ? 0 : 1 }}
        transition={{ duration: 0.2, ease: EASE }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[99999] hidden rounded-full border border-cyan/50 md:block"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? 44 : 26,
          height: hovering ? 44 : 26,
          opacity: hovering ? 0.8 : 0.35,
        }}
        transition={{ duration: 0.25, ease: EASE }}
      />
    </>
  );
}
