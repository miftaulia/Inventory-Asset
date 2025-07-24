import { useRef } from "react";
import NavbarHero from "./NavbarHero";
import Hero from "./Hero";
import About from "./About";
import Features from "./Features";
import ContactWithLanyard from "./Lanyard";
import FooterHero from "./FooterHero";
import { BlurFade } from "../components/magicui/blur-fade";
import AnimatedContent from "../components/components1/AnimatedContent";
import CurvedLoop from "../components/components1/CurvedLoop";

export default function LandingPage() {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const contactRef = useRef(null);

  return (
    <div className="bg-black text-white relative z-0 overflow-x-hidden">
      {/* Navbar */}
      <NavbarHero refs={{ homeRef, aboutRef, featuresRef, contactRef }} />

      {/* Hero Section */}
      <section ref={homeRef}>
        <Hero />
      </section>

      {/* CurvedLoop + Gradien Pemisah */}
      <section className="relative -mt-100 z-20">
        <CurvedLoop
          marqueeText="✦ Aset ✦ Sistem ✦ Tracking ✦ ASETRA ✦ Web ✦ App ✦"
          speed={1}
          curveAmount={200}
          direction="right"
          interactive={true}
          className="custom-text-style"
        />
        <div className="absolute bottom-95 w-full h-48 bg-gradient-to-b from-black via-transparent to-transparent z-10" />
      </section>

      {/* About Section */}
      <section ref={aboutRef}>
        <About />
      </section>

      {/* Features Section */}
      <BlurFade>
        <section ref={featuresRef}>
          <AnimatedContent distance={100} duration={1.3} delay={0.4}>
            <Features />
          </AnimatedContent>
        </section>
      </BlurFade>

      {/* Contact Section with Lanyard */}
      <section ref={contactRef} className="relative z-10">
        <ContactWithLanyard />
      </section>

      {/* Footer */}
      <FooterHero />
    </div>
  );
}
