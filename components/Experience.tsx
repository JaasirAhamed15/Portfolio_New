"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoDownloadOutline, IoDocumentTextOutline } from "react-icons/io5";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiNextdotjs } from "react-icons/si";
import { TiTicket } from "react-icons/ti";
import { ExperienceItem, TechIcon } from "@/lib/portfolio-storage";
import DynamicIcon from "@/components/DynamicIcon";

const CertPopup = ({
  cert,
  accent,
  onClose,
}: {
  cert: { image: string; title: string };
  accent: string;
  onClose: () => void;
}) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 32 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-gray-900 rounded-2xl overflow-hidden
          border border-gray-700 shadow-2xl"
        style={{ boxShadow: `0 0 60px ${accent}30` }}
      >
        {/* top accent bar */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(to right, ${accent}, transparent)` }}
        />

        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700/60">
          <div className="flex items-center gap-3">
            <IoDocumentTextOutline size={20} style={{ color: accent }} />
            <h3 className="text-white font-bold text-base sm:text-lg leading-tight">
              {cert.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close certificate dialog"
            className="text-gray-400 hover:text-white p-1 rounded-lg
              hover:bg-gray-700/60 transition-all duration-200 cursor-pointer"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* certificate image */}
        <div className="bg-gray-950 p-4 sm:p-6 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative w-full max-h-[60vh] flex justify-center"
          >
            <Image
              src={cert.image}
              alt={cert.title}
              width={800}
              height={600}
              className="w-full h-auto rounded-xl object-contain shadow-lg"
              style={{ maxHeight: "60vh" }}
            />
          </motion.div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-700/60 bg-gray-900">
          <p className="text-gray-400 text-xs sm:text-sm">
            Click outside or ✕ to close
          </p>
          <a
            href={cert.image}
            download
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white
              px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
            style={{ background: accent }}
          >
            <IoDownloadOutline size={16} />
            Download
          </a>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const ExpCard = ({ exp, index }: { exp: ExperienceItem; index: number }) => {
  const [hovered, setHovered] = useState(false);
  const [showCert, setShowCert] = useState(false);

  return (
    <>
      {showCert && (
        <CertPopup cert={exp.cert} accent={exp.accent} onClose={() => setShowCert(false)} />
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: index * 0.15, ease: "easeOut" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-700/60
          rounded-2xl overflow-hidden shadow-xl transition-shadow duration-300"
        style={{ boxShadow: hovered ? `0 0 32px ${exp.accent}28` : undefined }}
      >
        {/* top accent bar */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(to right, ${exp.accent}, transparent)` }}
        />

        <div className="p-5 sm:p-6 flex flex-col gap-4">
          {/* header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-4 min-w-0">
              {/* initials avatar */}
              <div
                className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl
                  flex items-center justify-center font-extrabold text-sm sm:text-base tracking-wider"
                style={{
                  background: `${exp.accent}22`,
                  border: `1.5px solid ${exp.accent}55`,
                  color: exp.accent,
                }}
              >
                {exp.initials}
              </div>

              <div className="min-w-0">
                <h3 className="text-white font-bold text-base sm:text-lg leading-tight">
                  {exp.role}
                </h3>
                <p className="font-semibold text-sm mt-0.5" style={{ color: exp.accent }}>
                  {exp.company}
                </p>
                <span className="inline-block mt-1 text-[11px] font-semibold tracking-wider uppercase
                  bg-gray-800 text-gray-400 border border-gray-700 px-2 py-0.5 rounded-full">
                  {exp.period}
                </span>
              </div>
            </div>

            {/* ── View Certificate button ── */}
            {exp.cert && exp.cert.image && (
              <button
                onClick={() => setShowCert(true)}
                className="flex-shrink-0 flex items-center gap-1.5
                  text-[11px] sm:text-xs font-bold uppercase tracking-wider
                  px-3 py-2 rounded-xl border transition-all duration-200
                  hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  color: exp.accent,
                  borderColor: `${exp.accent}55`,
                  background: `${exp.accent}12`,
                }}
              >
                <IoDocumentTextOutline size={15} />
                View Certificate
              </button>
            )}
          </div>

          {/* divider */}
          <div className="h-px bg-gray-700/60" />

          {/* bullets */}
          <ul className="flex flex-col gap-2">
            {exp.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: exp.accent }}
                />
                {b}
              </li>
            ))}
          </ul>

          {/* tech chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {exp.techIcons?.map(({ iconType, color, label }: TechIcon) => (
              <span
                key={label}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full
                  border border-gray-700/60 bg-gray-800/50"
                style={{ color }}
              >
                <span className="text-sm">
                  <DynamicIcon name={iconType || label} />
                </span>
                {label}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

const Experience = ({ experiences = [] }: { experiences?: ExperienceItem[] }) => (
  <section
    id="Experience"
    className="relative min-h-screen w-full overflow-hidden
      py-20 sm:py-24
      px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32
      bg-gradient-to-b from-gray-800 to-gray-900"
  >
    {/* bg glow */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(70,86,151,0.13) 0%, transparent 70%)",
      }}
    />

    <div className="max-w-5xl mx-auto">
      {/* heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 sm:mb-14"
      >
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
          Experience
        </h2>
        <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full" />
      </motion.div>

      {/* cards */}
      <div className="flex flex-col gap-6 sm:gap-8">
        {experiences.map((exp, i) => (
          <ExpCard key={exp.company + i} exp={exp} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default Experience;
