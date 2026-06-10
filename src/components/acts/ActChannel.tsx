"use client";

// ACT 7 — OPEN CHANNEL. Footer-as-finale: as this act enters, the field
// disperses behind the oversized contact CTA ("the shell disperses").
// Reuses the existing Footer; this wrapper only feeds the act timeline.

import { useRef } from "react";
import Footer from "@/components/ui/Footer";
import { useActFlow } from "./useActTrigger";

export default function ActChannel() {
  const ref = useRef<HTMLElement>(null);
  useActFlow(7, ref, { start: "top 85%", end: "bottom bottom" });

  return (
    <section id="act-channel" ref={ref} className="relative z-10">
      <Footer />
    </section>
  );
}
