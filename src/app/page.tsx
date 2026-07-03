"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import ArtifactLedger from "@/components/ui/ArtifactLedger";
import OperatorSignal from "@/components/ui/OperatorSignal";
import Hero from "@/components/ui/Hero";
import ChapterGate from "@/components/ui/ChapterGate";
import BrainOperatorFeature from "@/components/ui/BrainOperatorFeature";
import SystemArchitecture from "@/components/ui/SystemArchitecture";
import GlassCard from "@/components/ui/GlassCard";
import Footer from "@/components/ui/Footer";
import CustomCursor from "@/components/hud/CustomCursor";
import HUDOverlay from "@/components/hud/HUDOverlay";
import Loader from "@/components/hud/Loader";

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

            <ArtifactLedger />

              <BrainOperatorFeature />

              <OperatorSignal />

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
