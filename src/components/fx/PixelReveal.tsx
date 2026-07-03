"use client";

// Pixel-block reveal — a mosaic of dark blocks dissolves in a shuffled order
// when the element scrolls into view, uncovering the child (Premium Pixel
// Hero reference). Pure DOM/CSS grid of divs; cheap, no canvas readback.
// Caller: HeroFrontDoor artifact preview (wraps the <img>).

import { ReactNode, useEffect, useRef, useState } from "react";

const COLS = 14;
const ROWS = 9;

export default function PixelReveal({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);
  const [order] = useState(() => {
    const idx = Array.from({ length: COLS * ROWS }, (_, i) => i);
    // Fisher–Yates shuffle for the dissolve order
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx;
  });

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGo(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setGo(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hostRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      {children}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          pointerEvents: "none",
        }}
      >
        {order.map((rank, i) => (
          <div
            key={i}
            style={{
              background: "var(--bg)",
              opacity: go ? 0 : 1,
              transition: `opacity 0.22s ease ${(rank / (COLS * ROWS)) * 0.9}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
