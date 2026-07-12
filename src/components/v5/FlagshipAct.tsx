"use client";

// Flagship act — Brain Operator in the archive\'s own grammar at double
// scale: hairline rule, mono lane label, statement headline, real receipts
// from the data layer, full-bleed capture, one underlined link pair.
// No glass, no glow, no icon cards — the ledger already taught the page
// how to speak.

import FluidImage from "@/components/fx/FluidImage";
import { ARTIFACTS } from "@/data/artifacts";

export default function FlagshipAct() {
  const bo = ARTIFACTS.find((a) => a.id === "brain-operator")!;
  return (
    <section
      id="flagship"
      className="relative z-10 mx-auto max-w-[1400px] px-[4.5%] py-[14vh]"
    >
      <div className="mb-10 flex items-baseline justify-between border-b border-white/10 pb-4">
        <h2 className="font-mono text-[10px] uppercase tracking-[3px] text-white/40">
          Flagship — {bo.lane}
        </h2>
        <span className="font-mono text-[10px] tracking-[2px] text-white/25">
          {bo.index} at scale
        </span>
      </div>

      <p
        className="max-w-[16ch] font-display font-bold uppercase leading-[0.96] tracking-[-0.02em] text-white"
        style={{ fontSize: "clamp(34px, 6.2vw, 92px)" }}
      >
        The brain is the interface.
      </p>
      <p className="mt-6 max-w-[52ch] text-[14px] leading-[1.75] text-white/50">
        {bo.summary}
      </p>

      {/* full-bleed capture — liquid on pointer, plain on touch */}
      <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0e0e11]">
        <FluidImage
          src="/brain-operator-preview.png"
          alt="Brain Operator — agent devtools over an Obsidian vault"
          className="absolute inset-0"
        />
      </div>

      <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {bo.receipts.map((r) => (
            <span
              key={r}
              className="rounded-[5px] border border-white/15 bg-black/45 px-2.5 py-1 font-mono text-[9.5px] tracking-[0.5px] text-white/60"
            >
              {r}
            </span>
          ))}
        </div>
        <div className="flex gap-6">
          {bo.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] uppercase tracking-[2px] text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
