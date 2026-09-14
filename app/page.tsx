import React from "react";
import Navbar, { NavItem } from "@/components/Navbar";
import Home from "@/components/Home";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Cert from "@/components/Cert";
import Projects from "@/components/Projects";
import Leetcode from "@/components/Leetcode";
import Footer from "@/components/Footer";
import CustomSectionRenderer from "@/components/CustomSectionRenderer";
import { getPortfolioData, SectionSettings, CustomSection } from "@/lib/portfolio-storage";

// Force dynamic rendering so updates to portfolio-data.json are rendered immediately
export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getPortfolioData();

  const sectionsConfig: SectionSettings[] = data.sectionsConfig || [];
  const customSections: CustomSection[] = data.customSections || [];

  // Helper map for section configuration
  const configMap = new Map<string, SectionSettings>();
  sectionsConfig.forEach((sec) => {
    configMap.set(sec.id, sec);
  });

  // Build dynamic navigation items
  const navItems: NavItem[] = [];

  // Map of anchor IDs and names for standard sections
  const standardNavAnchors: Record<string, { anchor: string; defaultLabel: string }> = {
    about: { anchor: "About", defaultLabel: "About" },
    skills: { anchor: "Skills", defaultLabel: "Skills" },
    services: { anchor: "Services", defaultLabel: "Services" },
    experience: { anchor: "Experience", defaultLabel: "Experience" },
    certificates: { anchor: "Certificates", defaultLabel: "Certificates" },
    projects: { anchor: "Projects", defaultLabel: "Projects" },
    leetcode: { anchor: "Coding", defaultLabel: "Coding" },
  };

  // Build nav items in configured order
  const sortedSections = [...sectionsConfig].sort((a, b) => a.order - b.order);

  sortedSections.forEach((sec) => {
    if (!sec.enabled) return;

    if (standardNavAnchors[sec.id]) {
      navItems.push({
        id: standardNavAnchors[sec.id].anchor,
        label: sec.navLabel || standardNavAnchors[sec.id].defaultLabel,
      });
    } else {
      // Check if this is a custom section
      const customSec = customSections.find((c) => c.id === sec.id);
      if (customSec && customSec.enabled) {
        navItems.push({
          id: customSec.id,
          label: customSec.navLabel || customSec.title,
        });
      }
    }
  });

  // Any custom sections not explicitly inside sectionsConfig
  customSections.forEach((customSec) => {
    if (customSec.enabled && !navItems.some((n) => n.id === customSec.id)) {
      navItems.push({
        id: customSec.id,
        label: customSec.navLabel || customSec.title,
      });
    }
  });

  // Contact nav item at the end
  navItems.push({ id: "Contact", label: "Contact" });

  // Render individual sections
  const renderSection = (id: string) => {
    switch (id) {
      case "about":
        return <About key="about" about={data.about} resumeUrl={data.hero.resumeUrl} />;
      case "skills":
        return <Skills key="skills" skills={data.skills} education={data.education} />;
      case "services":
        return <Services key="services" services={data.services} />;
      case "experience":
        return <Experience key="experience" experiences={data.experiences} />;
      case "certificates":
        return <Cert key="certificates" certificates={data.certificates} />;
      case "projects":
        return <Projects key="projects" projects={data.projects} />;
      case "leetcode":
        return <Leetcode key="leetcode" />;
      default: {
        const customSec = customSections.find((c) => c.id === id);
        if (customSec && customSec.enabled) {
          return <CustomSectionRenderer key={customSec.id} section={customSec} />;
        }
        return null;
      }
    }
  };

  return (
    <main className="bg-[#171d32] h-auto w-full overflow-x-hidden">
      <Navbar navItems={navItems} />
      <Home hero={data.hero} />

      {/* Render sections in order defined by user */}
      {sortedSections.map((sec) => {
        if (!sec.enabled) return null;
        return renderSection(sec.id);
      })}

      {/* Render any additional custom sections that might not be in sectionsConfig list */}
      {customSections
        .filter((c) => c.enabled && !sortedSections.some((s) => s.id === c.id))
        .map((c) => (
          <CustomSectionRenderer key={c.id} section={c} />
        ))}

      <Footer contact={data.about.contact} />
    </main>
  );
}
