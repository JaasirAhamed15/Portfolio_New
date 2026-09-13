export interface SkillItem {
  name: string;
  color: string;
  iconType: string;
}

export interface EducationItem {
  iconType: string;
  iconColor: string;
  institution: string;
  period: string;
  details: string;
  current: boolean;
}

export const skills: SkillItem[] = [
  { iconType: "html5", name: "HTML5", color: "#E34F26" },
  { iconType: "css3", name: "CSS3", color: "#1572B6" },
  { iconType: "javascript", name: "JavaScript", color: "#F7DF1E" },
  { iconType: "react", name: "React", color: "#61DAFB" },
  { iconType: "nextjs", name: "Next.js", color: "#FFFFFF" },
  { iconType: "nodejs", name: "Node.js", color: "#339933" },
  { iconType: "tailwind", name: "Tailwind", color: "#06B6D4" },
  { iconType: "mongodb", name: "MongoDB", color: "#47A248" },
  { iconType: "mysql", name: "MySQL", color: "#4479A1" },
  { iconType: "flutter", name: "Flutter", color: "#02569B" },
  { iconType: "python", name: "Python", color: "#3776AB" },
  { iconType: "java", name: "Java", color: "#ED8B00" },
  { iconType: "cplusplus", name: "C / C++", color: "#00599C" },
  { iconType: "figma", name: "Figma", color: "#F24E1E" },
  { iconType: "github", name: "GitHub", color: "#E6EDF3" },
  { iconType: "iot", name: "IoT", color: "#FBBF24" },
];

export const education: EducationItem[] = [
  {
    iconType: "grad",
    iconColor: "#FBBF24",
    institution: "Mount Zion College Of Engineering And Technology",
    period: "2022 – 2026",
    details: "BE Computer Science And Engineering",
    current: true,
  },
  {
    iconType: "school",
    iconColor: "#93C5FD",
    institution: "M CT RM Ramanathan Chettiyar Higher Secondary School",
    period: "2020 – 2022",
    details: "Bio Maths (Grade 11–12)",
    current: false,
  },
  {
    iconType: "riSchool",
    iconColor: "#FB923C",
    institution: "SSA High School",
    period: "2015 – 2020",
    details: "Grade 6–10",
    current: false,
  },
];

