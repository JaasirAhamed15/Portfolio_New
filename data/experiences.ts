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

export const experiences: ExperienceItem[] = [
  {
    company: "RCK Techiees",
    role: "Full Stack Developer Intern",
    period: "Dec 2025 – Mar 2026",
    accent: "#3B82F6",
    initials: "RCK",
    cert: {
      image: "/certificates/internship.png",
      title: "Internship Certificate — RCK Techiees",
    },
    techIcons: [
      { iconType: "react", color: "#61DAFB", label: "React" },
      { iconType: "node", color: "#339933", label: "Node.js" },
      { iconType: "freshworks", color: "#26B24B", label: "Freshworks" },
    ],
    bullets: [
      "Migrated 5+ ticketing systems (Jira, Zoho Desk, ManageEngine, Zendesk) to Freshservice/Freshdesk.",
      "Automated migration workflows via APIs, reducing manual effort and improving data accuracy.",
      "Handled large-scale ticket data — users, conversations, attachments, and metadata — with high precision.",
      "Ensured data integrity and smooth transitions with minimal downtime.",
      "Contributed to full-stack development using React.js and Node.js.",
      "Gained hands-on experience in API integrations and automation workflows.",
    ],
  },
  {
    company: "ZED INDEX",
    role: "Software Developer Intern",
    period: "June 2025 – July 2025",
    accent: "#06B6D4",
    initials: "ZED",
    cert: {
      image: "/certificates/Rck Techiees.png",
      title: "Internship Certificate — ZED INDEX",
    },
    techIcons: [
      { iconType: "react", color: "#61DAFB", label: "React" },
      { iconType: "node", color: "#339933", label: "Node.js" },
      { iconType: "next", color: "#FFFFFF", label: "Next.js" },
    ],
    bullets: [
      "Developed and debugged web application features using React.js, Node.js, and Next.js.",
      "Collaborated on scalable frontend and backend modules.",
      "Gained experience in real-world development workflows and deployment.",
    ],
  },
];

