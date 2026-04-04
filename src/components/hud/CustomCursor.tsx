"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const ringX = useSpring(0, { stiffness: 180, damping: 25 });
  const ringY = useSpring(0, { stiffness: 180, damping: 25 });
  const isHovering = useRef(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect touch devices
    if (typeof window !== "undefined" && "ontouchstart" in window) return;

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, .glass, .act-btn")) {
        isHovering.current = true;
        if (dotRef.current) {
          dotRef.current.style.width = "14px";
          dotRef.current.style.height = "14px";
          dotRef.current.style.background = "#d4a853";
          dotRef.current.style.boxShadow = "0 0 14px rgba(212,168,83,0.35)";
        }
        if (ringRef.current) {
          ringRef.current.style.width = "56px";
          ringRef.current.style.height = "56px";
          ringRef.current.style.borderColor = "#d4a853";
          ringRef.current.style.opacity = "0.5";
        }
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, .glass, .act-btn")) {
        isHovering.current = false;
        if (dotRef.current) {
          dotRef.current.style.width = "6px";
          dotRef.current.style.height = "6px";
          dotRef.current.style.background = "#00e5ff";
          dotRef.current.style.boxShadow = "none";
        }
        if (ringRef.current) {
          ringRef.current.style.width = "36px";
          ringRef.current.style.height = "36px";
          ringRef.current.style.borderColor = "rgba(0,229,255,0.5)";
          ringRef.current.style.opacity = "0.35";
        }
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

  // Hide on touch devices via media query in CSS
  return (
    <>
      <motion.div
        ref={dotRef}
        className="fixed top-0 left-0 z-[99999] hidden h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_10px_rgba(0,229,255,0.4)] pointer-events-none md:block"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          transition: "width 0.2s, height 0.2s, background 0.2s",
        }}
      />
      <motion.div
        ref={ringRef}
        className="fixed top-0 left-0 z-[99999] hidden h-9 w-9 rounded-full border border-cyan/50 opacity-35 pointer-events-none md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          transition: "width 0.3s, height 0.3s, border-color 0.3s",
        }}
      />
    </>
  );
}
