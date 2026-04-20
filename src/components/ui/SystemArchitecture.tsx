"use client";

const CAPABILITY_TRACKS = [
  {
    code: "01 // AI Engineering",
    title: "Agent workflows + LLM systems",
    copy: "Tool-use, memory, streaming UIs. Shipped as product surfaces, not demo chatboxes.",
    metric: "Claude / Python / Agents",
    accent: "text-cyan",
  },
  {
    code: "02 // Full-Stack Architecture",
    title: "Product architecture, end to end",
    copy: "Next.js App Router, typed APIs, auth, and deploy pipelines connected into one build flow.",
    metric: "Next.js / TypeScript / Vercel",
    accent: "text-purple-300",
  },
  {
    code: "03 // Spatial Web & Visual",
    title: "Spatial interfaces + shader systems",
    copy: "Three.js + R3F, custom GLSL, post-processing. Cinematic, not templated.",
    metric: "Three.js / R3F / GLSL",
    accent: "text-gold",
  },
];

export default function SystemArchitecture() {
  return (
    <section
      id="system"
      className="relative z-10 w-full scroll-mt-28 px-4 pt-12 pb-6 md:px-8"
    >
      <div className="mx-auto w-full max-w-7xl border-t border-cyan/[0.08] pt-6 md:pt-8">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(420px,1.25fr)] lg:gap-10">
          <div className="max-w-lg">
            <div className="mb-4 flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[4px] text-cyan/70">
              <span className="h-px w-8 bg-cyan/40" />
              Studio Operating System
            </div>

            <h2 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold leading-[0.92] tracking-[-0.05em] text-white">
              Engineer the logic.
              <br />
              Design the visual world.
            </h2>

            <p className="mt-4 max-w-md text-[0.8rem] leading-[1.75] text-white/45">
              One closing snapshot of how AI, engineering, and spatial craft
              fuse into a single studio operating system.
            </p>

            <div className="mt-6 space-y-3">
              {CAPABILITY_TRACKS.map((layer, index) => (
                <div
                  key={layer.code}
                  className="border-b border-white/[0.06] pb-3"
                >
                  <div
                    className={`font-mono text-[0.52rem] uppercase tracking-[3px] ${layer.accent}`}
                  >
                    {layer.code}
                  </div>
                  <div className="mt-2.5 flex items-start justify-between gap-8">
                    <div>
                      <h3 className="font-display text-[1.15rem] font-bold tracking-[-0.04em] text-white">
                        {layer.title}
                      </h3>
                      <p className="mt-1.5 max-w-sm text-[0.7rem] leading-[1.65] text-white/35">
                        {layer.copy}
                      </p>
                    </div>
                    <div className="hidden text-right font-mono text-[0.48rem] uppercase tracking-[2px] text-white/25 md:block">
                      0{index + 1}
                      <div className="mt-2 text-cyan/35">{layer.metric}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            aria-hidden="true"
            className="relative min-h-[300px] lg:min-h-[340px]"
          />
        </div>
      </div>
    </section>
  );
}
