import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import PersonalAI from "@/components/PersonalAI";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
import Achievements from "@/components/Achievements";
import LearningJourney from "@/components/LearningJourney";
import Resume from "@/components/Resume";
import GitHubSection from "@/components/GitHubSection";
import ProfessionalProfiles from "@/components/ProfessionalProfiles";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <PersonalAI />
      <Education />
      <Experience />
      <Projects />
      <Skills />
      <Certifications />
      <GitHubSection />
      <Achievements />
      <LearningJourney />
      <Resume />
      <ProfessionalProfiles />
      <Contact />
      <Footer />
    </main>
  );
}
