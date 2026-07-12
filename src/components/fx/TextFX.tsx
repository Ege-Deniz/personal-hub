"use client";

// Text effects for the portfolio gateway, rebuilt natively from the Framer
// references (Text Reveal / Light Sweep / ScrollSyncedText):
//  - TextReveal: per-word rise+fade, staggered, triggered on scroll into view.
//  - ShineText: a light sweep that crosses the glyphs once on view, then rests.
//  - WordHighlight: scroll-synced word emphasis for statement paragraphs.
// All effects respect prefers-reduced-motion (content renders static).

import {
  CSSProperties,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export function TextReveal({
  children,
  className,
  style,
  delay = 0,
}: {
  children: string;
  className?: string;
  style?: CSSProperties;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const words = children.split(" ");
  return (
    <span ref={ref} className={className} style={style} aria-label={children}>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "bottom",
          }}
        >
          <span
            style={{
              display: "inline-block",
              transform: inView ? "translateY(0)" : "translateY(110%)",
              opacity: inView ? 1 : 0,
              transition: `transform 0.7s var(--ease-out) ${delay + i * 0.045}s, opacity 0.55s ease ${delay + i * 0.045}s`,
            }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}

export function ShineText({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.6);
  return (
    <span
      ref={ref}
      className={className}
      style={{
        ...style,
        display: "inline-block",
        backgroundImage:
          "linear-gradient(115deg, var(--text) 38%, #ffffff 46%, rgba(242,242,238,0.95) 50%, #ffffff 54%, var(--text) 62%)",
        backgroundSize: "260% 100%",
        backgroundPosition: inView ? "0% 0%" : "130% 0%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
        transition: "background-position 1.6s var(--ease-out) 0.25s",
      }}
    >
      {children}
    </span>
  );
}

export function WordHighlight({
  children,
  className,
  style,
}: {
  children: string;
  className?: string;
  style?: CSSProperties;
}) {
  const hostRef = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // 0 when the top enters at 85% viewport, 1 when it reaches 35%
        const p = (vh * 0.85 - r.top) / (vh * 0.5);
        setProgress(Math.max(0, Math.min(1, p)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const words = children.split(" ");
  const lit = Math.round(progress * words.length);
  return (
    <p ref={hostRef} className={className} style={style} aria-label={children}>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            color: i < lit ? "var(--text)" : "var(--text-dim)",
            transition: "color 0.35s ease",
          }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
