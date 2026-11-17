"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Lock, Mail, Orbit, Sparkles } from "lucide-react";
import { archiveProjects, featuredProjects } from "@/content/projects";
import { profile } from "@/content/profile";

interface LiteSiteProps {
  onSwitchTo3D?: () => void;
  reason?: string;
}

export function LiteSite({ onSwitchTo3D, reason }: LiteSiteProps) {
  return (
    <div className="min-h-screen bg-[#03050a] text-slate-100 relative overflow-x-hidden">
      {/* CSS Ambient Starfield */}
      <div className="lite-starfield pointer-events-none fixed inset-0 z-0" aria-hidden="true" />

      {/* Top Nav */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#03050a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b]" />
            <span className="font-mono text-xs font-semibold tracking-[0.2em] uppercase">
              {profile.monogram} · {profile.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onSwitchTo3D ? (
              <button
                type="button"
                onClick={onSwitchTo3D}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Orbit className="w-3.5 h-3.5" />
                <span>Launch 3D Galaxy</span>
              </button>
            ) : (
              <Link
                href="/?3d=1"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors"
              >
                <Orbit className="w-3.5 h-3.5" />
                <span>Launch 3D Galaxy</span>
              </Link>
            )}
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-200 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16 space-y-24">
        {/* Hero */}
        <section className="max-w-3xl space-y-6">
          <p className="font-mono text-xs tracking-[0.24em] uppercase text-amber-400">
            {profile.handle} · {profile.title}
            {reason && reason !== "query-lite" ? ` · 2D Mode (${reason})` : ""}
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-[-0.03em] leading-[1.06] text-slate-50">
            Engineering ecosystems from bare-metal silicon to multi-country super-apps.
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-slate-300">
            {profile.tagline}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {profile.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-slate-100 text-slate-950 text-sm font-semibold hover:bg-white transition-colors"
              >
                <span>{s.label}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            ))}
          </div>
        </section>

        {/* Featured Systems (Reversed so Spotly Core leads) */}
        <section className="space-y-8">
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-sky-400">
                Primary Systems (2023 → 2026)
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
                Featured Celestial Systems
              </h2>
            </div>
            <span className="font-mono text-xs text-slate-500">
              {featuredProjects.length} Systems
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...featuredProjects].reverse().map((project, idx) => (
              <motion.article
                key={project.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className={`group rounded-xl bg-[#070b14]/90 border border-white/10 overflow-hidden flex flex-col justify-between transition-colors hover:border-white/25 ${
                  project.slug === "spotly" ? "md:col-span-2" : ""
                }`}
              >
                <div>
                  {project.media && project.media[0] && (
                    <div
                      className={`relative w-full overflow-hidden border-b border-white/10 ${
                        project.slug === "spotly" ? "aspect-[21/9]" : "aspect-video"
                      }`}
                    >
                      <Image
                        src={project.media[0].src}
                        alt={project.media[0].alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 640px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-slate-400">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        {project.era}
                      </span>
                      {project.visibility === "private" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500">
                          <Lock className="w-3 h-3" /> Private
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-slate-50">
                        {project.name}
                      </h3>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">{project.subtitle}</p>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-300">{project.tagline}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-[11px] font-mono text-slate-300 bg-white/[0.04] border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-white/8 flex items-center justify-between">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Read Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  {project.links?.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors"
                    >
                      <span>GitHub</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Archive Constellation */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-emerald-400">
                Outer Halo Constellation
              </p>
              <h2 className="font-display text-2xl font-semibold tracking-tight mt-1">
                Archive & Open-Source Repositories
              </h2>
            </div>
            <span className="font-mono text-xs text-slate-500">
              {archiveProjects.length} Stars
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {archiveProjects.map((item) => (
              <div
                key={item.slug}
                className="rounded-lg bg-[#070b14]/80 border border-white/10 p-5 flex flex-col justify-between gap-4 hover:border-white/20 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>✦ {item.year}</span>
                    <span>{item.visibility.toUpperCase()}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-slate-100">
                    {item.name}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-300">{item.tagline}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/8">
                  <Link
                    href={`/projects/${item.slug}`}
                    className="text-xs font-mono text-sky-300 hover:text-sky-200"
                  >
                    Details →
                  </Link>
                  {item.links?.github && (
                    <a
                      href={item.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white"
                    >
                      <span>Repo</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bio & Contact */}
        <section className="rounded-xl bg-[#070b14]/90 border border-white/10 p-8 space-y-6">
          <h2 className="font-display text-2xl font-semibold">About {profile.name}</h2>
          <div className="space-y-3 text-sm leading-relaxed text-slate-300 max-w-3xl">
            {profile.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {profile.skills.map((g) => (
              <div key={g.group} className="space-y-2">
                <h3 className="font-mono text-xs uppercase tracking-wider text-amber-400">
                  {g.group}
                </h3>
                <p className="text-xs font-mono text-slate-400 leading-relaxed">
                  {g.items.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
