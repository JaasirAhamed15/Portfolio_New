import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IoArrowBackOutline,
  IoLogoGithub,
  IoOpenOutline,
  IoSparklesOutline,
  IoLinkOutline,
  IoLayersOutline,
} from "react-icons/io5";
import { getPortfolioData, ProjectItem } from "@/lib/portfolio-storage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPortfolioData();
  const project = data.projects.find((p, idx) => {
    const s =
      p.id ||
      p.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") ||
      `project-${idx + 1}`;
    return s.toLowerCase() === slug.toLowerCase();
  });

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Jaasir Ahamed`,
    description: project.main,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPortfolioData();

  const projectIndex = data.projects.findIndex((p, idx) => {
    const s =
      p.id ||
      p.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") ||
      `project-${idx + 1}`;
    return s.toLowerCase() === slug.toLowerCase();
  });

  if (projectIndex === -1) {
    notFound();
  }

  const project: ProjectItem = data.projects[projectIndex];
  const otherProjects = data.projects
    .filter((_, idx) => idx !== projectIndex)
    .slice(0, 3);

  const fullText = project.fullDescription?.trim() || project.main;
  const paragraphs = fullText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  const githubLink = project.github || (project.demoLabel === "GitHub" ? project.demo : null);
  const liveDemoLink =
    project.demoLabel !== "GitHub" && project.demo
      ? project.demo
      : project.secondaryLink || null;
  const liveDemoLabel =
    project.demoLabel !== "GitHub" && project.demo
      ? project.demoLabel || "Live Demo"
      : project.secondaryLinkLabel || "Live Demo";

  return (
    <div className="min-h-screen bg-[#171d32] text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-5 sm:px-8 py-10 sm:py-14 space-y-10">
        {/* Back Link */}
        <div>
          <Link
            href="/#Projects"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-medium border border-slate-700/60 transition shadow-sm"
          >
            <IoArrowBackOutline size={16} />
            <span>Back to All Projects</span>
          </Link>
        </div>

        {/* Header Hero Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xl sm:text-3xl">{project.emoji || "🚀"}</span>
            <span
              className="text-xs sm:text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border backdrop-blur-sm"
              style={{
                color: project.tagColor || "#3B82F6",
                borderColor: `${project.tagColor || "#3B82F6"}45`,
                background: `${project.tagColor || "#3B82F6"}15`,
              }}
            >
              {project.tag}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            {project.main}
          </p>

          {/* Action Links Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700/80 transition shadow-md hover:scale-105 active:scale-95"
              >
                <IoLogoGithub size={18} />
                <span>GitHub Repository</span>
              </a>
            )}

            {liveDemoLink && (
              <a
                href={liveDemoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition shadow-md hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: project.tagColor || "#4F46E5",
                }}
              >
                <IoOpenOutline size={18} />
                <span>{liveDemoLabel}</span>
              </a>
            )}

            {project.secondaryLink &&
              project.secondaryLink !== githubLink &&
              project.secondaryLink !== liveDemoLink && (
                <a
                  href={project.secondaryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800/60 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 transition hover:scale-105"
                >
                  <IoLinkOutline size={17} />
                  <span>{project.secondaryLinkLabel || "External Link"}</span>
                </a>
              )}
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-video w-full rounded-2xl md:rounded-3xl overflow-hidden bg-slate-950 border border-slate-700/80 shadow-2xl">
          <Image
            src={project.image || "/assets/ecomimg.png"}
            alt={project.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(15,20,34,0.7) 0%, transparent 40%)",
            }}
          />
        </div>

        {/* Detailed Content / Case Study */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          {/* Main Article Body */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm tracking-wider uppercase">
              <IoSparklesOutline size={18} />
              <span>Comprehensive Overview &amp; Implementation</span>
            </div>

            <div className="space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed bg-[#0f1422] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm">
              {paragraphs.length > 0 ? (
                paragraphs.map((para, i) => (
                  <p key={i} className="leading-relaxed whitespace-pre-line text-slate-300">
                    {para}
                  </p>
                ))
              ) : (
                <p className="leading-relaxed text-slate-300">{fullText}</p>
              )}
            </div>
          </div>

          {/* Sidebar Info Card */}
          <div className="space-y-6">
            <div className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <IoLayersOutline className="text-indigo-400" size={17} />
                Project Details
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 block text-xs">Category / Focus</span>
                  <span className="font-semibold text-white mt-0.5 block">{project.tag}</span>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <span className="text-slate-400 block text-xs">Primary Link</span>
                  {project.demo ? (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:underline font-mono text-xs break-all block mt-0.5"
                    >
                      {project.demo}
                    </a>
                  ) : (
                    <span className="text-slate-500 italic block mt-0.5">None provided</span>
                  )}
                </div>

                {project.github && project.github !== project.demo && (
                  <div className="pt-3 border-t border-slate-800">
                    <span className="text-slate-400 block text-xs">Source Code</span>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:underline font-mono text-xs break-all block mt-0.5"
                    >
                      {project.github}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Other Projects Quick Links */}
            {otherProjects.length > 0 && (
              <div className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  More Projects
                </h3>
                <div className="space-y-2.5">
                  {otherProjects.map((op, idx) => {
                    const otherSlug =
                      op.id ||
                      op.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "");
                    return (
                      <Link
                        key={idx}
                        href={`/projects/${otherSlug}`}
                        className="block p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition group"
                      >
                        <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition block truncate">
                          {op.title}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                          {op.tag}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer contact={data.about.contact} />
    </div>
  );
}

