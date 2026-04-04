"use client";

import { useClock } from "@/hooks/useClock";
import { useScrollProgress } from "@/hooks/useScrollProgress";

interface HUDOverlayProps {
  status: string;
}

export default function HUDOverlay({ status }: HUDOverlayProps) {
  const time = useClock();
  const scrollProgress = useScrollProgress();
  const depth = Math.round(scrollProgress * 10994);

  return (
    <>
      {/* Frame borders */}
      <div className="fixed inset-0 pointer-events-none z-50 hidden md:block">
        <div className="absolute top-0 left-0 right-0 h-px bg-cyan/[0.03]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-cyan/[0.03]" />
        <div className="absolute top-0 bottom-0 left-0 w-px bg-cyan/[0.03]" />
        <div className="absolute top-0 bottom-0 right-0 w-px bg-cyan/[0.03]" />

        {/* Corner marks */}
        {[
          "top-2.5 left-2.5",
          "top-2.5 right-2.5",
          "bottom-2.5 left-2.5",
          "bottom-2.5 right-2.5",
        ].map((pos) => (
          <div key={pos} className={`absolute ${pos} w-3 h-3`}>
            <div className="absolute top-0 left-0 w-3 h-px bg-cyan/[0.12]" />
            <div className="absolute top-0 left-0 w-px h-3 bg-cyan/[0.12]" />
          </div>
        ))}
      </div>

      {/* Depth tracker — bottom center */}
      <div className="fixed bottom-[18px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 pointer-events-none font-mono text-[0.5rem] tracking-[2px] text-cyan/25 uppercase hidden md:flex">
        <span>{depth}m</span>
        <div className="w-[120px] h-px bg-cyan/[0.06] rounded-sm overflow-hidden">
          <div
            className="h-full bg-cyan/40 transition-[width] duration-150"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <span className="opacity-35">voyage.depth</span>
      </div>

      {/* Location + clock — top right */}
      <div className="fixed top-12 right-6 z-50 pointer-events-none font-mono text-[0.45rem] tracking-[1.8px] text-cyan/18 uppercase hidden md:block">
        CYP · 34.7°N · {time}
      </div>

      {/* Status — bottom right */}
      <div className="fixed bottom-12 right-6 z-50 pointer-events-none font-mono text-[0.45rem] tracking-[1.8px] text-cyan/18 uppercase transition-colors duration-800 hidden md:block">
        {status}
      </div>
    </>
  );
}
