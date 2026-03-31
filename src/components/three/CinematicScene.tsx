"use client";

import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface CinematicSceneProps {
  scrollProgress: number;
  onIntroComplete: () => void;
}

/**
 * Full-screen cinematic background using a high-quality photograph.
 * Applies an infinite ultra-slow "Ken Burns" drift effect via Framer Motion:
 * subtle scale (1 → 1.06) + pan shift over ~25s, looping seamlessly.
 */
export default function CinematicScene({
  onIntroComplete,
}: CinematicSceneProps) {
  // Fire intro complete after image has time to load & fade in
  useEffect(() => {
    const timer = setTimeout(onIntroComplete, 2200);
    return () => clearTimeout(timer);
  }, [onIntroComplete]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ scale: 1.08, x: 20, y: -10, opacity: 0 }}
        animate={{
          scale: [1.0, 1.06, 1.02, 1.06, 1.0],
          x: [0, -15, 10, -8, 0],
          y: [0, 8, -5, 10, 0],
          opacity: 1,
        }}
        transition={{
          scale: { duration: 28, ease: "easeInOut", repeat: Infinity },
          x: { duration: 32, ease: "easeInOut", repeat: Infinity },
          y: { duration: 26, ease: "easeInOut", repeat: Infinity },
          opacity: { duration: 2.5, ease: "easeOut" },
        }}
      >
        <Image
          src="/bg-ship.jpg"
          alt="Cinematic ocean voyage"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      {/* Darkening overlay to keep text legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(3,8,18,0.55)] via-[rgba(3,8,18,0.35)] to-[rgba(3,8,18,0.7)]" />

      {/* Bottom fade for content blending */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-[#030812] to-transparent" />
    </div>
  );
}
