"use client";

// The rose act — the page goes silent and the machine blooms. This section
// exists to give the field\'s hand-tuned rose morph a stage: its id="system"
// is the contract SpatialBackground already listens for (uSystemStage), so
// the bloom is driven by arriving here — no shader changes. One mono line,
// nothing else. Silence is the design.

export default function RoseAct() {
  return (
    <section
      id="system"
      aria-label="The field forms a rose"
      className="relative z-10 flex min-h-[180vh] flex-col items-start justify-center px-[4.5%]"
    >
      <p className="max-w-[30ch] font-mono text-[11px] uppercase leading-[2.2] tracking-[3px] text-white/40">
        the same 5,360 particles,
        <br />
        asked to be a rose —
      </p>
    </section>
  );
}
