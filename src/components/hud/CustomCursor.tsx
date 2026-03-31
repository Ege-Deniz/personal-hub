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
      if (target.closest("a, button, .card, .act-btn")) {
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
      if (target.closest("a, button, .card, .act-btn")) {
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
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-cyan rounded-full pointer-events-none z-[99999] mix-blend-difference hidden md:block"
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
        className="fixed top-0 left-0 w-9 h-9 border border-cyan/50 rounded-full pointer-events-none z-[99999] mix-blend-difference opacity-35 hidden md:block"
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
