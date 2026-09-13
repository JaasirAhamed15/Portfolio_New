import fs from "fs/promises";
import path from "path";

export interface HeroData {
  greeting: string;
  name: string;
  roles: string[];
  bio: string;
  profileImage: string;
  resumeUrl: string;
}

export interface AboutData {
  title: string;
  roleBadge: string;
  bio1: string;
  bio2: string;
  image: string;
  stats: { value: string; label: string }[];
  contact: {
    email: string;
    phone: string;
    github: string;
    linkedin: string;
  };
}

export interface SkillItem {
  iconType: string;
  name: string;
  color: string;
}

export interface EducationItem {
  iconType: string;
  iconColor: string;
  institution: string;
  period: string;
  details: string;
  current: boolean;
}

export interface ServiceItem {
  emoji: string;
  title: string;
  tag: string;
  description: string;
  image: string;
  accent: string;
}

export interface TechIcon {
  iconType: string;
  color: string;
  label: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  accent: string;
  initials: string;
  cert: {
    image: string;
    title: string;
  };
  techIcons: TechIcon[];
  bullets: string[];
}

export interface CertificateItem {
  src: string;
  title: string;
  issuer: string;
}

export interface ProjectItem {
  id?: string;
  title: string;
  emoji: string;
  tag: string;
  tagColor: string;
  main: string;
  image: string;
  demo: string | null;
  demoLabel: string | null;
}

export interface PortfolioData {
  hero: HeroData;
  about: AboutData;
  skills: SkillItem[];
  education: EducationItem[];
  services: ServiceItem[];
  experiences: ExperienceItem[];
  certificates: CertificateItem[];
  projects: ProjectItem[];
}

const DATA_FILE_PATH = path.join(process.cwd(), "data", "portfolio-data.json");

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    throw error;
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving portfolio data:", error);
    throw error;
  }
}

