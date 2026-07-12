"use client";

// Footer as a designed finale, not an afterthought: outline wordmark echoing
// the hero's stroke-only type, magnetic contact links, and a closing receipt
// line. Jurors score footers; this one closes the session.

import { Github, Instagram, Mail } from "lucide-react";
import MagneticCTA from "@/components/fx/MagneticCTA";

const LINKS = [
  { icon: Github, href: "https://github.com/Ege-Deniz", label: "GitHub" },
  {
    icon: Instagram,
    href: "https://www.instagram.com/eqe.deniz/",
    label: "Instagram",
  },
  { icon: Mail, href: "mailto:ege@rowy.engineer", label: "ege@rowy.engineer" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-cyan/[0.06] px-6 pb-8 pt-16 lg:px-16">
      {/* outline wordmark — echoes the hero's stroke-only DENIZ */}
      <div
        aria-hidden
        className="select-none text-center font-display text-[clamp(3.4rem,11vw,9.5rem)] font-bold uppercase leading-none tracking-[-0.02em]"
        style={{
          WebkitTextStroke: "1.5px rgba(0,229,255,0.14)",
          color: "transparent",
        }}
      >
        Ege Deniz
      </div>

      <div className="mx-auto mt-10 flex max-w-5xl flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {LINKS.map((l) => (
            <MagneticCTA key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-cyan/12 px-5 py-2.5 font-mono text-[0.62rem] uppercase tracking-[1.5px] text-white/40 transition-all hover:border-cyan/50 hover:bg-cyan/[0.05] hover:text-cyan"
              >
                <l.icon className="h-3.5 w-3.5" />
                {l.label}
              </a>
            </MagneticCTA>
          ))}
        </div>

        <div className="font-mono text-[0.5rem] uppercase tracking-[2.5px] text-cyan/25">
          34°41&apos;N · 33°02&apos;E — session persists
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-2 border-t border-cyan/[0.04] pt-5 text-[0.65rem] text-white/20 sm:flex-row">
          <span>&copy; 2026 Ege Deniz</span>
          <span className="font-mono text-[0.55rem] tracking-[1px]">
            engineered by hand · three.js + next.js · no template
          </span>
        </div>
      </div>
    </footer>
  );
}
