"use client";

// Cursor-following media peek for the archive (Depo Luxe hover-media grammar).
// A single fixed card follows the pointer and shows the hovered row's media —
// a real still where one exists, a mono "capture pending" poster otherwise so
// the grammar reads now and swaps to ~10s clips (mp4/webm) later with no
// structural change. Pointer-only; invisible on touch and reduced-motion.

import { useEffect, useRef, useState } from "react";

export type PeekItem = { id: string; title: string; media: string | null };

export default function ArchivePeek({
  activeId,
  items,
}: {
  activeId: string | null;
  items: PeekItem[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const active = items.find((i) => i.id === activeId) ?? null;

  useEffect(() => {
    const ok =
      window.matchMedia("(hover: hover)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(ok);
    if (!ok) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    // start off-screen so the card never flashes at the origin before the
    // first pointer sample lands (it snaps to the real cursor on first move).
    const target = { x: -9999, y: -9999 };
    const pos = { x: -9999, y: -9999 };
    let primed = false;
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.16;
      pos.y += (target.y - pos.y) * 0.16;
      el.style.transform = `translate(${pos.x + 26}px, ${pos.y - 90}px)`;
      raf =
        Math.abs(target.x - pos.x) > 0.4 || Math.abs(target.y - pos.y) > 0.4
          ? requestAnimationFrame(tick)
          : 0;
    };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!primed) {
        // snap to the cursor on the first sample — no lerp from off-screen
        primed = true;
        pos.x = e.clientX;
        pos.y = e.clientY;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  const show = !!active;
  const isVideo =
    active?.media?.endsWith(".mp4") || active?.media?.endsWith(".webm");

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[170px] w-[270px] overflow-hidden rounded-lg border border-white/15 bg-[#0e0e11] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
      style={{ opacity: show ? 1 : 0, transition: "opacity 0.28s ease" }}
    >
      {active?.media ? (
        isVideo ? (
          <video
            key={active.media}
            src={active.media}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={active.media}
            src={active.media}
            alt=""
            className="h-full w-full object-cover"
          />
        )
      ) : (
        <div className="flex h-full w-full flex-col items-start justify-end gap-1 bg-[radial-gradient(120%_100%_at_20%_0%,rgba(242,242,238,0.06),transparent)] p-3">
          <span className="font-mono text-[9px] uppercase tracking-[2px] text-white/40">
            {active?.title}
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[2px] text-white/25">
            capture pending — open ↗
          </span>
        </div>
      )}
    </div>
  );
}
