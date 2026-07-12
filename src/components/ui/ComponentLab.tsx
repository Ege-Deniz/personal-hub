"use client";

// THE LAB (#lab) — the components ARE the portfolio. Every cell is a live,
// touchable instance of an instrument built for this site, with its spec and
// where it runs. Asymmetric grid (Framer "Asymmetric Grid" reference), each
// demo interactive at full pointer strength — this is the answer to
// "where are the framer components": running, right here, open source.

import { useEffect, useRef, useState } from "react";
import AsciiFlowTrail from "@/components/fx/AsciiFlowTrail";
import DotGridField from "@/components/fx/DotGridField";
import FluidImage from "@/components/fx/FluidImage";
import MagneticCTA from "@/components/fx/MagneticCTA";
import WavyTicker from "@/components/fx/WavyTicker";
import { ShineText, TextReveal } from "@/components/fx/TextFX";

const SOURCE =
  "https://github.com/Ege-Deniz/personal-hub/tree/feat/awwwards-live-rebuild/src/components/fx";

// One-time fade-in on scroll into view — IntersectionObserver, not
// framer-motion (retired from the redesign per the winner-stack law).
function Cell({
  name,
  spec,
  usage,
  className,
  children,
  delay = 0,
}: {
  name: string;
  spec: string;
  usage: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "-60px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[rgba(14,14,17,0.72)] ${className ?? ""}`}
      style={{
        opacity: shown ? 1 : 0,
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      <div className="relative h-full min-h-[230px] flex flex-col">
        <div className="relative flex-1">{children}</div>
        <div className="relative z-10 flex items-end justify-between gap-3 border-t border-white/[0.07] bg-[rgba(11,11,14,0.78)] px-4 py-3">
          <div>
            <div className="font-display text-[0.92rem] font-bold text-white/90">
              {name}
            </div>
            <div className="mt-0.5 font-mono text-[0.5rem] uppercase tracking-[1.5px] text-white/30">
              {spec}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[0.48rem] uppercase tracking-[1.5px] text-white/40">
              {usage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComponentLab() {
  const gridRef = useRef<HTMLDivElement>(null);

  // Elastic grid scroll: middle column leads, outer columns lag — the grid
  // breathes with scroll velocity and settles flat at rest. Transform-only.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let lastY = window.scrollY;
    let vel = 0;
    const lag = [0.9, 0.35, 0.7]; // px of offset per px/frame of velocity, per column

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      vel += (dy - vel) * (Math.abs(dy) > Math.abs(vel) ? 0.25 : 0.07);
      const v = Math.max(-34, Math.min(34, vel));
      const cells = grid.children;
      for (let i = 0; i < cells.length; i++) {
        (cells[i] as HTMLElement).style.transform =
          `translateY(${(-v * lag[i % 3]).toFixed(2)}px)`;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      id="lab"
      className="relative z-10 mx-auto w-full max-w-[1400px] scroll-mt-24 px-[4.5%] py-[14vh]"
    >
      {/* calm scrim — the demos perform inside their cells, not the backdrop */}
      <div
        aria-hidden
        className="absolute inset-x-0 inset-y-6 rounded-3xl"
        style={{
          background:
            "radial-gradient(130% 110% at 28% 12%, rgba(11,11,14,0.86), rgba(11,11,14,0.5) 62%, rgba(11,11,14,0.22))",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      />
      {/* section header — same grammar as the archive/flagship acts */}
      <div className="relative mb-10 flex items-baseline justify-between border-b border-white/10 pb-4">
        <h2
          className="font-mono text-[10px] uppercase tracking-[3px] text-white/40"
          aria-label="The Lab — the instruments, running live."
        >
          The Lab — the instruments, running live
        </h2>
        <span className="font-mono text-[10px] tracking-[2px] text-white/25">
          touch them
        </span>
      </div>
      <p className="relative max-w-[54ch] text-[0.85rem] leading-[1.7] text-white/40">
        Every effect on this site is a component built for it — no libraries,
        no templates. Then read the source.
      </p>

      <div ref={gridRef} className="relative mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[260px]">
        {/* ascii wake — wide */}
        <Cell
          name="AsciiFlowTrail"
          spec="glyph lattice · pointer wake · 2d canvas"
          usage="lab exclusive"
          className="md:col-span-2"
          delay={0}
        >
          <div className="absolute inset-0">
            <AsciiFlowTrail opacity={0.85} />
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[0.6rem] uppercase tracking-[3px] text-white/20 group-hover:opacity-0 transition-opacity">
            move the cursor
          </div>
        </Cell>

        {/* dot orbit grid */}
        <Cell
          name="DotGridField"
          spec="orbital physics · tilted planes · ease-out decay"
          usage="ledger"
          delay={0.06}
        >
          <div className="absolute inset-0">
            <DotGridField opacity={0.9} />
          </div>
        </Cell>

        {/* fluid displacement */}
        <Cell
          name="FluidImage"
          spec="webgl ripple · velocity smear · raw glsl"
          usage="flagship"
          delay={0.12}
        >
          <FluidImage
            src="/setup.jpeg"
            alt="Workstation photograph with liquid cursor displacement"
            className="absolute inset-0"
          />
        </Cell>

        {/* text fx — wide */}
        <Cell
          name="TextFX"
          spec="word reveal · light sweep · scroll highlight"
          usage="every heading"
          className="md:col-span-2"
          delay={0.18}
        >
          <div className="absolute inset-0 flex flex-col items-start justify-center gap-3 px-6">
            <span className="font-display text-[clamp(1.4rem,3vw,2.2rem)] font-bold text-white/90">
              <TextReveal>Words rise on entry.</TextReveal>
            </span>
            <span className="font-display text-[clamp(1.4rem,3vw,2.2rem)] font-bold">
              <ShineText>Light sweeps across the glyphs.</ShineText>
            </span>
          </div>
        </Cell>

        {/* magnetic */}
        <Cell
          name="MagneticCTA"
          spec="pointer attraction · raf lerp · self-stopping"
          usage="every action"
          delay={0.24}
        >
          <div className="absolute inset-0 flex flex-wrap content-center items-center justify-center gap-3 px-4">
            <MagneticCTA strength={0.5}>
              <span className="inline-block rounded-md border border-white/20 bg-white/[0.05] px-5 py-2.5 font-mono text-[0.6rem] uppercase tracking-[1.5px] text-white/75">
                pull me
              </span>
            </MagneticCTA>
            <MagneticCTA strength={0.5}>
              <span className="inline-block rounded-md border border-white/20 bg-white/[0.05] px-5 py-2.5 font-mono text-[0.6rem] uppercase tracking-[1.5px] text-white/75">
                me too
              </span>
            </MagneticCTA>
          </div>
        </Cell>

        {/* ticker — full width, short */}
        <Cell
          name="WavyTicker"
          spec="sine-riding marquee · scroll-velocity reactive"
          usage="lab exclusive"
          className="md:col-span-3 md:!min-h-[150px]"
          delay={0.3}
        >
          <div className="absolute inset-0 flex items-center">
            <WavyTicker
              items={[
                "scroll faster",
                "the wave steepens",
                "60fps",
                "one raf loop",
              ]}
              speed={70}
              className="w-full font-display text-[1.5rem] font-bold text-white/70"
            />
          </div>
        </Cell>
      </div>

      <div className="relative mt-6 flex items-center justify-between gap-4">
        <p className="font-mono text-[0.55rem] uppercase tracking-[2px] text-white/25">
          six instruments live · the full set is in the repo · reduced-motion aware
        </p>
        <MagneticCTA>
          <a
            href={SOURCE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[1.5px] text-white/45 transition-all hover:border-white/50 hover:text-white hover:bg-white/[0.05]"
          >
            read the source ↗
          </a>
        </MagneticCTA>
      </div>
    </section>
  );
}
