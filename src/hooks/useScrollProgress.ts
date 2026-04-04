"use client";

import { useState, useEffect } from "react";

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const syncScrollProgress = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(Math.max(window.scrollY / scrollHeight, 0), 1));
    };

    syncScrollProgress();

    window.addEventListener("scroll", syncScrollProgress, { passive: true });
    window.addEventListener("resize", syncScrollProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncScrollProgress);
      window.removeEventListener("resize", syncScrollProgress);
    };
  }, []);

  return progress;
}
