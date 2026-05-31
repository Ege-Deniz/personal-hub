"use client";

interface InferenceTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

/**
 * Renders text statically. The previous scramble/glitch "inference" effect was
 * removed for a more serious, credible register. Props are kept so existing
 * call sites don't need to change.
 */
export default function InferenceText({ text, className = "" }: InferenceTextProps) {
  return <span className={className}>{text}</span>;
}
