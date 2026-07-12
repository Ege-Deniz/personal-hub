"use client";

// Footer as act — MONOLOG grammar: the name finally arrives, viewport-wide,
// parked at the page's end; above it the AI-referral row (bymonolog\'s
// AI-era furniture) and the real contact rail. The field re-expands behind.

const ASK = encodeURIComponent(
  "Who is Ege Deniz (rowy.engineer)? Summarize his shipped work and receipts.",
);

export default function FooterMasthead() {
  return (
    <footer id="signal" className="relative z-10 mt-[8vh] border-t border-white/10 px-[4.5%] pt-14 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap gap-3">
          <a href="mailto:ege@rowy.engineer" className="rounded-full border border-white/15 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[2px] text-white/60 hover:text-white hover:border-white/50 transition-colors">ege@rowy.engineer</a>
          <a href="https://github.com/Ege-Deniz" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[2px] text-white/60 hover:text-white hover:border-white/50 transition-colors">GitHub ↗</a>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[9px] uppercase tracking-[2px] text-white/30">ask an agent about me —</span>
          <a href={"https://claude.ai/new?q=" + ASK} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-4 py-2 font-mono text-[9.5px] uppercase tracking-[1.5px] text-white/60 hover:text-white hover:border-white/50 transition-colors">Claude</a>
          <a href={"https://www.perplexity.ai/search?q=" + ASK} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-4 py-2 font-mono text-[9.5px] uppercase tracking-[1.5px] text-white/60 hover:text-white hover:border-white/50 transition-colors">Perplexity</a>
          <a href="/llms.txt" className="rounded-full border border-white/15 px-4 py-2 font-mono text-[9.5px] uppercase tracking-[1.5px] text-white/60 hover:text-white hover:border-white/50 transition-colors">llms.txt</a>
        </div>
      </div>

      <h2
        className="mt-12 select-none text-center font-display font-bold uppercase leading-[0.8] tracking-[-0.045em] text-white"
        style={{ fontSize: "clamp(44px, 15.5vw, 260px)" }}
      >
        Ege&nbsp;Deniz
      </h2>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[2px] text-white/25">
        <span>© 2026 · built by hand, measured in receipts</span>
        <span>34°41′N 33°02′E — signal locked</span>
      </div>
    </footer>
  );
}
