"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { HeroData } from "@/lib/portfolio-storage";

// ── Typing animation hook ──────────────────────────────────────────────────
const useTypingEffect = (words: string[], typingSpeed = 60, deletingSpeed = 35, pause = 1200) => {
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const current = words[wordIndex % words.length];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayed(current.slice(0, displayed.length + 1));
        if (displayed.length + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setDisplayed(current.slice(0, displayed.length - 1));
        if (displayed.length - 1 === 0) {
          setIsDeleting(false);
          setWordIndex((i) => (i + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pause]);

  return displayed;
};

// ── Animation variants ─────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const imageVariants: Variants = {
  hidden: { opacity: 0.85, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

const DEFAULT_HERO: HeroData = {
  greeting: "Welcome to my portfolio",
  name: "Jaasir Ahamed",
  roles: [
    "Full Stack Developer - MERN",
    "React Developer",
    "UI/UX Enthusiast",
    "Problem Solver",
    "App Developer - Flutter",
    "IoT Engineer",
  ],
  bio: "I'm Jaasir Ahamed B.E Computer Science student passionate about building clean, performant web experiences. I love turning ideas into real products through code.",
  profileImage: "/assets/my_image.png",
  resumeUrl: "/certificates/JaasirAhamedA.pdf",
};

const Home = ({ hero = DEFAULT_HERO }: { hero?: HeroData }) => {
  const typedText = useTypingEffect(hero.roles && hero.roles.length > 0 ? hero.roles : DEFAULT_HERO.roles);

  return (
    <section
      id="Home"
      className="
        relative min-h-screen w-full overflow-hidden
        flex flex-col-reverse lg:flex-row
        items-center justify-between
        px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32
        py-20 sm:py-24 lg:py-0
        gap-10 lg:gap-8
      "
    >
      {/* ── subtle background glow ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 70% 40%, rgba(70,86,151,0.18) 0%, transparent 70%)",
        }}
      />

      {/* ── Text block ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-5 text-white text-center lg:text-left"
      >
        {/* Greeting */}
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base font-semibold tracking-widest uppercase text-blue-400"
        >
          {hero.greeting}
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight"
        >
          Hello, I&apos;m{" "}
          <span className="text-blue-500">{hero.name}</span>
        </motion.h1>

        {/* Typing role */}
        <motion.h2
          variants={itemVariants}
          className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold leading-snug min-h-[2.5rem] sm:min-h-[3rem]"
        >
          I&apos;m a{" "}
          <span className="text-blue-400">
            {typedText}
            <span className="animate-pulse">|</span>
          </span>
        </motion.h2>

        {/* Bio */}
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0"
        >
          {hero.bio}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col xs:flex-row justify-center lg:justify-start gap-3 sm:gap-4 mt-2"
        >
          <a href="#Contact" className="w-full xs:w-auto">
            <button
              className="
                btn-primary
                w-full xs:w-auto
                py-3 px-7 rounded-full
                text-sm sm:text-base font-semibold text-white
                bg-[#465697] hover:bg-[#3a4b88]
                hover:scale-105 hover:opacity-95
                transition-all duration-300
                shadow-lg shadow-blue-900/40
                cursor-pointer
              "
            >
              Contact Me
            </button>
          </a>

          <a href={hero.resumeUrl} download="Jaasir Ahamed A.pdf" className="w-full xs:w-auto">
            <button
              className="
                btn-secondary
                w-full xs:w-auto
                py-3 px-7 rounded-full
                text-sm sm:text-base font-semibold text-white
                border-2 border-[#465697]
                hover:bg-[#465697] hover:scale-105
                transition-all duration-300
                cursor-pointer
              "
            >
              Download CV
            </button>
          </a>
        </motion.div>
      </motion.div>

      {/* ── Image block ── */}
      <motion.div
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        className="w-full lg:w-2/5 flex justify-center lg:justify-end"
      >
        <div className="relative">
          {/* decorative ring */}
          <div
            className="absolute -inset-2 sm:-inset-3 rounded-2xl opacity-30 blur-sm"
            style={{ background: "linear-gradient(135deg, #465697, #7b8fdb)" }}
            aria-hidden
          />
          <Image
            src={hero.profileImage || "/assets/my_image.png"}
            alt={hero.name}
            width={500}
            height={500}
            priority
            sizes="(max-width: 640px) 224px, (max-width: 768px) 288px, (max-width: 1024px) 320px, 448px"
            className="
              relative
              w-56 sm:w-72 md:w-80 lg:w-full
              max-w-xs sm:max-w-sm lg:max-w-md
              rounded-2xl object-cover
              shadow-2xl shadow-blue-900/60
            "
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Home;
