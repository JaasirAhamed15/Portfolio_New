"use client";

import React, { useState } from "react";
import { RiCloseLine, RiMenu2Line } from "@remixicon/react";
import ThemeToggle from "./ThemeToggle";

export interface NavItem {
  id: string; // anchor id e.g. "About" or "freelance"
  label: string;
}

interface NavbarProps {
  navItems?: NavItem[];
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { id: "About", label: "About" },
  { id: "Skills", label: "Skills" },
  { id: "Services", label: "Services" },
  { id: "Certificates", label: "Certificates" },
  { id: "Projects", label: "Projects" },
  { id: "Contact", label: "Contact" },
];

const Navbar = ({ navItems = DEFAULT_NAV_ITEMS }: NavbarProps) => {
  const [menu, openmenu] = useState(false);
  const [showMenu, setShowMenu] = useState(true);

  const items = navItems && navItems.length > 0 ? navItems : DEFAULT_NAV_ITEMS;

  return (
    <nav className="flex flex-wrap justify-between items-center text-white px-6 sm:px-10 pt-6 md:px-20 relative z-50 transition-colors">
      <div className="flex items-center gap-4">
        <a href="#Home" aria-label="Go to homepage" className="text-3xl sm:text-4xl font-bold tracking-wide text-blue-500 hover:opacity-90 transition-opacity">
          Portfolio
        </a>
      </div>

      {/* Desktop Navigation Links & Theme Toggle */}
      <div className="hidden md:flex items-center gap-8">
        <ul className="flex items-center gap-6 font-semibold">
          {items.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              <li className="text-lg text-white dark:text-white transition-all duration-300 hover:text-blue-500 hover:scale-105">
                {item.label}
              </li>
            </a>
          ))}
        </ul>

        {/* Theme Toggle Button */}
        <ThemeToggle />
      </div>

      {/* Mobile Actions: Toggle + Hamburger */}
      <div className="flex md:hidden items-center gap-3">
        <ThemeToggle />

        <button
          type="button"
          aria-label={showMenu ? "Open navigation menu" : "Close navigation menu"}
          aria-expanded={menu}
          className="p-1 rounded-lg text-white hover:text-blue-400 focus:outline-none cursor-pointer"
          onClick={() => {
            openmenu(!menu);
            setShowMenu(!showMenu);
          }}
        >
          {showMenu ? (
            <RiMenu2Line size={28} className="transition-all duration-300" />
          ) : (
            <RiCloseLine size={28} className="transition-all duration-300" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <ul
        className={`${
          menu ? "block w-full left-0 right-0" : "hidden"
        } absolute top-full mt-2 py-4 font-semibold bg-gray-900/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-xl
        text-center md:hidden gap-6`}
      >
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => {
              openmenu(false);
              setShowMenu(true);
            }}
          >
            <li className="text-xl text-white p-3 hover:text-blue-500 transition-colors">
              {item.label}
            </li>
          </a>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
