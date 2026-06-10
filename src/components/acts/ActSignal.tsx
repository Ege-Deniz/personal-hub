"use client";

// ACT 6 — SIGNAL. The human layer: a velocity-coupled marquee (speed and skew
// ride the Lenis scroll velocity), live HUD, social channels, and the off-duty
// media strip. Warmer, faster cut than the system acts.

import { useEffect, useRef } from "react";
import { useClock } from "@/hooks/useClock";
import { scrollState } from "@/lib/scrollState";
import { useActFlow } from "./useActTrigger";

const MARQUEE_ITEMS = [
  "Signal online",
  "Cyprus 34°41'N",
  "Next: Maastricht",
  "Operator: Ege Deniz",
];

const CHANNELS = [
  { label: "Twitch", href: "https://www.twitch.tv/Rowy" },
  { label: "Steam", href: "https://steamcommunity.com/id/restinpeperinos" },
  { label: "Instagram", href: "https://www.instagram.com/eqe.deniz/" },
  { label: "GitHub", href: "https://github.com/Ege-Deniz" },
];

const MEDIA = [
  { src: "/setup.jpeg", alt: "Battlestation" },
  { src: "/ig1.jpeg", alt: "Editorial" },
  { src: "/ig2.jpeg", alt: "Dreams" },
  { src: "/ig3.jpeg", alt: "Coding" },
  { src: "/ig4.jpeg", alt: "Sunset" },
];

function VelocityMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let x = 0;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      const vel = scrollState.velocity;
      const speed = 60 + Math.min(Math.abs(vel) * 14, 480);
      x -= speed * dt;
      const half = track.scrollWidth / 2;
      if (-x >= half) x += half;
      const skew = Math.max(-6, Math.min(6, vel * 0.35));
      track.style.transform = `translateX(${x}px) skewX(${skew}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const row = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden py-2">
      <div ref={trackRef} className="flex w-max items-center gap-8 whitespace-nowrap will-change-transform">
        {[...row, ...row].map((m, i) => (
          <span
            key={i}
            className="flex items-center gap-8 font-display text-[clamp(2rem,5vw,4rem)] font-extrabold uppercase tracking-[-0.02em] text-white/[0.07]"
          >
            {m}
            <span className="text-cyan/25 text-[0.5em]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ActSignal() {
  const ref = useRef<HTMLElement>(null);
  const time = useClock();
  useActFlow(6, ref);

  return (
    <section
      id="act-signal"
      ref={ref}
      className="relative z-10 w-full overflow-hidden py-[12vh]"
    >
      <div className="mb-10 px-[6%]">
        <div className="flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.32em] text-cyan/70">
          <span className="h-px w-8 bg-cyan/40" />
          06 — Signal
        </div>
      </div>

      <VelocityMarquee />

      <div className="mx-auto mt-12 flex w-full max-w-7xl flex-col gap-10 px-[6%]">
        {/* Live HUD row */}
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4 border-y border-white/[0.07] py-5 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-white/35">
          <span className="flex items-center gap-2.5">
            <span className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-cyan" />
            Operator online
          </span>
          <span className="tnum text-white/55">{time} local</span>
          <span>Cyprus · 34°41&apos;N 33°02&apos;E</span>
          <span className="hidden sm:inline">Coding sessions + competitive FPS</span>
        </div>

        {/* Channels */}
        <div className="flex flex-wrap gap-3">
          {CHANNELS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-cyan/10 px-5 py-2.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-white/35 transition-all hover:border-cyan/40 hover:bg-cyan/[0.04] hover:text-cyan"
            >
              {c.label}
            </a>
          ))}
        </div>

        {/* Off-duty media strip */}
        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {MEDIA.map((m) => (
            <div
              key={m.src}
              className="relative h-32 w-44 flex-shrink-0 overflow-hidden rounded-lg border border-white/[0.07] transition-all duration-500 hover:border-cyan/30 sm:h-36 sm:w-52"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.src}
                alt={m.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.06]"
              />
            </div>
          ))}
        </div>

        {/* Now playing */}
        <div className="max-w-xl">
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/playlist/2nW3ZjVuPDtAkKFWRp7mWI?utm_source=generator&theme=0"
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Now playing — Spotify"
          />
        </div>
      </div>
    </section>
  );
}
