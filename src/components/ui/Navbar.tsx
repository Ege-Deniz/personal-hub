"use client";

import { motion } from "framer-motion";
import { Github, Instagram } from "lucide-react";

const NAV_LINKS = [
  { label: "Origin", href: "#hero" },
  { label: "Architecture", href: "#system" },
  { label: "Uplink", href: "#network" },
];

const SOCIAL_LINKS = [
  { icon: Github, href: "https://github.com/Ege-Deniz", label: "GitHub" },
  {
    icon: Instagram,
    href: "https://www.instagram.com/eqe.deniz/",
    label: "Instagram",
  },
  {
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[0.9rem] h-[0.9rem]"
      >
        <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" />
      </svg>
    ),
    href: "https://www.twitch.tv/Rowy",
    label: "Twitch",
  },
];

export default function Navbar() {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16 py-5"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Brand */}
      <a
        href="#"
        className="flex items-center gap-2 font-display font-bold text-[0.75rem] tracking-[0.16em] uppercase text-white text-shadow-hero"
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          className="w-5 h-5 opacity-60"
        >
          <ellipse cx={16} cy={18} rx={14} ry={4} />
          <path d="M6 18C6 18 7 8 16 8C25 8 26 18 26 18" />
          <path d="M8 13L24 13" strokeWidth={1.2} />
        </svg>
        <span>Ege Deniz</span>
      </a>

      {/* Center links */}
      <div className="hidden md:flex items-center gap-1 text-[0.7rem] font-medium tracking-[0.06em]">
        {NAV_LINKS.map((link, i) => (
          <span key={link.label} className="flex items-center">
            {i > 0 && (
              <span className="mx-2.5 text-white/10 text-[0.45rem]">·</span>
            )}
            <a
              href={link.href}
              className="text-white/25 hover:text-cyan transition-colors"
            >
              {link.label}
            </a>
          </span>
        ))}
      </div>

      {/* Social */}
      <div className="flex gap-1.5">
        {SOCIAL_LINKS.map((s) => {
          const Icon = s.icon as React.ElementType;
          return (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              title={s.label}
              className="w-[1.9rem] h-[1.9rem] rounded-full flex items-center justify-center text-white/40 bg-[rgba(6,12,24,0.5)] border border-cyan/[0.06] backdrop-blur-md hover:text-cyan hover:scale-110 hover:border-cyan/25 hover:shadow-[0_0_14px_rgba(0,229,255,0.08)] transition-all"
            >
              <Icon className="w-[0.9rem] h-[0.9rem]" />
            </a>
          );
        })}
      </div>
    </motion.nav>
  );
}
