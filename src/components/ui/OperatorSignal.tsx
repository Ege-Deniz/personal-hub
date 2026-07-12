"use client";

// SIGNAL — a short operator statement between the flagship artifact and the
// systems section. Words light from dim to full as the paragraph crosses the
// viewport (fx/WordHighlight). Receipts-flavored copy, no slogans.

import { WordHighlight } from "@/components/fx/TextFX";

export default function OperatorSignal() {
  return (
    <section
      aria-label="Operator statement"
      className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-24 px-4 md:px-8 py-28"
    >
      {/* soft scrim so the statement stays legible over the field */}
      <div
        aria-hidden
        className="absolute inset-x-0 inset-y-10 rounded-3xl"
        style={{
          background:
            "radial-gradient(110% 100% at 25% 30%, rgba(11,11,14,0.8), rgba(11,11,14,0.4) 65%, transparent)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
        }}
      />
      <div className="relative mb-3 font-mono text-[0.65rem] tracking-[4px] uppercase text-cyan/60 flex items-center gap-3">
        <span className="w-7 h-px bg-cyan/60" />
        {"// Signal"}
      </div>
      <WordHighlight
        className="relative font-display text-[clamp(1.7rem,4.2vw,3.4rem)] font-bold leading-[1.25] tracking-tight max-w-[26ch]"
        style={{ margin: "28px 0 18px" }}
      >
        I build the instruments I need, then ship them. Backpropagation
        written in C and defended. Agent devtools running in public. A
        particle field tuned by hand, not a template.
      </WordHighlight>
      <p className="relative font-mono text-[0.6rem] uppercase tracking-[2.5px] text-white/25">
        next: MSc Artificial Intelligence · Maastricht · 2026-09
      </p>
    </section>
  );
}
