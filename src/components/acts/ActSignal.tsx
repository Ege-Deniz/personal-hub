"use client";

// ACT 6 — SIGNAL (Direction A). The human layer as a calm instrument strip:
// live status, channels, the off-duty wall, the soundtrack. No marquee —
// nothing moves except the clock and one pulse dot.

import { useRef } from "react";
import { useClock } from "@/hooks/useClock";
import { useActFlow } from "./useActTrigger";
import { ActHeader, Reveal } from "./Reveal";

const CHANNELS = [
  { label: "Twitch", href: "https://www.twitch.tv/Rowy" },
  { label: "Steam", href: "https://steamcommunity.com/id/restinpeperinos" },
  { label: "Instagram", href: "https://www.instagram.com/eqe.deniz/" },
  { label: "GitHub", href: "https://github.com/Ege-Deniz" },
];

const STRIP = [
  { src: "/ig1.jpeg", alt: "Editorial" },
  { src: "/ig2.jpeg", alt: "Dreams" },
  { src: "/ig3.jpeg", alt: "Coding" },
  { src: "/ig4.jpeg", alt: "Sunset" },
  { src: "/setup.jpeg", alt: "Battlestation" },
];

export default function ActSignal() {
  const ref = useRef<HTMLElement>(null);
  const time = useClock();
  useActFlow(6, ref);

  return (
    <section
      id="act-signal"
      ref={ref}
      className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-28 px-4 py-[12vh] md:px-8"
    >
      <ActHeader index="05" title="Signal" className="mb-12" />

      {/* Status instrument row */}
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4 border-t border-white/[0.07] py-6">
          <div className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-white/50">
            <span className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-cyan" />
            Operator online
          </div>
          <div className="tnum font-mono text-[0.62rem] uppercase tracking-[0.25em] text-white/35">
            {time} local
          </div>
          <div className="tnum hidden font-mono text-[0.62rem] uppercase tracking-[0.25em] text-white/25 md:block">
            34°41&apos;N · 33°02&apos;E
          </div>
          <div className="flex flex-wrap gap-2.5">
            {CHANNELS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/[0.1] px-4 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-white/40 transition-colors hover:border-cyan/40 hover:text-cyan"
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Off-duty wall */}
      <Reveal delay={0.08}>
        <div className="grid grid-cols-2 gap-3 border-t border-white/[0.07] py-8 sm:grid-cols-5">
          {STRIP.map((img) => (
            <div
              key={img.src}
              className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-white/[0.06]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </div>
          ))}
        </div>
      </Reveal>

      {/* Soundtrack */}
      <Reveal delay={0.12}>
        <div className="border-t border-white/[0.07] pt-8">
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/playlist/2nW3ZjVuPDtAkKFWRp7mWI?utm_source=generator&theme=0"
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Playlist"
          />
        </div>
      </Reveal>
    </section>
  );
}
