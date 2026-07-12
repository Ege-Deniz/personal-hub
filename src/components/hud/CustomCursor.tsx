"use client";

// Custom cursor — a paper dot that tracks 1:1 and a ring that lags on an
// rAF lerp (no framer-motion; the winner stack is gsap/vanilla). Monochrome:
// paper only, size/opacity changes on interactive hover, gold reserved for
// status dots elsewhere. Desktop fine-pointer only; the CSS cursor:none rule
// is scoped to >=768px hover:hover, so touch keeps its native cursor.

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "ontouchstart" in window) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: mouse.x, y: mouse.y };
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      // dot tracks exactly; ring lags for weight
      dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%)`;
      ringPos.x += (mouse.x - ringPos.x) * 0.18;
      ringPos.y += (mouse.y - ringPos.y) * 0.18;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const setHover = (on: boolean) => {
      dot.style.width = on ? "14px" : "6px";
      dot.style.height = on ? "14px" : "6px";
      ring.style.width = on ? "56px" : "36px";
      ring.style.height = on ? "56px" : "36px";
      ring.style.opacity = on ? "0.6" : "0.35";
    };
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button")) setHover(true);
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button")) setHover(false);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99999] hidden h-1.5 w-1.5 rounded-full bg-[#f2f2ee] md:block"
        style={{ transition: "width 0.2s, height 0.2s" }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99999] hidden h-9 w-9 rounded-full border border-[#f2f2ee] opacity-35 md:block"
        style={{ transition: "width 0.3s, height 0.3s, opacity 0.3s" }}
      />
    </>
  );
}
