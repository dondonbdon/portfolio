"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useExperience } from "@/state/useExperience";
import { profile } from "@/content/profile";

const BOOT_LOGS = [
  "initializing WebGL2 orbital telemetry...",
  "compiling GLSL spiral-arm particle shaders...",
  "mounting 2023 origins belt [swift · elixer · oslea · paoz · idealzw]...",
  "linking stm32-utils silicon trace & payment-processor kafka streams...",
  "hydrating flashpdf knowledge crystal & hacia webflux core...",
  "igniting spotly galactic star [android · ios · web · spring]...",
  "system nominal — trajectory locked.",
];

export function BootSequence() {
  const phase = useExperience((s) => s.phase);
  const engageWarp = useExperience((s) => s.engageWarp);
  const skipIntro = useExperience((s) => s.skipIntro);
  const setLiteMode = useExperience((s) => s.setLiteMode);

  const { progress, active } = useProgress();
  const [visibleLines, setVisibleLines] = useState(1);
  const [bootReady, setBootReady] = useState(false);

  useEffect(() => {
    if (phase !== "boot") return;
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= BOOT_LOGS.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 260);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (visibleLines >= BOOT_LOGS.length && (!active || progress >= 99)) {
      const timer = setTimeout(() => setBootReady(true), 220);
      return () => clearTimeout(timer);
    }
  }, [visibleLines, active, progress]);

  // Fallback safeguard so boot never hangs even if an optional texture is slow
  useEffect(() => {
    const fallback = setTimeout(() => setBootReady(true), 2400);
    return () => clearTimeout(fallback);
  }, []);

  useEffect(() => {
    if (phase !== "boot" || !bootReady) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        engageWarp();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, bootReady, engageWarp]);

  const pct = bootReady
    ? 100
    : Math.max(Math.round((visibleLines / BOOT_LOGS.length) * 85), Math.round(progress));
  const circumference = 2 * Math.PI * 52;
  const strokeOffset = circumference - (pct / 100) * circumference;

  return (
    <AnimatePresence>
      {phase === "boot" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45 } }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#03050a]/88 backdrop-blur-md px-6"
        >
          <div className="w-full max-w-xl flex flex-col items-center text-center">
            {/* Progress Ring */}
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="2"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  style={{ transition: "stroke-dashoffset 220ms ease-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-xl font-semibold tracking-tight text-slate-100">
                  {pct}%
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-amber-400/90">
                  {bootReady ? "READY" : "BOOT"}
                </span>
              </div>
            </div>

            <p className="font-mono text-xs tracking-[0.26em] uppercase text-slate-400 mb-2">
              {profile.handle} · Orbital Engineering Archive
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-slate-50 mb-6">
              {profile.name}&rsquo;s Project Galaxy
            </h1>

            {/* Terminal Log */}
            <div className="w-full rounded-lg border border-white/10 bg-[#050811]/90 p-4 text-left font-mono text-xs text-slate-300 mb-8 space-y-1.5 min-h-[164px]">
              {BOOT_LOGS.slice(0, visibleLines).map((line, i) => (
                <div key={line} className="flex items-start gap-2">
                  <span className="text-amber-400 select-none">&gt;</span>
                  <span className={i === visibleLines - 1 ? "text-slate-100" : "text-slate-400"}>
                    {line}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                id="engage-warp-btn"
                disabled={!bootReady}
                onClick={engageWarp}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md bg-amber-500 text-slate-950 font-semibold text-sm tracking-wide transition-all duration-200 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_32px_rgba(245,158,11,0.35)]"
              >
                <Sparkles className="w-4 h-4" />
                <span>ENGAGE WARP</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                id="skip-intro-btn"
                onClick={skipIntro}
                className="px-4 py-3 text-xs font-mono tracking-wider uppercase text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
              >
                Skip Intro
              </button>

              <button
                type="button"
                onClick={() => setLiteMode(true)}
                className="px-4 py-3 text-xs font-mono tracking-wider uppercase text-slate-500 hover:text-sky-300 transition-colors cursor-pointer"
              >
                2D Lite Mode
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
