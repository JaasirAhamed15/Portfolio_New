"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { IoOpenOutline, IoLogoGithub } from "react-icons/io5";
import { ProjectItem } from "@/lib/portfolio-storage";

const useTilt = () => {
  const [s, setS] = useState<React.CSSProperties>({});
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -7;
    const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 7;
    setS({
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`,
      transition: "transform 0.1s ease",
    });
  };
  const onLeave = () =>
    setS({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 0.5s ease",
    });
  return { tiltStyle: s, onMove, onLeave };
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const ProjectCard = ({ project }: { project: ProjectItem; index: number }) => {
  const { tiltStyle, onMove, onLeave } = useTilt();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      onMouseMove={onMove}
      onMouseLeave={() => {
        onLeave();
        setHovered(false);
      }}
      onMouseEnter={() => setHovered(true)}
      className="group relative flex flex-col h-full rounded-2xl overflow-hidden
        border border-gray-700/50 bg-gray-900/70 backdrop-blur-sm
        shadow-xl cursor-default"
      style={{
        ...tiltStyle,
        boxShadow: hovered ? `0 0 32px ${project.tagColor}25` : undefined,
      }}
    >
      {/* ── image ── */}
      <div className="relative h-44 sm:h-48 overflow-hidden flex-shrink-0 bg-gray-950">
        <Image
          src={project.image || "/assets/ecomimg.png"}
          alt={project.title}
          fill
          className={`object-cover transition-transform duration-700 ${
            hovered ? "scale-110" : "scale-100"
          }`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* gradient overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, transparent 35%, rgba(10,10,20,0.90) 100%)",
          }}
        />

        {/* tech tag */}
        <span
          className="absolute bottom-3 right-3 text-[10px] sm:text-xs font-bold
            uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-sm z-20"
          style={{
            color: project.tagColor,
            borderColor: `${project.tagColor}55`,
            background: `${project.tagColor}18`,
          }}
        >
          {project.tag}
        </span>
      </div>

      {/* ── content ── */}
      <div className="flex flex-col flex-grow p-5 gap-3">
        {/* accent line + title */}
        <div className="flex items-center gap-2">
          <span
            className="flex-shrink-0 w-1 h-5 rounded-full"
            style={{ background: project.tagColor }}
          />
          <h3 className="text-white font-bold text-base sm:text-lg leading-tight">
            {project.title}
          </h3>
        </div>

        {/* description */}
        <p className="text-gray-400 text-sm leading-relaxed flex-grow">
          {project.main}
        </p>

        {/* divider */}
        <div className="h-px bg-gray-700/50" />

        {/* footer */}
        <div className="flex items-center justify-between">
          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs font-semibold
                px-3 py-2 rounded-xl border transition-all duration-200
                hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                color: project.tagColor,
                borderColor: `${project.tagColor}55`,
                background: `${project.tagColor}15`,
              }}
            >
              {project.demoLabel === "GitHub" ? (
                <IoLogoGithub size={14} />
              ) : (
                <IoOpenOutline size={14} />
              )}
              {project.demoLabel || "Link"}
            </a>
          ) : (
            <span className="text-[11px] text-gray-500 italic">No demo yet</span>
          )}

          {/* hover glow bottom line */}
          <div
            className="h-0.5 w-8 rounded-full transition-all duration-300"
            style={{
              background: `linear-gradient(to right, ${project.tagColor}, transparent)`,
              opacity: hovered ? 1 : 0,
              width: hovered ? "3rem" : "0",
            }}
          />
        </div>
      </div>

      {/* bottom glow on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl transition-opacity duration-300"
        style={{
          background: `linear-gradient(to right, transparent, ${project.tagColor}, transparent)`,
          opacity: hovered ? 1 : 0,
        }}
      />
    </motion.div>
  );
};

export default ProjectCard;
