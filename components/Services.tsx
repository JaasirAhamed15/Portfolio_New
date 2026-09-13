"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ServiceItem } from "@/lib/portfolio-storage";

const useTilt = () => {
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -8;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    setTiltStyle({
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`,
      transition: "transform 0.1s ease",
    });
  };

  const onLeave = () =>
    setTiltStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 0.5s ease",
    });

  return { tiltStyle, onMove, onLeave };
};

const ServiceCard = ({ service, index }: { service: ServiceItem; index: number }) => {
  const { tiltStyle, onMove, onLeave } = useTilt();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: "easeOut" }}
      style={tiltStyle}
      onMouseMove={onMove}
      onMouseLeave={() => { onLeave(); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      className="relative rounded-2xl overflow-hidden border border-gray-700/60
        bg-gray-900/70 backdrop-blur-md shadow-xl cursor-default flex flex-col"
    >
      {/* ── image with overlay ── */}
      <div className="relative h-44 sm:h-52 overflow-hidden flex-shrink-0">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className={`object-cover transition-transform duration-700 ${hovered ? "scale-110" : "scale-100"}`}
          sizes="(max-width: 640px) 100vw, 50vw"
        />
        {/* gradient overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: `linear-gradient(to bottom, transparent 30%, rgba(10,10,20,0.85) 100%)`,
          }}
        />
        {/* tech tag */}
        <span
          className="absolute bottom-3 right-3 text-[10px] sm:text-xs font-bold
            uppercase tracking-widest px-2 py-1 rounded-full border backdrop-blur-sm z-20"
          style={{ color: service.accent, borderColor: `${service.accent}55`, background: `${service.accent}18` }}
        >
          {service.tag}
        </span>
      </div>

      {/* ── content ── */}
      <div className="flex flex-col gap-3 p-5 sm:p-6 flex-grow">
        {/* accent bar + title */}
        <div className="flex items-center gap-3">
          <span
            className="flex-shrink-0 w-1 h-6 rounded-full"
            style={{ background: service.accent }}
          />
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white leading-tight">
            {service.title}
          </h3>
        </div>

        <p className="text-gray-400 text-sm sm:text-base leading-relaxed flex-grow">
          {service.description}
        </p>

        {/* bottom glow line on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl transition-opacity duration-300"
          style={{
            background: `linear-gradient(to right, transparent, ${service.accent}, transparent)`,
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>
    </motion.div>
  );
};

const Services = ({ services = [] }: { services?: ServiceItem[] }) => (
  <section
    id="Services"
    className="relative min-h-screen w-full overflow-hidden
      py-20 sm:py-24
      px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32
      bg-gradient-to-b from-indigo-950 to-black"
  >
    {/* background glow */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(70,86,151,0.14) 0%, transparent 70%)",
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
          My Services
        </h2>
        <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full" />
      </motion.div>

      {/* ── Cards grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {services.map((s, i) => (
          <ServiceCard key={s.title + i} service={s} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default Services;
