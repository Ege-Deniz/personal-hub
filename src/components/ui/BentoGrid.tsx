"use client";

import { ReactNode } from "react";

interface BentoGridProps {
  children: ReactNode;
}

export default function BentoGrid({ children }: BentoGridProps) {
  return (
    <section
      id="hub"
      className="relative z-10 mx-auto max-w-[1280px] scroll-mt-24 px-4 pt-6 pb-12 sm:px-6 lg:px-8"
    >
      <div className="font-mono text-[0.6rem] tracking-[4px] uppercase text-cyan/25 mb-4 pl-0.5">
        {"// Personal Hub"}
      </div>
      <div className="bento-grid">{children}</div>
    </section>
  );
}
