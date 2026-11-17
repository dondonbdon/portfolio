"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import { detectExperienceCapability } from "@/lib/capability";
import { featuredProjects } from "@/content/projects";
import { useExperience } from "@/state/useExperience";
import { BootSequence } from "./overlay/BootSequence";
import { NavHUD } from "./overlay/NavHUD";
import { ProjectPanel } from "./overlay/ProjectPanel";
import { AboutOverlay } from "./overlay/AboutOverlay";
import { LiteSite } from "./lite/LiteSite";

const Experience = dynamic(
  () => import("./three/Experience").then((m) => m.Experience),
  { ssr: false }
);

export function ExperienceGate() {
  const [checked, setChecked] = useState(false);
  const [reason, setReason] = useState<string | undefined>();

  const liteMode = useExperience((s) => s.liteMode);
  const phase = useExperience((s) => s.phase);
  const activeSlug = useExperience((s) => s.activeSlug);
  const setLiteMode = useExperience((s) => s.setLiteMode);
  const setQuality = useExperience((s) => s.setQuality);
  const setScrollProgress = useExperience((s) => s.setScrollProgress);
  const focusBody = useExperience((s) => s.focusBody);
  const exitFocus = useExperience((s) => s.exitFocus);

  useEffect(() => {
    let cancelled = false;
    detectExperienceCapability().then((report) => {
      if (cancelled) return;
      setQuality(report.initialQuality);
      if (!report.canUse3D) {
        setLiteMode(true);
        setReason(report.reason);
      }
      setChecked(true);
    });
    return () => {
      cancelled = true;
    };
  }, [setLiteMode, setQuality]);

  // Lenis smooth scroll driving the CatmullRomCurve3 camera rail in overview
  useEffect(() => {
    if (liteMode || phase !== "overview") return;

    const lenis = new Lenis({
      duration: 1.25,
      smoothWheel: true,
    });

    const updateProgress = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      updateProgress();
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updateProgress);
      lenis.destroy();
    };
  }, [liteMode, phase, setScrollProgress]);

  // Keyboard navigation (ArrowLeft / ArrowRight / Escape)
  useEffect(() => {
    if (liteMode) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (phase === "boot" || phase === "warp") return;
      if (e.key === "Escape") {
        if (phase === "focus" || phase === "about") {
          exitFocus();
        }
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const idx = activeSlug
          ? featuredProjects.findIndex((p) => p.slug === activeSlug)
          : -1;
        const nextIdx =
          idx === -1
            ? dir === 1
              ? 0
              : featuredProjects.length - 1
            : (idx + dir + featuredProjects.length) % featuredProjects.length;
        focusBody(featuredProjects[nextIdx].slug);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [liteMode, phase, activeSlug, exitFocus, focusBody]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#03050a] flex items-center justify-center">
        <div className="font-mono text-xs tracking-[0.22em] uppercase text-slate-400">
          Calibrating Orbital Sensors...
        </div>
      </div>
    );
  }

  if (liteMode) {
    return (
      <LiteSite
        reason={reason}
        onSwitchTo3D={() => {
          setLiteMode(false);
          setReason(undefined);
        }}
      />
    );
  }

  return (
    <div className="relative bg-[#03050a] text-slate-100">
      <Experience />
      <BootSequence />
      <NavHUD />
      <ProjectPanel />
      <AboutOverlay />

      {/* Virtual scroll track active during Overview phase so scroll drives the camera rail */}
      {phase === "overview" && (
        <div className="h-[650vh] w-full pointer-events-none" aria-hidden="true" />
      )}
    </div>
  );
}
