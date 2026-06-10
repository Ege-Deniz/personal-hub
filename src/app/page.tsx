"use client";

// rowy.engineer — "The brain is the interface."
// One persistent GPGPU neural field; seven scroll acts travel through it.
// Acts feed fieldState; the canvas director morphs camera + sim per act.

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import gsap from "gsap";
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

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const NeuralField = dynamic(() => import("@/components/three/NeuralField"), {
  ssr: false,
});

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);

  const handleLoaderDone = useCallback(() => {
    setLoaded(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      fieldState.boot = 1;
    } else {
      gsap.to(fieldState, { boot: 1, duration: 1.9, ease: "power3.inOut" });
    }
    // Pins were measured behind the loader; re-measure once revealed.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  // Late-loading assets (fonts, images) can shift pin distances.
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <>
      <NeuralField />
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
