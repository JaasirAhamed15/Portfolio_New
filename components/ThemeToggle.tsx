"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";

export const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl border border-gray-700/60 bg-gray-800/40 ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle light or dark theme"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`relative flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-md ${
        theme === "dark"
          ? "bg-gray-800/80 border-gray-700/70 text-yellow-400 hover:bg-gray-700 hover:border-yellow-400/50 shadow-yellow-500/5"
          : "bg-white/90 border-gray-300 text-blue-600 hover:bg-gray-100 hover:border-blue-400 shadow-blue-500/10"
      } ${className}`}
    >
      {theme === "dark" ? (
        <IoSunnyOutline size={20} className="transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <IoMoonOutline size={19} className="transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
};

export default ThemeToggle;

