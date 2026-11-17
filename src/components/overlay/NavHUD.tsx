"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Compass, Layers, User } from "lucide-react";
import { featuredProjects } from "@/content/projects";
import { profile } from "@/content/profile";
import { useExperience } from "@/state/useExperience";

export function NavHUD() {
  const phase = useExperience((s) => s.phase);
  const activeSlug = useExperience((s) => s.activeSlug);
  const scrollProgress = useExperience((s) => s.scrollProgress);
  const quality = useExperience((s) => s.quality);
  const focusBody = useExperience((s) => s.focusBody);
  const exitFocus = useExperience((s) => s.exitFocus);
  const enterAbout = useExperience((s) => s.enterAbout);
  const setLiteMode = useExperience((s) => s.setLiteMode);

  if (phase === "boot" || phase === "warp") return null;

  const currentIdx = activeSlug
    ? featuredProjects.findIndex((p) => p.slug === activeSlug)
    : -1;

  const stepBody = (dir: -1 | 1) => {
    if (currentIdx === -1) {
      focusBody(featuredProjects[dir === 1 ? 0 : featuredProjects.length - 1].slug);
      return;
    }
    const nextIdx = (currentIdx + dir + featuredProjects.length) % featuredProjects.length;
    focusBody(featuredProjects[nextIdx].slug);
  };

  return (
    <>
      {/* Top Bar */}
      <header className="fixed top-0 inset-x-0 z-30 pointer-events-none px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            onClick={exitFocus}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-[#060a14]/75 backdrop-blur-md border border-white/10 hover:border-amber-400/50 transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
            <span className="font-mono text-xs font-semibold tracking-[0.16em] text-slate-100">
              {profile.monogram}
            </span>
            <span className="hidden sm:inline text-xs text-slate-400 border-l border-white/10 pl-2.5">
              {profile.name} · Galaxy
            </span>
          </button>
        </div>

        <nav className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            id="hud-overview-btn"
            onClick={exitFocus}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider backdrop-blur-md border transition-colors cursor-pointer ${
              phase === "overview"
                ? "bg-slate-100 text-slate-950 border-slate-100 font-semibold"
                : "bg-[#060a14]/75 text-slate-300 border-white/10 hover:border-white/30"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Galaxy</span>
          </button>

          <button
            type="button"
            id="hud-about-btn"
            onClick={enterAbout}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider backdrop-blur-md border transition-colors cursor-pointer ${
              phase === "about"
                ? "bg-amber-500 text-slate-950 border-amber-400 font-semibold"
                : "bg-[#060a14]/75 text-slate-300 border-white/10 hover:border-amber-400/50"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>About</span>
          </button>

          <Link
            href="/lite"
            onClick={() => setLiteMode(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider bg-[#060a14]/75 text-slate-400 hover:text-slate-100 backdrop-blur-md border border-white/10 hover:border-white/30 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">2D Archive</span>
          </Link>

          <span className="hidden lg:inline-flex px-2.5 py-1.5 rounded-md text-[10px] font-mono uppercase tracking-widest text-slate-500 bg-[#060a14]/60 border border-white/5">
            GPU:{quality}
          </span>
        </nav>
      </header>

      {/* Scroll Hint in initial Overview */}
      {phase === "overview" && scrollProgress < 0.05 && (
        <div className="fixed bottom-24 inset-x-0 z-20 pointer-events-none flex justify-center">
          <div className="px-4 py-1.5 rounded-full bg-[#060a14]/70 border border-white/10 backdrop-blur-md font-mono text-[11px] tracking-[0.16em] uppercase text-slate-300">
            Scroll to fly the timeline · Click any planet to dock
          </div>
        </div>
      )}

      {/* Bottom Timeline Orbital Minimap */}
      {phase !== "about" && (
        <footer className="fixed bottom-0 inset-x-0 z-30 pointer-events-none px-4 sm:px-8 py-4 flex items-center justify-center">
          <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg bg-[#060a14]/82 backdrop-blur-md border border-white/10 max-w-full overflow-x-auto">
            <button
              type="button"
              aria-label="Previous system"
              onClick={() => stepBody(-1)}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 sm:gap-1.5">
              {featuredProjects.map((project, idx) => {
                const isSelected = activeSlug === project.slug;
                return (
                  <button
                    key={project.slug}
                    type="button"
                    data-nav-slug={project.slug}
                    onClick={() => focusBody(project.slug)}
                    className={`group flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? "bg-white/12 text-white border border-white/25"
                        : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: project.color,
                        boxShadow: isSelected ? `0 0 8px ${project.color}` : "none",
                      }}
                    />
                    <span className="hidden md:inline">{project.name}</span>
                    <span className="md:hidden">{idx + 1}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              aria-label="Next system"
              onClick={() => stepBody(1)}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      )}
    </>
  );
}
