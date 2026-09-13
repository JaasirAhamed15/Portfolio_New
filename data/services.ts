export interface Service {
  emoji: string;
  title: string;
  tag: string;
  description: string;
  image: string;
  accent: string;
}

export const services: Service[] = [
  {
    emoji: "💻",
    title: "Full Stack Developer",
    tag: "MERN · Next.js",
    description:
      "Building scalable web apps with MongoDB, Express, React, Node.js, and Next.js — from pixel-perfect UIs to robust, secure backend APIs.",
    image: "/assets/MERN.png",
    accent: "#3B82F7",
  },
  {
    emoji: "📱",
    title: "Mobile App Developer",
    tag: "Flutter · React Native",
    description:
      "Cross-platform apps for Android & iOS with smooth animations, great UX, and clean architecture using Flutter and React Native.",
    image: "/assets/App Development.png",
    accent: "#06B6D4",
  },
  {
    emoji: "🔌",
    title: "IoT & Embedded Systems",
    tag: "ESP32 · Raspberry Pi · Arduino",
    description:
      "Connecting hardware to the cloud — sensor networks, automation pipelines, and smart systems built on ESP32, Raspberry Pi, and Arduino.",
    image: "/assets/Iot.png",
    accent: "#10B981",
  },
  {
    emoji: "🤖",
    title: "Robotics & AI",
    tag: "YOLO · Automation · AI",
    description:
      "Autonomous systems powered by YOLO object detection, AI decision-making, and industrial automation — always pushing what's possible.",
    image: "/assets/Robot.png",
    accent: "#A855F7",
  },
];

