"use client";

import { Github, Instagram, Mail } from "lucide-react";

const LINKS = [
  { icon: Github, href: "https://github.com/Ege-Deniz", label: "GitHub" },
  { icon: Instagram, href: "https://www.instagram.com/eqe.deniz/", label: "Instagram" },
  { icon: Mail, href: "mailto:deadlyrod11@gmail.com", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 px-4 lg:px-16 py-7 border-t border-cyan/[0.03] mt-12 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-white/25 text-[0.7rem]">
        &copy; 2026 Ege Deniz. All rights reserved.
      </p>
      <div className="flex gap-4">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="text-white/25 text-[0.7rem] hover:text-cyan transition-colors flex items-center gap-1.5"
          >
            <l.icon className="w-3.5 h-3.5" />
            {l.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
