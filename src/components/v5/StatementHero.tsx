"use client";

// Statement hero — the Dylan Brouwer landing grammar taken literally:
// viewport-filling condensed uppercase statement (line-masked in), the name
// demoted to a mono meta line with a live local clock, skeletal nav with one
// verb CTA. The field runs behind; the chrome is pure monochrome so the
// machine is the only color in the room.

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function StatementHero({ booted }: { booted: boolean }) {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setClock(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!booted || !h1Ref.current) return;
    const lines = h1Ref.current.querySelectorAll("[data-line]");
    gsap.fromTo(
      lines,
      { yPercent: 112 },
      { yPercent: 0, duration: 1.05, ease: "power4.out", stagger: 0.09, delay: 0.15 },
    );
  }, [booted]);

  return (
    <section
      id="hero"
      className="relative z-10 flex min-h-screen flex-col justify-between px-[4.5%] pt-6 pb-8"
    >
      {/* skeletal nav — 3 items + verb CTA (shader.se / monolog grammar) */}
      <nav className="flex items-center justify-between">
        <span className="font-mono text-[12px] tracking-[2px] text-white">
          rowy.engineer
        </span>
        <div className="flex items-center gap-3">
          <a href="#archive" className="hidden sm:inline font-mono text-[10px] uppercase tracking-[2px] text-white/45 hover:text-white transition-colors px-2 py-2">Work</a>
          <a href="#lab" className="hidden sm:inline font-mono text-[10px] uppercase tracking-[2px] text-white/45 hover:text-white transition-colors px-2 py-2">Lab</a>
          <a href="#signal" className="hidden sm:inline font-mono text-[10px] uppercase tracking-[2px] text-white/45 hover:text-white transition-colors px-2 py-2">Contact</a>
          <a
            href="mailto:ege@rowy.engineer"
            className="font-mono text-[10px] font-bold uppercase tracking-[2px] bg-white text-black rounded-md px-4 py-2.5 hover:bg-white/85 transition-colors"
          >
            Open a session ↗
          </a>
        </div>
      </nav>

      {/* the statement — fills the viewport width, breaks over three lines */}
      <h1
        ref={h1Ref}
        aria-label="Instruments, not demos. Proof attached."
        className="font-display font-bold uppercase leading-[0.94] tracking-[-0.03em] text-white"
        style={{ fontSize: "clamp(34px, 9.6vw, 150px)" }}
      >
        <span className="block overflow-hidden"><span data-line className="block">Instruments,</span></span>
        <span className="block overflow-hidden"><span data-line className="block text-white/40">not demos.</span></span>
        <span className="block overflow-hidden"><span data-line className="block">Proof attached.</span></span>
      </h1>

      {/* meta line — name demoted, live clock (dylan grammar), all real */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-white/10 pt-5">
        <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-[10px] uppercase tracking-[2.5px] text-white/35">
          <span>operator — <b className="font-normal text-white/70">Ege Deniz</b></span>
          <span>base — <b className="font-normal text-white/70">34°41′N 33°02′E</b></span>
          <span>local — <b className="font-normal text-white/70 tabular-nums">{clock}</b></span>
          <span className="hidden md:inline">next — <b className="font-normal text-white/70">MSc AI · 2026-09</b></span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[2.5px] text-white/35">
          scroll to operate ↓
        </span>
      </div>
    </section>
  );
}
