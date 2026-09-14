import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#171d32",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://jaasirahamed15.vercel.app"),
  title: "Jaasir Ahamed | Full Stack Developer & Software Engineer",
  description:
    "Jaasir Ahamed is a Full Stack Developer (MERN, Next.js), Mobile App Developer (Flutter), and IoT Engineer passionate about building high-performance web applications and software systems.",
  keywords: [
    "Jaasir Ahamed",
    "Full Stack Developer",
    "MERN Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Flutter Developer",
    "IoT Engineer",
    "Software Engineer Portfolio",
  ],
  authors: [{ name: "Jaasir Ahamed", url: "https://github.com/JaasirAhamed15" }],
  creator: "Jaasir Ahamed",
  icons: {
    icon: [
      { url: "/jaasir-favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/jaasir-favicon.svg",
    shortcut: "/jaasir-favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jaasirahamed15.vercel.app",
    title: "Jaasir Ahamed | Full Stack Developer Portfolio",
    description:
      "Explore the portfolio of Jaasir Ahamed, featuring full-stack web applications, mobile apps, robotics, IoT projects, and competitive programming achievements.",
    siteName: "Jaasir Ahamed Portfolio",
    images: [
      {
        url: "/assets/my_image.png",
        width: 800,
        height: 800,
        alt: "Jaasir Ahamed",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaasir Ahamed | Full Stack Developer",
    description:
      "Full Stack Developer (MERN, Next.js), Mobile App Developer (Flutter), and IoT Engineer.",
    images: ["/assets/my_image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jaasir Ahamed",
    url: "https://jaasirahamed15.vercel.app",
    image: "https://jaasirahamed15.vercel.app/assets/my_image.png",
    sameAs: [
      "https://github.com/JaasirAhamed15",
      "https://www.linkedin.com/in/jaasirahamed15",
      "https://leetcode.com/Jaasirahamed15/",
      "https://www.hackerrank.com/profile/Jaasirahamed15",
      "https://www.codechef.com/users/jaasir15",
      "https://www.geeksforgeeks.org/user/jaasirahamed15/",
    ],
    jobTitle: "Full Stack Developer",
    worksFor: {
      "@type": "Organization",
      name: "RCK Techiees",
    },
    knowsAbout: [
      "Web Development",
      "React",
      "Next.js",
      "Node.js",
      "MongoDB",
      "Flutter",
      "IoT",
      "Python",
      "Robotics",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
