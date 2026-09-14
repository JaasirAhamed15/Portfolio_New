"use client";

import React from "react";
import { MdOutlineEmail } from "react-icons/md";
import { CiLinkedin } from "react-icons/ci";
import { FaGithub, FaMobileAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { AboutData } from "@/lib/portfolio-storage";

const Footer = ({ contact }: { contact?: AboutData["contact"] }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15 },
    }),
  };

  const email = contact?.email || "jaasirahamed87@gmail.com";
  const phone = contact?.phone || "+91 6379926170";
  const github = contact?.github || "https://github.com/JaasirAhamed15";
  const linkedin = contact?.linkedin || "https://www.linkedin.com/in/jaasirahamed15";

  return (
    <motion.footer
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      id="Contact"
      className="relative flex flex-col md:flex-row justify-between items-center
      gap-8 px-6 md:px-16 py-12 text-white overflow-hidden
      bg-gradient-to-br from-black via-gray-900 to-gray-950"
    >
      {/* 🔵 Background Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_60%)]" />

      {/* LEFT TEXT */}
      <div className="text-center md:text-left">
        <h2 className="text-3xl md:text-6xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Contact Me
        </h2>
        <p className="text-gray-400 text-md md:text-xl">
          Feel Free To reach out!
        </p>
      </div>

      {/* CONTACT CARDS */}
      <div className="grid gap-4 w-full md:w-auto">
        {[
          {
            icon: <MdOutlineEmail size={22} />,
            text: email,
            link: `mailto:${email}`,
            label: `Send email to ${email}`,
          },
          {
            icon: <CiLinkedin size={22} />,
            text: "LinkedIn Profile",
            link: linkedin,
            label: "Visit LinkedIn profile",
          },
          {
            icon: <FaGithub size={22} />,
            text: "GitHub Profile",
            link: github,
            label: "Visit GitHub profile",
          },
          {
            icon: <FaMobileAlt size={22} />,
            text: phone,
            link: `tel:${phone}`,
            label: `Call ${phone}`,
          },
        ].map((item, i) => (
          <motion.a
            key={i}
            href={item.link}
            aria-label={item.label}
            target={item.link.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            custom={i}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{
              scale: 1.05,
              rotateX: 6,
              rotateY: -6,
            }}
            className="group flex items-center gap-4 px-5 py-3 rounded-xl
            bg-white/5 backdrop-blur-lg border border-white/10
            shadow-lg transition-all duration-300
            hover:border-blue-400/40 hover:shadow-blue-500/20 cursor-pointer"
          >
            {/* ICON */}
            <div className="text-blue-400 group-hover:scale-110 transition">
              {item.icon}
            </div>

            {/* TEXT */}
            <span className="text-sm md:text-base text-gray-300 group-hover:text-white transition">
              {item.text}
            </span>
          </motion.a>
        ))}
      </div>

      {/* BOTTOM LINE */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
    </motion.footer>
  );
};

export default Footer;
