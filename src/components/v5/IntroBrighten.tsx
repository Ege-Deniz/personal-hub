"use client";

// Intro statement — Dylan's oversized paragraph that brightens as you scroll
// (word-by-word, scrubbed by ScrollTrigger). One paragraph, receipts voice.

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TEXT =
  "I build the instruments I need, then ship them with the receipts attached — backpropagation written in C and defended, agent devtools running in public, and a particle field tuned by hand behind this page.";

export default function IntroBrighten() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.querySelectorAll<HTMLSpanElement>("span[aria-hidden]").forEach((s) => (s.style.color = "rgba(242,242,238,0.92)"));
      return;
    }
    const words = el.querySelectorAll("span[aria-hidden]");
    const tween = gsap.fromTo(
      words,
      { color: "rgba(242,242,238,0.5)" },
      {
        color: "rgba(242,242,238,0.92)",
        stagger: 0.02,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 82%", end: "top 30%", scrub: 0.4 },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section className="relative z-10 mx-auto max-w-[1400px] px-[4.5%] py-[14vh]">
      <p
        ref={ref}
        className="font-display font-medium leading-[1.22] tracking-[-0.015em]"
        style={{
          fontSize: "clamp(26px, 3.9vw, 52px)",
          textShadow: "0 2px 24px rgba(0,0,0,0.85)",
        }}
      >
        <span className="sr-only">{TEXT}</span>
        {TEXT.split(" ").map((w, i) => (
          <span key={i} aria-hidden>
            {w}{" "}
          </span>
        ))}
      </p>
    </section>
  );
}
