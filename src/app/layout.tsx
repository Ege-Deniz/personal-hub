import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EGE DENIZ — All-around Developer",
  description:
    "Architecting immersive web experiences, intelligent systems, & elite digital environments and graphics and applications.",
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
