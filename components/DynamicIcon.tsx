"use client";

import React from "react";
// FontAwesome icons
import * as FaIcons from "react-icons/fa";
// Simple Icons
import * as SiIcons from "react-icons/si";
// Remix Icons
import * as RiIcons from "react-icons/ri";
// Ionicons
import * as IoIcons from "react-icons/io5";
import * as IoIosIcons from "react-icons/io";
// Material Design
import * as MdIcons from "react-icons/md";
// Tabler Icons
import * as TbIcons from "react-icons/tb";
// Lucide / Feather
import * as FiIcons from "react-icons/fi";
// Bootstrap
import * as BsIcons from "react-icons/bs";

interface DynamicIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  size?: number | string;
}

// Preset mapping for convenient shorthand aliases
const PRESET_ICONS: Record<string, React.ReactNode> = {
  html5: <FaIcons.FaHtml5 />,
  css3: <FaIcons.FaCss3Alt />,
  javascript: <SiIcons.SiJavascript />,
  react: <FaIcons.FaReact />,
  nextjs: <SiIcons.SiNextdotjs />,
  nodejs: <FaIcons.FaNodeJs />,
  tailwind: <SiIcons.SiTailwindcss />,
  mongodb: <SiIcons.SiMongodb />,
  mysql: <SiIcons.SiMysql />,
  flutter: <SiIcons.SiFlutter />,
  python: <SiIcons.SiPython />,
  java: <FaIcons.FaJava />,
  cplusplus: <SiIcons.SiCplusplus />,
  figma: <FaIcons.FaFigma />,
  github: <SiIcons.SiGithub />,
  iot: <IoIosIcons.IoIosWifi />,
  grad: <FaIcons.FaGraduationCap />,
  school: <FaIcons.FaSchool />,
  riSchool: <RiIcons.RiSchoolLine />,
};

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  className,
  style,
  size,
}) => {
  if (!name) return <FaIcons.FaCode className={className} style={style} size={size} />;

  const trimmed = name.trim();

  // If user passes e.g. <FaHtml5 /> or <SiDocker />
  const cleanName = trimmed
    .replace(/^<|\/>|>$/g, "")
    .replace(/\s+/g, "");

  // 1. Check presets
  if (PRESET_ICONS[cleanName.toLowerCase()]) {
    return <span className={className} style={style}>{PRESET_ICONS[cleanName.toLowerCase()]}</span>;
  }

  // 2. Resolve dynamically from react-icons libraries
  let IconComponent: React.ComponentType<{ className?: string; style?: React.CSSProperties; size?: number | string }> | undefined;

  if (cleanName.startsWith("Fa")) {
    IconComponent = (FaIcons as Record<string, unknown>)[cleanName] as typeof IconComponent;
  } else if (cleanName.startsWith("Si")) {
    IconComponent = (SiIcons as Record<string, unknown>)[cleanName] as typeof IconComponent;
  } else if (cleanName.startsWith("Ri")) {
    IconComponent = (RiIcons as Record<string, unknown>)[cleanName] as typeof IconComponent;
  } else if (cleanName.startsWith("Io")) {
    IconComponent = ((IoIcons as Record<string, unknown>)[cleanName] || (IoIosIcons as Record<string, unknown>)[cleanName]) as typeof IconComponent;
  } else if (cleanName.startsWith("Md")) {
    IconComponent = (MdIcons as Record<string, unknown>)[cleanName] as typeof IconComponent;
  } else if (cleanName.startsWith("Tb")) {
    IconComponent = (TbIcons as Record<string, unknown>)[cleanName] as typeof IconComponent;
  } else if (cleanName.startsWith("Fi")) {
    IconComponent = (FiIcons as Record<string, unknown>)[cleanName] as typeof IconComponent;
  } else if (cleanName.startsWith("Bs")) {
    IconComponent = (BsIcons as Record<string, unknown>)[cleanName] as typeof IconComponent;
  }

  // Try generic search across packages if prefix didn't match directly
  if (!IconComponent) {
    IconComponent =
      ((SiIcons as Record<string, unknown>)[cleanName] ||
        (FaIcons as Record<string, unknown>)[cleanName] ||
        (RiIcons as Record<string, unknown>)[cleanName] ||
        (IoIcons as Record<string, unknown>)[cleanName] ||
        (MdIcons as Record<string, unknown>)[cleanName] ||
        (TbIcons as Record<string, unknown>)[cleanName] ||
        (FiIcons as Record<string, unknown>)[cleanName] ||
        (BsIcons as Record<string, unknown>)[cleanName]) as typeof IconComponent;
  }

  if (IconComponent) {
    return <IconComponent className={className} style={style} size={size} />;
  }

  // Fallback icon
  return <FaIcons.FaCode className={className} style={style} size={size} />;
};

export default DynamicIcon;

