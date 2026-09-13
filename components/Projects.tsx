"use client";

import React from "react";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { ProjectItem } from "@/lib/portfolio-storage";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const Projects = ({ projects = [] }: { projects?: ProjectItem[] }) => (
  <section
    id="Projects"
    className="relative min-h-screen w-full overflow-hidden
      py-20 sm:py-24
      px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32"
  >
    {/* bg glow */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(70,86,151,0.13) 0%, transparent 70%)",
      }}
    />

    <div className="max-w-7xl mx-auto">
      {/* heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14 sm:mb-16"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
          Projects
        </h2>
        <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
          A collection of things I&apos;ve built — from web apps to robots.
        </p>
        <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full mt-4" />
      </motion.div>

      {/* grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {projects.map((p, i) => (
          <ProjectCard key={(p.id || p.title) + i} project={p} index={i} />
        ))}
      </motion.div>
    </div>
  </section>
);

export default Projects;
