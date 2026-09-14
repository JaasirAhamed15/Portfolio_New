"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { IoOpenOutline, IoCodeSlashOutline } from "react-icons/io5";
import { CustomSection } from "@/lib/portfolio-types";

interface CustomSectionRendererProps {
  section: CustomSection;
}

export default function CustomSectionRenderer({ section }: CustomSectionRendererProps) {
  if (!section || !section.enabled) return null;

  const layout = section.layout || "cards-grid";

  return (
    <section
      id={section.id}
      className="relative min-h-[50vh] w-full overflow-hidden
        py-20 sm:py-24
        px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32
        transition-colors"
    >
      {/* Background ambient radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(59,130,246,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white inline-block border-b-2 border-blue-500 pb-2">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
              {section.subtitle}
            </p>
          )}
        </motion.div>

        {/* Empty State */}
        {(!section.items || section.items.length === 0) && (
          <div className="text-center py-12 text-gray-500 text-sm">
            No items in this section yet. Add items from the Admin Panel.
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            LAYOUT 1: 3-COLUMN CARDS GRID (Modern Project / Product Cards)
           ════════════════════════════════════════════════════════════ */}
        {layout === "cards-grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {section.items?.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative bg-gray-900/60 backdrop-blur-md border border-gray-800 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  {item.image && (
                    <div className="relative h-48 w-full bg-gray-950 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.tag && (
                        <span
                          className="absolute bottom-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md"
                          style={{
                            color: item.tagColor || "#3B82F6",
                            borderColor: `${item.tagColor || "#3B82F6"}55`,
                            background: `${item.tagColor || "#3B82F6"}20`,
                          }}
                        >
                          {item.tag}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    {!item.image && item.tag && (
                      <span
                        className="inline-block mb-3 text-xs font-semibold px-2.5 py-1 rounded-full border"
                        style={{
                          color: item.tagColor || "#3B82F6",
                          borderColor: `${item.tagColor || "#3B82F6"}55`,
                          background: `${item.tagColor || "#3B82F6"}20`,
                        }}
                      >
                        {item.tag}
                      </span>
                    )}

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>
                </div>

                {(item.link || item.secondaryLink) && (
                  <div className="p-6 pt-0 flex flex-wrap gap-3 mt-4 border-t border-gray-800/60 pt-4">
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all hover:scale-105"
                      >
                        <IoOpenOutline size={14} />
                        {item.linkLabel || "View Demo"}
                      </a>
                    )}
                    {item.secondaryLink && (
                      <a
                        href={item.secondaryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-xl border border-gray-700 transition-all hover:scale-105"
                      >
                        <IoCodeSlashOutline size={14} />
                        {item.secondaryLinkLabel || "Source Code"}
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            LAYOUT 2: FEATURED SPLIT (Alternating Zigzag Showcase)
           ════════════════════════════════════════════════════════════ */}
        {layout === "featured-split" && (
          <div className="space-y-12 sm:space-y-16">
            {section.items?.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`bg-gray-900/60 backdrop-blur-md border border-gray-800 hover:border-blue-500/40 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-8 items-center transition-all duration-300`}
                >
                  {/* Media visual column */}
                  {item.image ? (
                    <div className="w-full lg:w-1/2 relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-gray-950 border border-gray-800 flex-shrink-0 group">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  ) : (
                    <div className="w-full lg:w-1/2 h-48 rounded-2xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-gray-800 flex items-center justify-center text-blue-400 font-mono text-sm">
                      {item.tag || "Featured Highlight"}
                    </div>
                  )}

                  {/* Content details column */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-4">
                    <div>
                      {item.tag && (
                        <span
                          className="inline-block text-xs font-bold px-3 py-1 rounded-full border mb-3"
                          style={{
                            color: item.tagColor || "#3B82F6",
                            borderColor: `${item.tagColor || "#3B82F6"}60`,
                            background: `${item.tagColor || "#3B82F6"}18`,
                          }}
                        >
                          {item.tag}
                        </span>
                      )}
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                        {item.description}
                      </p>
                    </div>

                    {(item.link || item.secondaryLink) && (
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-800/80">
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition hover:scale-105"
                          >
                            <IoOpenOutline size={16} />
                            {item.linkLabel || "Live Project"}
                          </a>
                        )}
                        {item.secondaryLink && (
                          <a
                            href={item.secondaryLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-semibold rounded-xl border border-gray-700 transition hover:scale-105"
                          >
                            <IoCodeSlashOutline size={16} />
                            {item.secondaryLinkLabel || "Source Code"}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            LAYOUT 3: VERTICAL TIMELINE / ROADMAP
           ════════════════════════════════════════════════════════════ */}
        {layout === "timeline" && (
          <div className="relative border-l-2 border-blue-500/30 ml-4 sm:ml-8 md:ml-12 pl-6 sm:pl-10 space-y-12">
            {section.items?.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative group"
              >
                {/* Timeline node icon */}
                <div
                  className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full border-4 border-[#090D16] bg-blue-500 group-hover:scale-125 transition-transform duration-300 shadow-md shadow-blue-500/50"
                  style={{ backgroundColor: item.tagColor || "#3B82F6" }}
                />

                <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 hover:border-blue-500/50 rounded-2xl p-6 shadow-xl transition-all hover:-translate-y-1">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    {item.tag && (
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full border"
                        style={{
                          color: item.tagColor || "#3B82F6",
                          borderColor: `${item.tagColor || "#3B82F6"}40`,
                          background: `${item.tagColor || "#3B82F6"}18`,
                        }}
                      >
                        {item.tag}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-line">
                    {item.description}
                  </p>

                  {item.image && (
                    <div className="relative h-44 sm:h-56 w-full bg-gray-950 rounded-xl overflow-hidden mb-4 border border-gray-800">
                      <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                    </div>
                  )}

                  {(item.link || item.secondaryLink) && (
                    <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-800/60">
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition hover:scale-105"
                        >
                          <IoOpenOutline size={14} />
                          {item.linkLabel || "View Link"}
                        </a>
                      )}
                      {item.secondaryLink && (
                        <a
                          href={item.secondaryLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-xl border border-gray-700 transition hover:scale-105"
                        >
                          <IoCodeSlashOutline size={14} />
                          {item.secondaryLinkLabel || "Details"}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            LAYOUT 4: COMPACT HORIZONTAL LIST (Articles, Reviews & Services)
           ════════════════════════════════════════════════════════════ */}
        {layout === "compact-list" && (
          <div className="space-y-4">
            {section.items?.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="group bg-gray-900/60 backdrop-blur-md border border-gray-800 hover:border-blue-500/50 rounded-2xl p-5 sm:p-6 shadow-lg transition-all duration-300 hover:bg-gray-900/90 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="flex items-start gap-4 flex-1">
                  {item.image && (
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-950 flex-shrink-0 border border-gray-800">
                      <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 64px, 80px" className="object-cover" />
                    </div>
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      {item.tag && (
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                          style={{
                            color: item.tagColor || "#3B82F6",
                            borderColor: `${item.tagColor || "#3B82F6"}40`,
                            background: `${item.tagColor || "#3B82F6"}18`,
                          }}
                        >
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {(item.link || item.secondaryLink) && (
                  <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-gray-800">
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition hover:scale-105"
                      >
                        <IoOpenOutline size={14} />
                        {item.linkLabel || "Open"}
                      </a>
                    )}
                    {item.secondaryLink && (
                      <a
                        href={item.secondaryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-xl border border-gray-700 transition hover:scale-105"
                      >
                        <IoCodeSlashOutline size={14} />
                        {item.secondaryLinkLabel || "Code"}
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
