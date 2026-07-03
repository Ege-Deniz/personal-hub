"use client";

// Image trail — moving the cursor spills a trail of images that scale in,
// drift with the pointer's direction, and dissolve (the Codrops image-trail
// lineage). DOM pool of absolute nodes, spawn gated by travel distance,
// capped concurrency; pointer-only, reduced-motion aware.

import { useEffect, useRef } from "react";

const POOL = 10; // max concurrent trail cards
const SPAWN_DIST = 110; // px of pointer travel between spawns
const LIFE = 900; // ms

export default function ImageTrail({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || images.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    // pre-build the pool
    const nodes: HTMLDivElement[] = [];
    for (let i = 0; i < POOL; i++) {
      const d = document.createElement("div");
      d.style.cssText = [
        "position:absolute",
        "width:150px;height:190px",
        "border-radius:10px",
        "overflow:hidden",
        "pointer-events:none",
        "opacity:0",
        "border:1px solid rgba(0,229,255,0.18)",
        "box-shadow:0 18px 50px rgba(0,0,0,0.55)",
        "will-change:transform,opacity",
        "background:#05070d",
      ].join(";");
      const img = document.createElement("img");
      img.style.cssText =
        "width:100%;height:100%;object-fit:cover;display:block";
      img.alt = "";
      d.appendChild(img);
      host.appendChild(d);
      nodes.push(d);
    }

    let cursor = 0; // pool index
    let imgIdx = 0;
    let lastX = -9999;
    let lastY = -9999;

    const spawn = (x: number, y: number, dx: number, dy: number) => {
      const node = nodes[cursor];
      cursor = (cursor + 1) % POOL;
      imgIdx = (imgIdx + 1) % images.length;
      (node.firstChild as HTMLImageElement).src = images[imgIdx];

      const rot = Math.max(-14, Math.min(14, dx * 0.12));
      node.animate(
        [
          {
            transform: `translate(${x - 75}px, ${y - 95}px) scale(0.35) rotate(${rot}deg)`,
            opacity: 0,
          },
          {
            transform: `translate(${x - 75 + dx * 1.4}px, ${y - 95 + dy * 1.4}px) scale(1) rotate(${rot}deg)`,
            opacity: 1,
            offset: 0.28,
          },
          {
            transform: `translate(${x - 75 + dx * 2.4}px, ${y - 95 + dy * 2.4 - 40}px) scale(0.92) rotate(${rot * 0.4}deg)`,
            opacity: 0,
          },
        ],
        { duration: LIFE, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" },
      );
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (lastX < -999) {
        lastX = x;
        lastY = y;
        return;
      }
      const dx = x - lastX;
      const dy = y - lastY;
      if (Math.hypot(dx, dy) > SPAWN_DIST) {
        spawn(x, y, dx * 0.35, dy * 0.35);
        lastX = x;
        lastY = y;
      }
    };
    const onLeave = () => {
      lastX = -9999;
      lastY = -9999;
    };
    const parent = host.parentElement ?? host;
    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);

    return () => {
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
      nodes.forEach((n) => host.removeChild(n));
    };
  }, [images]);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    />
  );
}
