"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SkillItem, EducationItem } from "@/lib/portfolio-storage";
import DynamicIcon from "./DynamicIcon";

const useTilt = () => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -10;
    const rotateY = ((x - cx) / cx) * 10;
    setStyle({
      transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.06)`,
      transition: "transform 0.1s ease",
    });
  };

  const onLeave = () =>
    setStyle({
      transform: "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 0.4s ease",
    });

  return { style, onMove, onLeave };
};

const SkillCard = ({ skill, index }: { skill: SkillItem; index: number }) => {
  const { style, onMove, onLeave } = useTilt();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative flex flex-col items-center justify-center gap-2
        bg-gray-900/60 backdrop-blur-sm border border-gray-700/60
        rounded-2xl p-4 sm:p-5 cursor-default overflow-hidden"
    >
      {/* glow behind icon */}
      <div
        className="absolute inset-0 opacity-10 group-hover:opacity-30 rounded-2xl transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at center, ${skill.color}, transparent 50%)` }}
      />
      <div className="text-4xl sm:text-5xl relative z-10 flex items-center justify-center" style={{ color: skill.color }}>
        <DynamicIcon name={skill.iconType || skill.name} />
      </div>
      <span className="text-white text-xs sm:text-sm font-semibold relative z-10 text-center">
        {skill.name}
      </span>
    </motion.div>
  );
};

const EduCard = ({ edu, index }: { edu: EducationItem; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative flex items-start gap-4 sm:gap-5
        bg-gray-900/50 backdrop-blur-sm border border-gray-700/50
        rounded-2xl p-5 sm:p-6
        hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-900/20
        transition-all duration-400 group overflow-hidden"
    >
      {/* left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: edu.iconColor }}
      />

      {/* icon */}
      <div
        className="flex-shrink-0 text-4xl sm:text-5xl mt-0.5"
        style={{ color: edu.iconColor }}
      >
        <DynamicIcon name={edu.iconType || "FaGraduationCap"} />
      </div>

      {/* text */}
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
            {edu.institution}
          </h3>
          {edu.current && (
            <span className="text-[10px] font-bold uppercase tracking-wider
              bg-blue-500/20 text-blue-400 border border-blue-500/40
              px-2 py-0.5 rounded-full">
              Current
            </span>
          )}
        </div>
        <p className="text-blue-400 text-sm font-semibold">{edu.period}</p>
        <p className="text-gray-400 text-sm">{edu.details}</p>
      </div>
    </motion.div>
  );
};

const Skills = ({
  skills = [],
  education = [],
}: {
  skills?: SkillItem[];
  education?: EducationItem[];
}) => (
  <section
    id="Skills"
    className="relative min-h-screen w-full overflow-hidden
      py-20 sm:py-24
      px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32"
  >
    {/* background glow */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(70,86,151,0.13) 0%, transparent 70%)",
      }}
    />

    <div className="max-w-7xl mx-auto">
      {/* ── Section heading ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14 sm:mb-16"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
          Skills &amp; Education
        </h2>
        <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full" />
      </motion.div>

      {/* ── Two-column layout ── */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Skills grid */}
        <div className="w-full lg:w-1/2">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xl sm:text-2xl font-bold text-white mb-6 text-center lg:text-left
              flex items-center gap-3 justify-center lg:justify-start"
          >
            <span className="inline-block w-6 h-0.5 bg-blue-500 rounded" />
            Technical Skills
            <span className="inline-block w-6 h-0.5 bg-blue-500 rounded" />
          </motion.h3>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
            {skills.map((skill, i) => (
              <SkillCard key={skill.name + i} skill={skill} index={i} />
            ))}
          </div>
        </div>

        {/* Education timeline */}
        <div className="w-full lg:w-1/2">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xl sm:text-2xl font-bold text-white mb-6 text-center lg:text-left
              flex items-center gap-3 justify-center lg:justify-start"
          >
            <span className="inline-block w-6 h-0.5 bg-blue-500 rounded" />
            Education
            <span className="inline-block w-6 h-0.5 bg-blue-500 rounded" />
          </motion.h3>

          <div className="flex flex-col gap-5">
            {education.map((edu, i) => (
              <EduCard key={edu.institution + i} edu={edu} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Skills;
