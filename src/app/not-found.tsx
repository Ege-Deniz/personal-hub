// Designed 404 — the signal-lost screen. Same observatory language as the
// rest of the instrument: mono telemetry, one action, no illustration.

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="font-mono text-[0.6rem] uppercase tracking-[4px] text-cyan/50">
        34°41&apos;N · 33°02&apos;E — signal lost
      </div>
      <h1 className="font-display text-[clamp(4rem,14vw,9rem)] font-bold leading-none tracking-[-0.02em] text-white">
        404
      </h1>
      <p className="max-w-[38ch] text-[0.85rem] leading-[1.7] text-white/40">
        This coordinate is outside the mapped field. The particles you are
        looking for dispersed, or never existed.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-2 rounded-md border border-cyan/20 px-5 py-2.5 font-mono text-[0.65rem] uppercase tracking-[2px] text-white/50 transition-all hover:border-cyan/60 hover:text-cyan hover:bg-cyan/[0.05]"
      >
        return to the field →
      </Link>
    </main>
  );
}
