"use client";

// The Archive — Depo Luxe's cinematic monochrome ledger grammar: indexed
// oversized rows over hairlines; hovering a row brightens it and reveals its
// receipts + link rail in place (valentin-mor expand grammar, no routes).
// Reads src/data/artifacts.ts — every chip is verifiable.

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ARTIFACTS } from "@/data/artifacts";
import ArchivePeek from "@/components/v5/ArchivePeek";

gsap.registerPlugin(ScrollTrigger);

export default function WorkArchive() {
  const [open, setOpen] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // one-time row entrance — mask up per row, staggered by index
      gsap.from("[data-row]", {
        yPercent: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.08,
        scrollTrigger: { trigger: section, start: "top 72%" },
      });
      // the field recedes because you arrived — scrim opacity scrubs with
      // scroll progress through the act (the page dims the instrument).
      gsap.fromTo(
        scrimRef.current,
        { opacity: 0.55 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.5,
          },
        },
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="archive"
      className="relative z-10 mx-auto max-w-[1400px] px-[4.5%] py-[12vh]"
    >
      {/* legibility valve — left-weighted ink wash, scrubbed by scroll so the
          field visibly recedes as you enter the act (not a static paint) */}
      <div
        ref={scrimRef}
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -inset-x-[4.5%]"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,11,14,0.94) 0%, rgba(11,11,14,0.86) 55%, rgba(11,11,14,0.66) 80%, rgba(11,11,14,0.34) 94%, transparent 100%)",
        }}
      />
      <div className="relative mb-10 flex items-baseline justify-between border-b border-white/10 pb-4">
        <h2 className="font-mono text-[10px] uppercase tracking-[3px] text-white/40">
          The Archive — shipped, with receipts
        </h2>
        <span className="font-mono text-[10px] tracking-[2px] text-white/25 tabular-nums">
          {String(ARTIFACTS.length).padStart(2, "0")} entries
        </span>
      </div>

      {ARTIFACTS.map((a) => {
        const isOpen = open === a.id;
        return (
          <article key={a.id} data-row className="relative border-b border-white/10">
            <button
              onClick={() => setOpen(isOpen ? null : a.id)}
              onMouseEnter={() => setHovered(a.id)}
              onMouseLeave={() => setHovered((h) => (h === a.id ? null : h))}
              aria-expanded={isOpen}
              className="group grid w-full grid-cols-[52px_1fr_auto] items-baseline gap-4 py-7 text-left md:grid-cols-[80px_1fr_220px_90px]"
            >
              <span className="font-mono text-[11px] text-white/30 tabular-nums">
                {a.index}
              </span>
              <span
                className={`font-display font-semibold uppercase tracking-[-0.02em] transition-colors duration-300 ${isOpen ? "text-white" : "text-white/55 group-hover:text-white"}`}
                style={{ fontSize: "clamp(24px, 3.8vw, 46px)", lineHeight: 1.02 }}
              >
                {a.title}
              </span>
              <span className="hidden font-mono text-[9.5px] uppercase tracking-[2px] text-white/30 md:block">
                {a.lane}
                <br />
                {a.year}
              </span>
              <span className="justify-self-end font-mono text-[10px] uppercase tracking-[2px] text-white/40 group-hover:text-white transition-colors">
                {isOpen ? "close" : "open"}
              </span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-5 pb-9 pl-[52px] md:pl-[80px] md:flex-row md:items-end md:justify-between">
                  <p className="max-w-[52ch] font-body text-[13.5px] leading-[1.75] text-white/50">
                    {a.summary}
                  </p>
                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <div className="flex max-w-[420px] flex-wrap gap-2 md:justify-end">
                      {a.receipts.map((r) => (
                        <span
                          key={r}
                          className="rounded-[5px] border border-white/15 bg-black/45 px-2.5 py-1 font-mono text-[9.5px] tracking-[0.5px] text-white/60"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      {a.links.map((l) => (
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
                </div>
              </div>
            </div>
          </article>
        );
      })}

      <ArchivePeek
        activeId={hovered}
        items={ARTIFACTS.map((a) => ({ id: a.id, title: a.title, media: a.media }))}
      />
    </section>
  );
}
