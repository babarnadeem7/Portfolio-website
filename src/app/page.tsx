import { Hero } from "@/components/sections/hero/Hero";
import { About } from "@/components/sections/about/About";
import { Work } from "@/components/sections/work/Work";
import { Experience } from "@/components/sections/experience/Experience";
import { Skills } from "@/components/sections/skills/Skills";
import { Education } from "@/components/sections/education/Education";
import { Contact } from "@/components/sections/contact/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Work />
      <Experience />
      <Skills />
      <Education />
      <Contact />
    </>
  );
}
