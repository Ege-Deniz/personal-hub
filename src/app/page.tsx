"use client";

// rowy.engineer — Typographic Authority (Direction A, docs/REDESIGN-DNA).
// Type carries the site; numbered acts in calm vertical rhythm; the one
// living object (ArtifactBrain) lives inside the Brain Operator act.

import { useCallback, useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/ui/Navbar";
import CustomCursor from "@/components/hud/CustomCursor";
import Loader from "@/components/hud/Loader";
import ActMind from "@/components/acts/ActMind";
import ActOperator from "@/components/acts/ActOperator";
import ActDisciplines from "@/components/acts/ActDisciplines";
import ActArtifact from "@/components/acts/ActArtifact";
import ActSystems from "@/components/acts/ActSystems";
import ActSignal from "@/components/acts/ActSignal";
import ActChannel from "@/components/acts/ActChannel";
import ActNavRail from "@/components/acts/ActNavRail";
import { fieldState } from "@/lib/fieldState";

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);

  const handleLoaderDone = useCallback(() => {
    setLoaded(true);
    // Sections were measured behind the loader; re-measure once revealed.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  // Late-loading assets (fonts, images) can shift pin distances.
  useEffect(() => {
    (window as unknown as { __fieldState?: typeof fieldState }).__fieldState =
      fieldState;
    (window as unknown as { __ST?: typeof ScrollTrigger }).__ST = ScrollTrigger;
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <>
      <CustomCursor />
      <Loader onComplete={handleLoaderDone} />

      {/* Grain overlay */}
      <div className="grain-layer" aria-hidden="true" />

      {/* Vignette frame */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-75"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, #030812 100%)",
        }}
      />

      <div className="relative z-10">
        <Navbar />
        <ActMind play={loaded} />
        <ActOperator />
        <ActDisciplines />
        <ActArtifact />
        <ActSystems />
        <ActSignal />
        <ActChannel />
      </div>

      <ActNavRail />
    </>
  );
}
