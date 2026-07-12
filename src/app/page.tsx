"use client";

// rowy.engineer v5 — "Monochrome chrome, living color."
// Chrome is pure ink monochrome (MONOLOG / Depo Luxe two-hue discipline);
// the hand-tuned iridescent particle field is the only color on the page.
// Section grammars lifted literally from 2026 winners (see docs/CONCEPT.md):
// boot ritual (Calot), statement hero + meta clock (©Design by Dylan),
// brightening intro (Dylan), indexed archive (Depo Luxe), flagship + lab +
// rose act (ours), masthead footer + AI-referral row (MONOLOG).

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import LenisProvider from "@/components/v5/LenisProvider";
import BootRitual from "@/components/v5/BootRitual";
import StatementHero from "@/components/v5/StatementHero";
import IntroBrighten from "@/components/v5/IntroBrighten";
import WorkArchive from "@/components/v5/WorkArchive";
import FooterMasthead from "@/components/v5/FooterMasthead";
import ComponentLab from "@/components/ui/ComponentLab";
import FlagshipAct from "@/components/v5/FlagshipAct";
import RoseAct from "@/components/v5/RoseAct";
import CustomCursor from "@/components/hud/CustomCursor";

const SpatialBackground = dynamic(
  () => import("@/components/three/SpatialBackground"),
  { ssr: false }
);

export default function HomePage() {
  const [booted, setBooted] = useState(false);
  const handleBootDone = useCallback(() => setBooted(true), []);

  return (
    <LenisProvider>
      <SpatialBackground />
      <CustomCursor />
      <BootRitual onDone={handleBootDone} />

      {/* Vignette — ink, not navy */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-75"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, #0b0b0e 100%)",
        }}
      />

      <div className="relative z-10">
        <StatementHero booted={booted} />
        <IntroBrighten />
        <WorkArchive />
        <FlagshipAct />
        <ComponentLab />
        <RoseAct />
        <FooterMasthead />
      </div>
    </LenisProvider>
  );
}
