"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoOpenOutline } from "react-icons/io5";
import {
  SiLeetcode,
  SiHackerrank,
  SiCodechef,
  SiGeeksforgeeks,
} from "react-icons/si";

interface Platform {
  name: string;
  handle: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  desc: string;
}

const platforms: Platform[] = [
  {
    name: "LeetCode",
    handle: "@Jaasirahamed15",
    url: "https://leetcode.com/Jaasirahamed15/",
    icon: <SiLeetcode />,
    color: "#FFA116",
    bg: "#FFA11618",
    border: "#FFA11640",
    desc: "Data structures & algorithms practice",
  },
  {
    name: "HackerRank",
    handle: "@Jaasirahamed15",
    url: "https://www.hackerrank.com/profile/Jaasirahamed15",
    icon: <SiHackerrank />,
    color: "#00EA64",
    bg: "#00EA6418",
    border: "#00EA6440",
    desc: "Problem solving & skill certifications",
  },
  {
    name: "CodeChef",
    handle: "@jaasir15",
    url: "https://www.codechef.com/users/jaasir15",
    icon: <SiCodechef />,
    color: "#C0C0C0",
    bg: "#96775518",
    border: "#96775540",
    desc: "Competitive programming contests",
  },
  {
    name: "GeeksforGeeks",
    handle: "@jaasirahamed15",
    url: "https://www.geeksforgeeks.org/user/jaasirahamed15/",
    icon: <SiGeeksforgeeks />,
    color: "#2F8D46",
    bg: "#2F8D4618",
    border: "#2F8D4640",
    desc: "DSA articles, interview prep & practice",
  },
];

const PlatformCard = ({
  name,
  handle,
  url,
  icon,
  color,
  bg,
  border,
  desc,
  index,
}: Platform & { index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      onMouseLeave={() => setHovered(false)}
      onMouseEnter={() => setHovered(true)}
      className="relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl border
        backdrop-blur-sm transition-colors duration-300 group overflow-hidden cursor-pointer"
      style={{ background: bg, borderColor: hovered ? color + "80" : border }}
    >
      {/* icon */}
      <div
        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
          text-2xl transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${color}20`, color }}
      >
        {icon}
      </div>

      {/* text */}
      <div className="flex-grow min-w-0">
        <p className="text-white font-bold text-sm sm:text-base leading-tight">{name}</p>
        <p className="text-xs font-medium mt-0.5" style={{ color }}>{handle}</p>
        <p className="text-gray-400 text-xs mt-1 leading-snug truncate">{desc}</p>
      </div>

      {/* arrow */}
      <IoOpenOutline
        size={16}
        className="flex-shrink-0 text-gray-500 group-hover:text-white
          transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />

      {/* bottom glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to right, transparent, ${color}, transparent)`,
          opacity: hovered ? 1 : 0,
        }}
      />
    </motion.a>
  );
};

const Leetcode = () => (
  <section
    id="Coding"
    className="relative min-h-screen w-full overflow-hidden
      py-20 sm:py-24
      px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32
      bg-gradient-to-b from-green-900 to-gray-900"
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

    <div className="max-w-6xl mx-auto">
      {/* ── Section heading ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14 sm:mb-16"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
          Coding Profiles
        </h2>
        <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full" />
      </motion.div>

      {/* ── Two column layout ── */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
        {/* Left — LeetCode stats card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-block w-6 h-0.5 bg-blue-500 rounded" />
            <h3 className="text-lg sm:text-xl font-bold text-white">LeetCode Stats</h3>
            <span className="inline-block w-6 h-0.5 bg-blue-500 rounded" />
          </div>

          <div
            className="rounded-2xl overflow-hidden border border-gray-700/50
              bg-gray-900/60 backdrop-blur-sm p-4 shadow-xl
              hover:border-[#FFA116]/40 hover:shadow-[0_0_32px_#FFA11625]
              transition-all duration-400"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://leetcard.jacoblin.cool/Jaasirahamed15?theme=dark&font=Andada%20Pro&ext=heatmap"
              alt="LeetCode Stats"
              className="w-full h-auto rounded-xl"
              loading="lazy"
            />
            {/* LeetCode label */}
            <div className="flex items-center justify-between mt-4 px-1">
              <div className="flex items-center gap-2">
                <SiLeetcode className="text-[#FFA116] text-lg" />
                <span className="text-white font-semibold text-sm">Jaasirahamed15</span>
              </div>
              <a
                href="https://leetcode.com/Jaasirahamed15/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-semibold text-[#FFA116]
                  hover:underline transition-colors duration-200"
              >
                View Profile <IoOpenOutline size={12} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right — Platform links */}
        <div className="w-full lg:w-1/2">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-block w-6 h-0.5 bg-blue-500 rounded" />
            <h3 className="text-lg sm:text-xl font-bold text-white">My Profiles</h3>
            <span className="inline-block w-6 h-0.5 bg-blue-500 rounded" />
          </div>

          <div className="flex flex-col gap-4">
            {platforms.map((p, i) => (
              <PlatformCard key={p.name} {...p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Leetcode;

