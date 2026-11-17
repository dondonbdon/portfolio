import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Lock, Orbit } from "lucide-react";
import { allProjects, getProjectBySlug } from "@/content/projects";
import { profile } from "@/content/profile";

export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.name} — ${profile.name} (${profile.handle})`,
    description: project.tagline,
    openGraph: {
      title: `${project.name} — ${project.subtitle}`,
      description: project.tagline,
      images: project.media?.[0]?.src ? [project.media[0].src] : undefined,
    },
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[#03050a] text-slate-100">
      <header className="border-b border-white/10 bg-[#03050a]/85 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/lite"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Archive</span>
          </Link>

          <Link
            href="/?3d=1"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors"
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>View in 3D Galaxy</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-slate-400">
              {project.era}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-slate-50">
            {project.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {project.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.links?.github ? (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-slate-100 text-slate-950 text-xs font-semibold hover:bg-white transition-colors"
              >
                <span>Open GitHub Repository</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-slate-400">
                <Lock className="w-3.5 h-3.5" />
                <span>Private Repository</span>
              </span>
            )}
          </div>
        </div>

        {project.media && project.media[0] && (
          <figure className="rounded-xl overflow-hidden border border-white/10 bg-black/50">
            <div className="relative aspect-video w-full">
              <Image
                src={project.media[0].src}
                alt={project.media[0].alt}
                fill
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
                priority
              />
            </div>
            {project.media[0].caption && (
              <figcaption className="px-4 py-2.5 text-xs font-mono text-slate-400 border-t border-white/10">
                {project.media[0].caption}
              </figcaption>
            )}
          </figure>
        )}

        <section className="space-y-4">
          <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-slate-400">
            Engineering Story
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-200">
            {project.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
          <div className="space-y-3">
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-slate-400">
              Key Highlights
            </h2>
            <ul className="space-y-2">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-slate-400">
              Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded text-xs font-mono text-slate-200 bg-white/[0.04] border border-white/10"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {project.children && project.children.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-white/10">
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-slate-400">
              Orbiting Sub-Modules
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.children.map((child) => (
                <div
                  key={child.slug}
                  className="rounded-lg bg-white/[0.03] border border-white/10 p-4 space-y-1"
                >
                  <div className="font-semibold text-sm text-slate-100">{child.name}</div>
                  <div className="text-xs text-slate-400">{child.tagline}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
