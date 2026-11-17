"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Check, Compass, Copy, Mail, MapPin } from "lucide-react";
import { profile } from "@/content/profile";
import { useExperience } from "@/state/useExperience";

export function AboutOverlay() {
  const phase = useExperience((s) => s.phase);
  const exitFocus = useExperience((s) => s.exitFocus);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failures in restricted browsers
    }
  };

  return (
    <AnimatePresence>
      {phase === "about" && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-30 flex items-center justify-center px-4 py-20 overflow-y-auto"
        >
          <div className="w-full max-w-3xl rounded-2xl bg-[#060a14]/86 backdrop-blur-xl border border-amber-400/20 p-6 sm:p-10 shadow-2xl space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <p className="font-mono text-xs tracking-[0.22em] uppercase text-amber-400 mb-2">
                  Galactic Core · Engineer Profile
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-50">
                  {profile.name} <span className="text-slate-400 font-normal">({profile.handle})</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-300 mt-1">{profile.title}</p>
              </div>

              <button
                type="button"
                onClick={exitFocus}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/10 hover:bg-white/15 text-xs font-mono uppercase tracking-wider text-slate-100 transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Return to Orbit</span>
              </button>
            </div>

            <div className="space-y-3 text-sm sm:text-base leading-relaxed text-slate-300">
              {profile.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {/* Skill Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {profile.skills.map((group) => (
                <div
                  key={group.group}
                  className="rounded-lg bg-white/[0.03] border border-white/10 p-4"
                >
                  <h3 className="font-mono text-[11px] tracking-[0.16em] uppercase text-amber-300 mb-3">
                    {group.group}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded text-xs font-mono text-slate-200 bg-white/5 border border-white/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{profile.location}</span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400">{profile.availability}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-slate-200 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied Email" : profile.email}</span>
                </button>

                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact</span>
                </a>

                {profile.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-md bg-slate-100 hover:bg-white text-slate-950 text-xs font-semibold transition-colors"
                  >
                    <span>{social.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
