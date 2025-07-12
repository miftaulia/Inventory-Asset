import { useRef } from "react";
import NavbarHero from "./NavbarHero";
import Hero from "./Hero";
import About from "./About";
import Features from "./Features";
// import Contact from "./Contact";
import FooterHero from "./FooterHero";
import { BlurFade } from "../components/magicui/blur-fade";
import LanyardWrapper from "./Lanyard"; // Gunakan wrapper agar konsisten

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

      {/* Lanyard 3D Interactive Section */}
      <LanyardWrapper />

      {/* Footer Section */}
      <FooterHero />
    </div>
  );
}
