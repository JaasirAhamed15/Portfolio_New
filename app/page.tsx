import Navbar from "@/components/Navbar";
import Home from "@/components/Home";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Cert from "@/components/Cert";
import Projects from "@/components/Projects";
import Leetcode from "@/components/Leetcode";
import Footer from "@/components/Footer";
import { getPortfolioData } from "@/lib/portfolio-storage";

// Force dynamic rendering so updates to portfolio-data.json are rendered immediately
export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getPortfolioData();

  return (
    <main className="bg-[#171d32] h-auto w-full overflow-x-hidden">
      <Navbar />
      <Home hero={data.hero} />
      <About about={data.about} resumeUrl={data.hero.resumeUrl} />
      <Skills skills={data.skills} education={data.education} />
      <Services services={data.services} />
      <Experience experiences={data.experiences} />
      <Cert certificates={data.certificates} />
      <Projects projects={data.projects} />
      <Leetcode />
      <Footer contact={data.about.contact} />
    </main>
  );
}
