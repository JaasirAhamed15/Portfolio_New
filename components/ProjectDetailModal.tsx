"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCloseOutline,
  IoLogoGithub,
  IoOpenOutline,
  IoLinkOutline,
  IoSparklesOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import { ProjectItem } from "@/lib/portfolio-storage";

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const fullText = project.fullDescription?.trim() || project.main;
  const githubLink = project.github || (project.demoLabel === "GitHub" ? project.demo : null);
  const liveDemoLink =
    project.demoLabel !== "GitHub" && project.demo
      ? project.demo
      : project.secondaryLink || null;
  const liveDemoLabel =
    project.demoLabel !== "GitHub" && project.demo
      ? project.demoLabel || "Live Demo"
      : project.secondaryLinkLabel || "Live Demo";

  // Split description paragraphs if user provided multiple line breaks
  const paragraphs = fullText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl md:rounded-3xl overflow-hidden
            bg-[#0f1422] border border-slate-700/80 shadow-2xl z-10"
        >
          {/* Top Sticky Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-5 sm:px-7 py-3.5 sm:py-4 bg-[#0a0e18]/95 backdrop-blur-md border-b border-slate-800">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-4">
              <span className="text-xl sm:text-2xl flex-shrink-0">{project.emoji || "🚀"}</span>
              <div className="min-w-0">
                <span
                  className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-0.5"
                  style={{
                    color: project.tagColor || "#3B82F6",
                    borderColor: `${project.tagColor || "#3B82F6"}40`,
                    background: `${project.tagColor || "#3B82F6"}15`,
                  }}
                >
                  {project.tag}
                </span>
                <h2
                  id="project-modal-title"
                  className="text-base sm:text-lg md:text-xl font-extrabold text-white truncate"
                >
                  {project.title}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition cursor-pointer border border-slate-700/60 flex-shrink-0"
              aria-label="Close dialog"
            >
              <IoCloseOutline size={22} />
            </button>
          </div>

          {/* Scrollable Body Content */}
          <div className="overflow-y-auto p-5 sm:p-7 md:p-8 space-y-6 flex-1">
            {/* Project Hero Image */}
            <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
              <Image
                src={project.image || "/assets/ecomimg.png"}
                alt={project.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 768px"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,14,24,0.7) 0%, transparent 60%)",
                }}
              />
            </div>

            {/* Overview & Badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">
                <IoSparklesOutline size={16} />
                <span>Project Deep Dive &amp; Architecture</span>
              </div>

              {/* Full Description / Case study */}
              <div className="space-y-3 text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                {paragraphs.length > 0 ? (
                  paragraphs.map((p, idx) => (
                    <p key={idx} className="leading-relaxed whitespace-pre-line text-slate-300/95">
                      {p}
                    </p>
                  ))
                ) : (
                  <p className="leading-relaxed text-slate-300">{fullText}</p>
                )}
              </div>
            </div>

            {/* Quick Summary Pill Highlight */}
            {project.main && project.main !== fullText && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#131b2e] border border-indigo-500/20 text-xs sm:text-sm text-slate-300">
                <span className="font-semibold text-indigo-300 block mb-1">
                  Card Overview Summary:
                </span>
                <p className="italic text-slate-400">{project.main}</p>
              </div>
            )}
          </div>

          {/* Bottom Action Links Footer */}
          <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 py-3.5 sm:py-4 bg-[#0a0e18]/95 backdrop-blur-md border-t border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              {/* GitHub Repo Link */}
              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold
                    bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700/80 transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  <IoLogoGithub size={16} className="text-white" />
                  <span>GitHub Repository</span>
                </a>
              )}

              {/* Live Demo or External Website */}
              {liveDemoLink && (
                <a
                  href={liveDemoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-md"
                  style={{
                    backgroundColor: project.tagColor || "#4F46E5",
                  }}
                >
                  <IoOpenOutline size={16} />
                  <span>{liveDemoLabel}</span>
                  <IoChevronForwardOutline size={14} />
                </a>
              )}

              {/* Secondary Link if present and not already shown */}
              {project.secondaryLink &&
                project.secondaryLink !== githubLink &&
                project.secondaryLink !== liveDemoLink && (
                  <a
                    href={project.secondaryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
                      bg-slate-800/70 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 transition-all hover:scale-105 active:scale-95"
                  >
                    <IoLinkOutline size={15} />
                    <span>{project.secondaryLinkLabel || "Explore Link"}</span>
                  </a>
                )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

