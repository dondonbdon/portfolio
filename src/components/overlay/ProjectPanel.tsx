"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Lock, X } from "lucide-react";
import { featuredProjects, getProjectBySlug } from "@/content/projects";
import { useExperience } from "@/state/useExperience";

export function ProjectPanel() {
  const phase = useExperience((s) => s.phase);
  const activeSlug = useExperience((s) => s.activeSlug);
  const exitFocus = useExperience((s) => s.exitFocus);
  const focusBody = useExperience((s) => s.focusBody);
  const enterAbout = useExperience((s) => s.enterAbout);

  const project = activeSlug ? getProjectBySlug(activeSlug) : undefined;
  const featuredIdx = project
    ? featuredProjects.findIndex((p) => p.slug === project.slug)
    : -1;

  const navigateFeatured = (dir: -1 | 1) => {
    if (featuredIdx === -1) {
      focusBody(featuredProjects[0].slug);
      return;
    }
    const next = (featuredIdx + dir + featuredProjects.length) % featuredProjects.length;
    focusBody(featuredProjects[next].slug);
  };

  return (
    <AnimatePresence>
      {phase === "focus" && project && (
        <motion.aside
          key={project.slug}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-16 right-4 bottom-20 z-30 w-[calc(100%-2rem)] sm:w-[440px] lg:w-[480px] rounded-xl bg-[#060a14]/86 backdrop-blur-xl border border-white/12 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Top accent bar */}
          <div
            className="h-0.5 w-full shrink-0"
            style={{
              background: `linear-gradient(90deg, ${project.color}, ${project.secondaryColor})`,
            }}
          />

          {/* Header */}
          <div className="px-6 pt-5 pb-4 border-b border-white/10 flex items-start justify-between gap-4 shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-slate-400">
                  {project.era}
                </span>
              </div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-50">
                {project.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{project.subtitle}</p>
            </div>

            <button
              type="button"
              id="close-panel-btn"
              onClick={exitFocus}
              aria-label="Return to galaxy overview"
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Hero Visual */}
            {project.media && project.media[0] && (
              <figure className="rounded-lg overflow-hidden border border-white/10 bg-black/50">
                <div className="relative aspect-video w-full">
                  <Image
                    src={project.media[0].src}
                    alt={project.media[0].alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 460px"
                    className="object-cover"
                  />
                </div>
                {project.media[0].caption && (
                  <figcaption className="px-3 py-2 text-[11px] font-mono text-slate-400 border-t border-white/5">
                    {project.media[0].caption}
                  </figcaption>
                )}
              </figure>
            )}

            <p className="text-sm font-medium leading-relaxed text-slate-100">
              {project.tagline}
            </p>

            {/* Story */}
            <div className="space-y-2.5 text-[13px] leading-relaxed text-slate-300">
              {project.story.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>

            {/* Key Engineering Highlights */}
            <div>
              <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-400 mb-2">
                Architecture Highlights
              </h3>
              <ul className="space-y-1.5">
                {project.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-slate-200">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sub-systems / Children (Spotly apps & Origins Belt apps) */}
            {project.children && project.children.length > 0 && (
              <div>
                <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-400 mb-2">
                  Orbiting Modules
                </h3>
                <div className="grid grid-cols-1 gap-1.5">
                  {project.children.map((child) => (
                    <div
                      key={child.slug}
                      className="px-3 py-2 rounded-md bg-white/[0.03] border border-white/8 flex items-center justify-between gap-3"
                    >
                      <span className="text-xs font-semibold text-slate-100 shrink-0">
                        {child.name}
                      </span>
                      <span className="text-[11px] text-slate-400 text-right">
                        {child.tagline}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            <div>
              <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-400 mb-2">
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded text-[11px] font-mono text-slate-200 bg-white/[0.05] border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="px-6 py-3.5 border-t border-white/10 bg-black/30 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              {project.links?.github ? (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 text-slate-950 text-xs font-semibold hover:bg-white transition-colors"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-slate-400">
                  <Lock className="w-3 h-3" />
                  <span>Private Repo</span>
                </span>
              )}

              <Link
                href={`/projects/${project.slug}`}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-mono text-sky-300 hover:text-sky-200 hover:bg-white/5 transition-colors"
              >
                <span>Case Study</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center gap-1">
              {project.slug === "spotly" && (
                <button
                  type="button"
                  onClick={enterAbout}
                  className="px-2.5 py-1.5 mr-1 rounded-md text-[11px] font-mono uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30 transition-colors cursor-pointer"
                >
                  Dive Core →
                </button>
              )}
              <button
                type="button"
                aria-label="Previous project"
                onClick={() => navigateFeatured(-1)}
                className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Next project"
                onClick={() => navigateFeatured(1)}
                className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
