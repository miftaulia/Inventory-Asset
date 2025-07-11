import { useRef } from "react";
import NavbarHero from "./NavbarHero";
import Hero from "./Hero";
import About from "./About"; // Buat file ini
import Features from "./Features"; // Buat file ini
// import Contact from "./Contact"; // Buat file ini
import FooterHero from "./FooterHero";
import { BlurFade } from "../components/magicui/blur-fade";
export default function LandingPage() {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const contactRef = useRef(null);

  return (
    <div className="bg-black text-white">
      <NavbarHero refs={{ homeRef, aboutRef, featuresRef, contactRef }} />

      {/* Hero Section */}
      <section ref={homeRef}>
        <Hero />
      </section>

      {/* About Section */}
      <section ref={aboutRef}>
        <About />
      </section>

      {/* Features Section */}
      <BlurFade>
        <section ref={featuresRef}>
          <Features />
        </section>
      </BlurFade>

      {/* Footer Section */}
      <FooterHero />
    </div>
  );
}
