"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { CertificateItem } from "@/lib/portfolio-storage";

const AUTO_MS = 3500;

const wrap = (i: number, len: number) => {
  if (len === 0) return 0;
  return ((i % len) + len) % len;
};

const useTilt = () => {
  const [s, setS] = useState<React.CSSProperties>({});
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -8;
    const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 8;
    setS({
      transform: `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`,
      transition: "transform 0.1s ease",
    });
  };
  const onLeave = () =>
    setS({
      transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 0.5s ease",
    });
  return { tiltStyle: s, onMove, onLeave };
};

const CertCard = ({
  cert,
  isCenter,
  onClick,
}: {
  cert: CertificateItem;
  isCenter: boolean;
  onClick: () => void;
}) => {
  const { tiltStyle, onMove, onLeave } = useTilt();

  return (
    <motion.div
      layout
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={tiltStyle}
      className={`
        relative flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden
        border transition-all duration-500
        ${
          isCenter
            ? "border-blue-500/60 shadow-2xl shadow-blue-900/40 z-10"
            : "border-gray-700/40 shadow-lg opacity-60 hover:opacity-80"
        }
      `}
    >
      {/* image */}
      <div className="bg-gray-900 aspect-[4/3] overflow-hidden relative flex items-center justify-center p-3 sm:p-4">
        <Image
          src={cert.src}
          alt={cert.title}
          width={600}
          height={450}
          className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* overlay info */}
      <div
        className={`
          px-4 py-3 bg-gray-900/90 backdrop-blur-sm border-t border-gray-700/50
          transition-all duration-300
          ${isCenter ? "opacity-100" : "opacity-70"}
        `}
      >
        <p className="text-white font-bold text-sm sm:text-base leading-tight truncate">
          {cert.title}
        </p>
        <p className="text-blue-400 text-xs sm:text-sm font-medium mt-0.5">{cert.issuer}</p>
      </div>
    </motion.div>
  );
};

const Lightbox = ({
  cert,
  onClose,
  onPrev,
  onNext,
}: {
  cert: CertificateItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-gray-900 rounded-2xl overflow-hidden
          border border-gray-700 shadow-2xl shadow-blue-900/30"
      >
        <div className="relative w-full max-h-[70vh] flex justify-center bg-gray-900 p-4">
          <Image
            src={cert.src}
            alt={cert.title}
            width={900}
            height={650}
            className="w-full object-contain max-h-[70vh]"
          />
        </div>
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-700">
          <div>
            <p className="text-white font-bold text-base">{cert.title}</p>
            <p className="text-blue-400 text-sm">{cert.issuer}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm font-semibold
              px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors duration-200 cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* prev / next inside lightbox */}
        <button
          onClick={onPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full
            bg-black/60 hover:bg-black/80 text-white transition-colors duration-200 cursor-pointer"
        >
          <IoChevronBack size={22} />
        </button>
        <button
          onClick={onNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full
            bg-black/60 hover:bg-black/80 text-white transition-colors duration-200 cursor-pointer"
        >
          <IoChevronForward size={22} />
        </button>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const Cert = ({ certificates = [] }: { certificates?: CertificateItem[] }) => {
  const TOTAL = certificates.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = useCallback((i: number) => {
    if (TOTAL > 0) setActive(wrap(i, TOTAL));
  }, [TOTAL]);

  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);
  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused || TOTAL === 0) return;
    intervalRef.current = setInterval(goNext, AUTO_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, goNext, TOTAL]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  if (TOTAL === 0) return null;

  const visibleIndices = [-1, 0, 1].map((offset) => wrap(active + offset, TOTAL));

  return (
    <>
      {lightbox && certificates[active] && (
        <Lightbox
          cert={certificates[active]}
          onClose={() => setLightbox(false)}
          onPrev={() => {
            goPrev();
          }}
          onNext={() => {
            goNext();
          }}
        />
      )}

      <section
        id="Certificates"
        className="relative min-h-screen w-full overflow-hidden
          py-20 sm:py-24
          px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32
          bg-gradient-to-b from-gray-900 to-black"
      >
        {/* bg glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(70,86,151,0.14) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-6xl mx-auto">
          {/* ── Heading ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
              Certificates
            </h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full" />
          </motion.div>

          {/* ── Carousel ── */}
          <div
            className="relative select-none"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* cards track */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 px-2">
              {/* mobile: show only center card */}
              <div className="block sm:hidden w-full max-w-sm mx-auto">
                <CertCard
                  cert={certificates[active]}
                  isCenter
                  onClick={() => setLightbox(true)}
                />
              </div>

              {/* sm+: show 3 cards */}
              <div className="hidden sm:flex items-center justify-center gap-4 lg:gap-6 w-full">
                {visibleIndices.map((certIdx, pos) => (
                  <div
                    key={certIdx}
                    className={`transition-all duration-500 ${
                      pos === 1 ? "w-4/5 lg:w-2/2 z-10" : "w-1/3 lg:w-[35%]"
                    }`}
                  >
                    <CertCard
                      cert={certificates[certIdx]}
                      isCenter={pos === 1}
                      onClick={() => {
                        goTo(certIdx);
                        if (pos === 1) setLightbox(true);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Prev / Next buttons ── */}
            <button
              onClick={() => {
                goPrev();
                setPaused(true);
              }}
              className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20
                p-2.5 sm:p-3 rounded-full bg-gray-900/80 hover:bg-blue-600/80
                border border-gray-700 hover:border-blue-500
                text-white shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
              aria-label="Previous"
            >
              <IoChevronBack size={20} />
            </button>
            <button
              onClick={() => {
                goNext();
                setPaused(true);
              }}
              className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20
                p-2.5 sm:p-3 rounded-full bg-gray-900/80 hover:bg-blue-600/80
                border border-gray-700 hover:border-blue-500
                text-white shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
              aria-label="Next"
            >
              <IoChevronForward size={20} />
            </button>
          </div>

          {/* ── Controls row: dots + counter + progress bar ── */}
          <div className="flex flex-col items-center gap-4 mt-8 sm:mt-10">
            {/* dot indicators */}
            <div className="flex items-center gap-2">
              {certificates.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    goTo(i);
                    setPaused(true);
                  }}
                  className={`rounded-full transition-all duration-300 cursor-pointer
                    ${
                      i === active
                        ? "w-6 h-2.5 bg-blue-500"
                        : "w-2.5 h-2.5 bg-gray-600 hover:bg-gray-400"
                    }`}
                  aria-label={`Go to certificate ${i + 1}`}
                />
              ))}
            </div>

            {/* counter */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm tabular-nums">
                {active + 1} / {TOTAL}
              </span>
            </div>

            {/* progress bar */}
            <div className="w-full max-w-xs h-0.5 bg-gray-700/60 rounded-full overflow-hidden">
              <motion.div
                key={active}
                initial={{ width: "0%" }}
                animate={{ width: paused ? `${((active + 1) / TOTAL) * 100}%` : "100%" }}
                transition={{ duration: paused ? 0.3 : AUTO_MS / 1000, ease: "linear" }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cert;
