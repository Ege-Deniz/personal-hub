"use client";

import { useState, useEffect } from "react";

export function useClock() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(
        `${d.getHours().toString().padStart(2, "0")}:${d
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}
