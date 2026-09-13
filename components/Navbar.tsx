"use client";

import React, { useState } from "react";
import { RiCloseLine, RiMenu2Line } from "@remixicon/react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [menu, openmenu] = useState(false);
  const [showMenu, setShowMenu] = useState(true);

  return (
    <nav className="flex flex-wrap justify-between items-center text-white px-6 sm:px-10 pt-6 md:px-20 relative z-50 transition-colors">
      <div className="flex items-center gap-4">
        <span className="text-3xl sm:text-4xl font-bold tracking-wide text-blue-500">
          Portfolio
        </span>
      </div>

      {/* Desktop Navigation Links & Theme Toggle */}
      <div className="hidden md:flex items-center gap-8">
        <ul className="flex items-center gap-6 font-semibold">
          <a href="#About">
            <li className="text-lg text-white dark:text-white transition-all duration-300 hover:text-blue-500 hover:scale-105">
              About
            </li>
          </a>
          <a href="#Skills">
            <li className="text-lg text-white dark:text-white transition-all duration-300 hover:text-blue-500 hover:scale-105">
              Skills
            </li>
          </a>
          <a href="#Services">
            <li className="text-lg text-white dark:text-white transition-all duration-300 hover:text-blue-500 hover:scale-105">
              Services
            </li>
          </a>
          <a href="#Certificates">
            <li className="text-lg text-white dark:text-white transition-all duration-300 hover:text-blue-500 hover:scale-105">
              Certificates
            </li>
          </a>
          <a href="#Projects">
            <li className="text-lg text-white dark:text-white transition-all duration-300 hover:text-blue-500 hover:scale-105">
              Projects
            </li>
          </a>
          <a href="#Contact">
            <li className="text-lg text-white dark:text-white transition-all duration-300 hover:text-blue-500 hover:scale-105">
              Contact
            </li>
          </a>
        </ul>

        {/* Theme Toggle Button */}
        <ThemeToggle />
      </div>

      {/* Mobile Actions: Toggle + Hamburger */}
      <div className="flex md:hidden items-center gap-3">
        <ThemeToggle />

        {showMenu ? (
          <RiMenu2Line
            size={30}
            className="transition-all duration-300 cursor-pointer"
            onClick={() => {
              openmenu(!menu);
              setShowMenu(!showMenu);
            }}
          />
        ) : (
          <RiCloseLine
            size={30}
            className="transition-all duration-300 p-1 cursor-pointer"
            onClick={() => {
              openmenu(!menu);
              setShowMenu(!showMenu);
            }}
          />
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      <ul
        className={`${
          menu ? "block w-full left-0 right-0" : "hidden"
        } absolute top-full mt-2 py-4 font-semibold bg-gray-900/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-xl
        text-center md:hidden gap-6`}
      >
        <a href="#About" onClick={() => { openmenu(false); setShowMenu(true); }}>
          <li className="text-xl text-white p-3 hover:text-blue-500 transition-colors">
            About
          </li>
        </a>
        <a href="#Skills" onClick={() => { openmenu(false); setShowMenu(true); }}>
          <li className="text-xl text-white p-3 hover:text-blue-500 transition-colors">
            Skills
          </li>
        </a>
        <a href="#Services" onClick={() => { openmenu(false); setShowMenu(true); }}>
          <li className="text-xl text-white p-3 hover:text-blue-500 transition-colors">
            Services
          </li>
        </a>
        <a href="#Certificates" onClick={() => { openmenu(false); setShowMenu(true); }}>
          <li className="text-xl text-white p-3 hover:text-blue-500 transition-colors">
            Certificates
          </li>
        </a>
        <a href="#Projects" onClick={() => { openmenu(false); setShowMenu(true); }}>
          <li className="text-xl text-white p-3 hover:text-blue-500 transition-colors">
            Projects
          </li>
        </a>
        <a href="#Contact" onClick={() => { openmenu(false); setShowMenu(true); }}>
          <li className="text-xl text-white p-3 hover:text-blue-500 transition-colors">
            Contact
          </li>
        </a>
      </ul>
    </nav>
  );
};

export default Navbar;
