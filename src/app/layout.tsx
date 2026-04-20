import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ege Deniz — AI-native Builder · Spatial Web",
  description:
    "AI-native builder shipping agent workflows, Claude skills, and cinematic spatial web experiences. Custom R3F engines and landing pages for AI developer tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
