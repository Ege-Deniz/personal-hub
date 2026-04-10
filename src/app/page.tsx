"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/ui/Hero";
import ChapterGate from "@/components/ui/ChapterGate";
import BentoGrid from "@/components/ui/BentoGrid";
import SystemArchitecture from "@/components/ui/SystemArchitecture";
import GlassCard from "@/components/ui/GlassCard";
import Terminal from "@/components/ui/Terminal";
import Footer from "@/components/ui/Footer";
import CustomCursor from "@/components/hud/CustomCursor";
import HUDOverlay from "@/components/hud/HUDOverlay";
import Loader from "@/components/hud/Loader";
import InferenceText from "@/components/hud/InferenceText";

const SpatialBackground = dynamic(
  () => import("@/components/three/SpatialBackground"),
  { ssr: false }
);

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const status = "Status: Navigating";
  const handleLoaderDone = useCallback(() => setLoaded(true), []);

  return (
    <>
      <SpatialBackground />
      <CustomCursor />
      <Loader onComplete={handleLoaderDone} />

      {loaded && (
        <>
          {/* Grain overlay */}
          <div
            className="fixed inset-0 z-[9998] pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "180px",
            }}
          />
          {/* Vignette */}
          <div
            className="pointer-events-none fixed inset-0 z-[1] opacity-75"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, #030812 100%)",
            }}
          />

          <HUDOverlay status={status} />

          <div className="relative z-10">
            <Navbar />
            <Hero />
            <ChapterGate />

            <BentoGrid>
              {/* ═══ ROW 1-2: Hero (2col tall) + Avatar + Setup (tall) ═══ */}
              <GlassCard className="card-hero" delay={0}>
                <div className="p-6 sm:p-8 h-full flex flex-col justify-center gap-3">
                  <div className="font-mono text-[0.5rem] tracking-[3px] uppercase text-gold/50 flex items-center gap-2">
                    <span className="inline-block w-5 h-px bg-gold/40" />
                    The Meta
                  </div>
                  <h2 className="font-display text-[2.5rem] sm:text-[3.5rem] font-extrabold leading-[0.95] tracking-tight">
                    <InferenceText text="SYSTEM INIT" delay={200} />
                  </h2>
                  <p className="font-display text-[1rem] sm:text-[1.15rem] font-semibold text-gold/80 tracking-wide">
                    All-Around Developer &amp; Systems Architect
                  </p>
                  <p className="text-[0.78rem] text-white/30 leading-[1.7] max-w-md mt-1">
                    Engineering intelligent systems, full-stack environments, and graphic design. Whether architecting AI algorithms or building web design environments, the underlying approach remains the same: absolute focus and precision.
                  </p>
                </div>
              </GlassCard>

                <GlassCard
                  className="card-avatar flex items-center justify-center"
                  delay={0.05}
                >
                  <div className="flex items-center justify-center w-full h-full p-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/headset-character.jpeg"
                      alt="Ege Deniz"
                      className="w-[120px] h-[120px] rounded-full object-contain bg-cyan/[0.04] border-[1.5px] border-cyan/15 shadow-[0_0_20px_rgba(0,229,255,0.08)]"
                    />
                  </div>
                </GlassCard>

                <GlassCard
                  className="card-setup !p-0 relative overflow-hidden"
                  delay={0.1}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/setup.jpeg"
                    alt="Battlestation"
                    className="w-full h-full object-cover absolute inset-0 scale-[1.08] origin-bottom hover:scale-[1.12] transition-transform duration-700"
                  />
                </GlassCard>

                <GlassCard className="card-location" delay={0.08}>
                  <div className="p-5 h-full flex flex-col justify-center gap-1">
                    <div className="font-mono text-[0.4rem] tracking-[2.5px] uppercase text-white/25">
                      Current Base
                    </div>
                    <div className="font-serif italic text-[1.8rem] leading-none text-white">
                      Cyprus
                    </div>
                    <div className="font-mono text-[0.4rem] text-cyan/20 tracking-[1.5px] mt-1">
                      34°41&apos;N · 33°02&apos;E
                    </div>
                  </div>
                </GlassCard>

                {/* ═══ ROW 3: Four image cards ═══ */}
                <GlassCard
                  className="card-img1 !p-0 relative min-h-[200px] overflow-hidden"
                  delay={0.15}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/ig1.jpeg"
                    alt="Editorial"
                    className="w-full h-full object-cover absolute inset-0 hover:scale-[1.03] transition-transform duration-700"
                  />
                </GlassCard>

                <GlassCard
                  className="card-img2 !p-0 relative min-h-[200px] overflow-hidden"
                  delay={0.2}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/ig2.jpeg"
                    alt="Dreams"
                    className="w-full h-full object-cover absolute inset-0 hover:scale-[1.03] transition-transform duration-700"
                  />
                </GlassCard>

                <GlassCard
                  className="card-img3 !p-0 relative min-h-[200px] overflow-hidden"
                  delay={0.25}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/ig3.jpeg"
                    alt="Coding"
                    className="w-full h-full object-cover absolute inset-0 hover:scale-[1.03] transition-transform duration-700"
                  />
                </GlassCard>

                <GlassCard
                  className="card-img4 !p-0 relative min-h-[200px] overflow-hidden"
                  delay={0.3}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/ig4.jpeg"
                    alt="Sunset"
                    className="w-full h-full object-cover object-bottom absolute inset-0 hover:scale-[1.03] transition-transform duration-700"
                  />
                </GlassCard>

                {/* ═══ ROW 4: Disciplines (2col) + Terminal (2col) ═══ */}
                <GlassCard className="card-disc" delay={0.35}>
                  <div className="p-6 h-full flex flex-col justify-center gap-4">
                    <div className="font-mono text-[0.4rem] tracking-[3px] uppercase text-gold/50">
                      Disciplines
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-display text-[0.85rem] font-bold mb-1">
                          System Architecture
                        </h4>
                        <p className="text-[0.7rem] text-white/25 leading-[1.55]">
                          Full-stack environments &amp; neural network logic.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-display text-[0.85rem] font-bold mb-1">
                          Competitive FPS
                        </h4>
                        <p className="text-[0.7rem] text-white/25 leading-[1.55]">
                          Tactical precision and high-level mechanics.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-display text-[0.85rem] font-bold mb-1">
                          Cinematic Visuals
                        </h4>
                        <p className="text-[0.7rem] text-white/25 leading-[1.55]">
                          Motion design &amp; immersive storytelling.
                        </p>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="card-terminal !p-0" delay={0.4}>
                  <Terminal />
                </GlassCard>

                {/* ═══ ROW 5: Spotify (2col) + Twitch + Steam ═══ */}
                <GlassCard className="card-spotify" delay={0.45}>
                  <div className="p-4 h-full flex flex-col justify-center">
                    <iframe
                      data-testid="embed-iframe"
                      style={{ borderRadius: "12px" }}
                      src="https://open.spotify.com/embed/playlist/2nW3ZjVuPDtAkKFWRp7mWI?utm_source=generator&theme=0"
                      width="100%"
                      height="352"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      title="Spotify Playlist"
                    />
                  </div>
                </GlassCard>

                <GlassCard className="card-twitch" delay={0.5}>
                  <div className="p-5 h-full flex flex-col justify-center items-center text-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-12 h-12 text-[#a970ff] mb-4"
                    >
                      <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" />
                    </svg>
                    <div className="font-display text-[1.2rem] font-bold mb-1">
                      Twitch{" "}
                      <span className="text-[0.6rem] text-[#ff4a4a] align-middle ml-1">
                        ● LIVE
                      </span>
                    </div>
                    <p className="text-[0.75rem] text-white/30 mb-4 leading-[1.5]">
                      Coding sessions, competitive FPS, and digital creation.
                    </p>
                    <a
                      href="https://www.twitch.tv/Rowy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[0.6rem] uppercase tracking-[1px] py-2 px-5 rounded-md border border-cyan/10 text-white/30 hover:border-cyan/40 hover:text-cyan hover:bg-cyan/[0.04] transition-all"
                    >
                      Visit Channel
                    </a>
                  </div>
                </GlassCard>

                <GlassCard className="card-steam" delay={0.55}>
                  <div className="p-5 h-full flex flex-col justify-center items-center text-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-12 h-12 text-[#66c0f4] mb-4"
                      style={{
                        filter:
                          "drop-shadow(0 0 6px rgba(102,192,244,0.3))",
                      }}
                    >
                      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 12-5.373 12-12s-5.372-12-12-12zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015z" />
                    </svg>
                    <div className="font-display text-[1.2rem] font-bold mb-1">
                      Steam
                    </div>
                    <p className="text-[0.75rem] text-white/30 mb-4 leading-[1.5]">
                      Counter-Strike and competitive FPS. Elite mechanics, every day.
                    </p>
                    <a
                      href="https://steamcommunity.com/id/restinpeperinos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[0.6rem] uppercase tracking-[1px] py-2 px-5 rounded-md border border-cyan/10 text-white/30 hover:border-cyan/40 hover:text-cyan hover:bg-cyan/[0.04] transition-all"
                    >
                      View Profile
                    </a>
                  </div>
                </GlassCard>

              </BentoGrid>

              <SystemArchitecture />

              <div
                id="network"
                className="mx-auto mt-3 w-full max-w-7xl scroll-mt-24 px-4 md:px-8"
              >
                <GlassCard className="w-full" delay={0.1}>
                  <div className="flex flex-wrap items-center justify-center gap-3 p-4">
                    {[
                      {
                        label: "GitHub",
                        href: "https://github.com/Ege-Deniz",
                        icon: (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                          >
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                            <path d="M9 18c-4.51 2-5-2-7-2" />
                          </svg>
                        ),
                      },
                      {
                        label: "Instagram",
                        href: "https://www.instagram.com/eqe.deniz/",
                        icon: (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                          >
                            <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                          </svg>
                        ),
                      },
                      {
                        label: "Twitch",
                        href: "https://www.twitch.tv/Rowy",
                        icon: (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                          >
                            <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" />
                          </svg>
                        ),
                      },
                      {
                        label: "Steam",
                        href: "https://steamcommunity.com/id/restinpeperinos",
                        icon: (
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 12-5.373 12-12s-5.372-12-12-12z" />
                          </svg>
                        ),
                      },
                      {
                        label: "Contact",
                        href: "mailto:ege@rowy.engineer",
                        icon: (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                          >
                            <rect width={20} height={16} x={2} y={4} rx={2} />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                        ),
                      },
                    ].map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md border border-cyan/10 px-5 py-2.5 font-mono text-[0.65rem] uppercase tracking-[1px] text-white/30 transition-all hover:border-cyan/40 hover:bg-cyan/[0.04] hover:text-cyan hover:shadow-[0_0_12px_rgba(0,229,255,0.08)]"
                      >
                        {link.icon}
                        {link.label}
                      </a>
                    ))}
                  </div>
                </GlassCard>
              </div>
              <Footer />
          </div>
        </>
      )}
    </>
  );
}
