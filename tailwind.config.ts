import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#030812",
        "abyss-light": "#0a1628",
        cyan: {
          DEFAULT: "#00e5ff",
          dim: "rgba(0,229,255,0.15)",
          glow: "rgba(0,229,255,0.4)",
        },
        gold: {
          DEFAULT: "#d4a853",
          dim: "rgba(212,168,83,0.12)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        body: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        "linear-out": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        snap: "cubic-bezier(1, 0, 0, 1)",
        material: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      backdropBlur: {
        glass: "20px",
      },
      animation: {
        "scan-line": "scan 6s ease-in-out infinite",
        "pulse-dot": "pdot 2.5s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        scan: {
          "0%": { top: "0", opacity: "0" },
          "10%, 90%": { opacity: "0.15" },
          "100%": { top: "100%", opacity: "0" },
        },
        pdot: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
