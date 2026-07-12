import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// next/font: self-hosted, preloaded, zero render-blocking CSS @import.
const clash = localFont({
  src: [
    { path: "../../public/fonts/clash-display-500.woff2", weight: "500" },
    { path: "../../public/fonts/clash-display-600.woff2", weight: "600" },
    { path: "../../public/fonts/clash-display-700.woff2", weight: "700" },
  ],
  variable: "--font-syne", // keeps the existing tailwind var wiring
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const DESCRIPTION =
  "Ege Deniz — AI-native developer. Agent devtools, ML from first principles (backpropagation in C), and a hand-tuned particle field. Every claim verifiable in a repo, a thesis, or a live domain.";

export const metadata: Metadata = {
  metadataBase: new URL("https://rowy.engineer"),
  title: "Ege Deniz — Instruments, not demos",
  description: DESCRIPTION,
  authors: [{ name: "Ege Deniz", url: "https://github.com/Ege-Deniz" }],
  creator: "Ege Deniz",
  keywords: [
    "AI-native developer",
    "agent tooling",
    "machine learning",
    "spatial web",
    "three.js",
    "WebGL",
    "Ege Deniz",
    "rowy.engineer",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://rowy.engineer",
    title: "Ege Deniz — Instruments, not demos",
    description: DESCRIPTION,
    siteName: "rowy.engineer",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "rowy.engineer — Ege Deniz — Instruments, not demos. Proof attached.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ege Deniz — Instruments, not demos",
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

// Structured data — verifiable facts only (name, site, confirmed GitHub, and
// skill areas each evidenced by a shipped project). Makes the footer's
// "ask an agent about me" real at the data layer: agents and search engines
// get a machine-readable Person + WebSite instead of guessing from prose.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://rowy.engineer/#ege",
      name: "Ege Deniz",
      url: "https://rowy.engineer",
      jobTitle: "AI-native developer",
      description: DESCRIPTION,
      sameAs: ["https://github.com/Ege-Deniz"],
      knowsAbout: [
        "AI agent tooling",
        "machine learning",
        "backpropagation",
        "WebGL",
        "three.js",
        "spatial web",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://rowy.engineer/#site",
      url: "https://rowy.engineer",
      name: "rowy.engineer",
      description: DESCRIPTION,
      author: { "@id": "https://rowy.engineer/#ege" },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${clash.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {children}
      </body>
    </html>
  );
}
