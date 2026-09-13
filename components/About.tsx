"use client";

import React from "react";
import Image from "next/image";
import {
  IoLogoGithub,
  IoLogoLinkedin,
  IoMail,
  IoPhonePortrait,
  IoDownloadOutline,
  IoCodeSlash,
  IoSchool,
  IoBriefcase,
} from "react-icons/io5";
import { motion, Variants } from "framer-motion";
import { AboutData } from "@/lib/portfolio-storage";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const DEFAULT_ABOUT: AboutData = {
  title: "About Me",
  roleBadge: "Software Developer & Programming Enthusiast",
  bio1: "I am a Full Stack Developer specialising in web and mobile applications, with over 2 years of part-time experience. My focus is on building secure, scalable, and sustainable applications that serve clients worldwide.",
  bio2: "I hold a Bachelor's degree in Computer Science Engineering. I enjoy problem-solving, debugging, and participating in coding competitions to sharpen my skills, and I'm constantly exploring new technologies to stay ahead in this fast-evolving industry.",
  image: "/assets/my_image.png",
  stats: [
    { value: "2+", label: "Years Experience" },
    { value: "10+", label: "Projects Built" },
    { value: "BE", label: "CS Engineering" },
  ],
  contact: {
    email: "jaasirahamed87@gmail.com",
    phone: "+91 6379926170",
    github: "https://github.com/JaasirAhamed15",
    linkedin: "https://www.linkedin.com/in/jaasirahamed15",
  },
};

const getStatIcon = (i: number) => {
  if (i === 0) return <IoBriefcase />;
  if (i === 1) return <IoCodeSlash />;
  return <IoSchool />;
};

const About = ({
  about = DEFAULT_ABOUT,
  resumeUrl = "/certificates/JaasirAhamedA.pdf",
}: {
  about?: AboutData;
  resumeUrl?: string;
}) => {
  const socials = [
    {
      icon: <IoLogoGithub />,
      href: about.contact.github,
      label: "GitHub",
    },
    {
      icon: <IoLogoLinkedin />,
      href: about.contact.linkedin,
      label: "LinkedIn",
    },
    {
      icon: <IoMail />,
      href: `mailto:${about.contact.email}`,
      label: "Email",
    },
    {
      icon: <IoPhonePortrait />,
      href: `tel:${about.contact.phone}`,
      label: "Phone",
    },
  ];

  return (
    <section
      id="About"
      className="relative min-h-screen w-full overflow-hidden
        py-20 sm:py-24
        px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32
        bg-gradient-to-b from-black to-gray-900"
    >
      {/* subtle background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(70,86,151,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* ── Section heading ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center lg:text-left"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white inline-block
            border-b-2 border-blue-500 pb-2">
            {about.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ── Left — Image ── */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative w-64 sm:w-80 md:w-96 lg:w-full max-w-sm lg:max-w-md group">
              {/* decorative ring */}
              <div
                aria-hidden
                className="absolute -inset-2 rounded-3xl opacity-25 blur-sm group-hover:opacity-40 transition-opacity duration-500"
                style={{ background: "linear-gradient(135deg, #465697, #7b8fdb)" }}
              />
              <Image
                src={about.image || "/assets/my_image.png"}
                alt="Jaasir Ahamed"
                width={500}
                height={500}
                className="relative w-full h-auto rounded-3xl object-cover
                  shadow-2xl shadow-blue-900/50
                  transform transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </motion.div>

          {/* ── Right — Content ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            {/* Role badge */}
            <motion.h3
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400"
            >
              {about.roleBadge}
            </motion.h3>

            {/* Bio card */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed"
            >
              <p>{about.bio1}</p>
              <p>{about.bio2}</p>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-3 sm:gap-4"
            >
              {about.stats.map(({ value, label }, i) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 bg-gray-800/40 rounded-xl py-4 px-2
                    border border-gray-700/50 hover:border-blue-500/50
                    transition-colors duration-300"
                >
                  <span className="text-blue-400 text-xl sm:text-2xl">{getStatIcon(i)}</span>
                  <span className="text-white font-extrabold text-lg sm:text-xl">{value}</span>
                  <span className="text-gray-400 text-[10px] sm:text-xs text-center leading-tight">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* Social links + Download CV */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              {socials.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center gap-2 text-gray-300
                    hover:text-blue-400 hover:scale-110
                    transition-all duration-300 text-2xl sm:text-3xl"
                >
                  {icon}
                </a>
              ))}

              {/* Divider */}
              <span className="hidden sm:block w-px h-6 bg-gray-600" aria-hidden />

              {/* Download CV */}
              <a href={resumeUrl} download="Jaasir Ahamed A.pdf">
                <button
                  className="btn-primary flex items-center gap-2
                    py-2 px-5 rounded-full text-sm font-semibold text-white
                    bg-[#465697] hover:bg-[#3a4b88]
                    hover:scale-105 transition-all duration-300
                    shadow-lg shadow-blue-900/40 cursor-pointer"
                >
                  <IoDownloadOutline className="text-base" />
                  Download CV
                </button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
