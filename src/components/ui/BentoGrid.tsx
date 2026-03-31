"use client";

import { ReactNode } from "react";

interface BentoGridProps {
  children: ReactNode;
}

export default function BentoGrid({ children }: BentoGridProps) {
  return (
    <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      <div className="font-mono text-[0.6rem] tracking-[4px] uppercase text-cyan/25 mb-4 pl-0.5">
        {"// Core Architecture"}
      </div>
      <div className="bento-grid">
        {children}
      </div>
    </div>
  );
}
