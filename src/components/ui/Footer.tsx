"use client";

import { ArrowUpRight, Github, Instagram, Mail } from "lucide-react";

const LINKS = [
  { icon: Github, href: "https://github.com/Ege-Deniz", label: "GitHub" },
  { icon: Instagram, href: "https://www.instagram.com/eqe.deniz/", label: "Instagram" },
  { icon: Mail, href: "mailto:ege@rowy.engineer", label: "Email" },
];

export default function Footer() {
  return (
    <footer
      id="open-channel"
      className="relative z-10 mt-10 scroll-mt-24 border-t border-white/[0.08] px-4 pt-16 lg:px-16"
    >
      {/* Handoff — the session ends; the visitor picks it up */}
      <div className="mb-16">
        <div className="mb-5 flex items-baseline gap-3 font-mono">
          <span className="tnum text-[0.6rem] tracking-[0.08em] text-white/40">
            [06]
          </span>
          <span className="text-[0.68rem] lowercase tracking-[0.06em] text-cyan/80">
            &gt; handoff --to visitor
          </span>
        </div>
        <a
          href="mailto:ege@rowy.engineer"
          data-cursor
          className="group inline-flex max-w-full items-center gap-4 font-display text-[clamp(2rem,7vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-white/90 transition-colors duration-500 hover:text-cyan"
        >
          <span className="break-words">ege@rowy.engineer</span>
          <ArrowUpRight className="hidden h-[clamp(2rem,5vw,4rem)] w-[clamp(2rem,5vw,4rem)] flex-shrink-0 text-white/30 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan sm:block" />
        </a>
        <p className="mt-6 max-w-md text-[0.85rem] leading-[1.7] text-white/40">
          The session ends here. AI-native developer building agent systems,
          ML, and spatial web — heading into an AI master&apos;s. Pick the
          trace up where it stopped.
        </p>
      </div>

      {/* Credits row */}
      <div className="flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] py-6 sm:flex-row sm:items-center">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-white/25">
          &copy; 2026 Ege Deniz &middot; Cyprus 34.7&deg;N
        </p>
        <div className="flex gap-5">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.15em] text-white/30 transition-colors duration-300 hover:text-cyan"
            >
              <l.icon className="h-3.5 w-3.5" />
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
