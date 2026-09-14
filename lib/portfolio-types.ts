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
  fullDescription?: string;
  image: string;
  demo: string | null;
  demoLabel: string | null;
  github?: string | null;
  secondaryLink?: string | null;
  secondaryLinkLabel?: string | null;
}

export interface CustomComponentItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  tag?: string;
  tagColor?: string;
  link?: string;
  linkLabel?: string;
  secondaryLink?: string;
  secondaryLinkLabel?: string;
}

export type CustomSectionLayout = "cards-grid" | "featured-split" | "timeline" | "compact-list";

export interface CustomSection {
  id: string;
  navLabel: string;
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
  layout?: CustomSectionLayout;
  items: CustomComponentItem[];
}

export interface SectionSettings {
  id: string;
  name: string;
  navLabel: string;
  enabled: boolean;
  order: number;
  isCustom?: boolean;
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
  sectionsConfig?: SectionSettings[];
  customSections?: CustomSection[];
}

export const DEFAULT_SECTIONS_CONFIG: SectionSettings[] = [
  { id: "about", name: "About Me", navLabel: "About", enabled: true, order: 1 },
  { id: "skills", name: "Skills & Education", navLabel: "Skills", enabled: true, order: 2 },
  { id: "services", name: "Services", navLabel: "Services", enabled: true, order: 3 },
  { id: "experience", name: "Work Experience", navLabel: "Experience", enabled: true, order: 4 },
  { id: "certificates", name: "Certificates", navLabel: "Certificates", enabled: true, order: 5 },
  { id: "projects", name: "Projects", navLabel: "Projects", enabled: true, order: 6 },
  { id: "leetcode", name: "LeetCode & Coding Profiles", navLabel: "Coding", enabled: true, order: 7 },
];
