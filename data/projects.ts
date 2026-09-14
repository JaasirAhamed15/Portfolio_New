export interface Project {
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

export const projects: Project[] = [
  {
    title: "E-Commerce Website",
    emoji: "🛒",
    tag: "MERN Stack",
    tagColor: "#3B82F6",
    main: "A full-fledged MERN stack e-commerce platform with product browsing, cart, secure payments, user authentication, order management, and an admin dashboard for inventory control.",
    image: "/assets/ecomimg.png",
    demo: "https://github.com/JaasirAhamed15/E-commerce",
    demoLabel: "GitHub",
  },
  {
    title: "Shopping App",
    emoji: "📱",
    tag: "Flutter",
    tagColor: "#06B6D4",
    main: "Scan product barcodes to auto-add items to cart with live pricing. Supports secure checkout via Razorpay or Stripe payment gateway.",
    image: "/assets/autocard.jpg",
    demo: "https://www.linkedin.com/posts/lakshmanan-palaniappan4_flutter-innovation-robotics-ugcPost-7274838198508236800-7rCr",
    demoLabel: "LinkedIn",
  },
  {
    title: "Smart EVM Machine",
    emoji: "🗳️",
    tag: "IoT · ESP32",
    tagColor: "#10B981",
    main: "IoT-powered Electronic Voting Machine with RFID authentication, real-time vote counting, and Firebase backend for transparent elections.",
    image: "/assets/voteing.jpg",
    demo: "https://github.com/JaasirAhamed15/smart_evm",
    demoLabel: "GitHub",
  },
  {
    title: "Number Plate Detection",
    emoji: "🚗",
    tag: "Computer Vision",
    tagColor: "#F59E0B",
    main: "Real-time vehicle number plate detection using OpenCV and YOLO. Ideal for parking management, toll booths, and security with AI-driven OCR.",
    image: "/assets/numplate.jpg",
    demo: "https://github.com/JaasirAhamed15",
    demoLabel: "GitHub",
  },
  {
    title: "Blog Website",
    emoji: "📝",
    tag: "Next.js · MongoDB",
    tagColor: "#8B5CF6",
    main: "Dynamic blog platform with full CRUD, rich text editing, image uploads, and a fully responsive design optimized for all screen sizes.",
    image: "/assets/blog.jpg",
    demo: "https://github.com/JaasirAhamed15/my_blog",
    demoLabel: "GitHub",
  },
  {
    title: "Text to Image Generator",
    emoji: "🖼️",
    tag: "AI · ClipDrop API",
    tagColor: "#EC4899",
    main: "AI-powered app that converts text prompts into images via the ClipDrop API — with prompt history, style options, and download support.",
    image: "/assets/texttoimage.webp",
    demo: "https://github.com/JaasirAhamed15/imagify",
    demoLabel: "GitHub",
  },
  {
    title: "Waste Picker Robot",
    emoji: "🤖",
    tag: "Robotics · Arduino",
    tagColor: "#F97316",
    main: "Autonomous robot for public waste collection using ESP32-CAM, Arduino, ultrasonic sensors, and a mechanical arm for detecting and sorting trash.",
    image: "/assets/rover.jpg",
    demo: null,
    demoLabel: null,
  },
  {
    title: "Travelon - Tourist Safety System",
    emoji: "📍",
    tag: "Next.js · Flutter · Node.js",
    tagColor: "#EF4444",
    main: "Smart tourist safety platform with real-time live tracking, geofencing alerts, and SOS emergency system. Tourists are monitored via mobile or wearable devices, and agencies/guides receive instant alerts to respond and rescue in danger situations.",
    image: "/assets/Tourist safety and tracking in action.png",
    demo: "https://github.com/JaasirAhamed15/travelon",
    demoLabel: "GitHub",
  },
];

