"use client";

import { useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function GlassCard({
  children,
  className = "",
  delay = 0,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
    rotateX.set(((y - cy) / cy) * -4);
    rotateY.set(((x - cx) / cx) * 4);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`glass glass-top-line relative overflow-hidden transition-colors duration-400 ${className}`}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Scanning glare line on hover */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,229,255,0.3), transparent)",
        }}
        initial={{ opacity: 0, top: 0 }}
        whileHover={{
          opacity: [0, 0.3, 0],
          top: ["0%", "100%"],
          transition: { duration: 2, ease: "easeInOut", repeat: Infinity },
        }}
      />
      {children}
    </motion.div>
  );
}
