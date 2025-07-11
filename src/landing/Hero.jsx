import { useRef } from "react";
import { Link } from "react-router-dom";
import NavbarHero from "./NavbarHero";
// import FooterHero from "./FooterHero";
import Beams from "../components/hero/Beams";
import CurvedLoop from "../components/components1/CurvedLoop";
import Noise from "../components/components1/Noise";
import VariableProximity from "../components/components1/VariableProximity";
import DecryptedText from "../components/magicui/DecryptedText.jsx";


export default function Hero() {
  const containerRef = useRef(null);
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-black text-white">
      <Noise
        patternSize={250}
        patternScaleX={1}
        patternScaleY={1}
        patternRefreshInterval={2}
        patternAlpha={15}
      />
      {/* <NavbarHero /> */}

      {/* Hero Section */}
      <div style={{ width: '100%', height: '1000px', position: 'relative' }}>
        <Beams
          beamWidth={3}
          beamHeight={15}
          beamNumber={12}
          lightColor="#FF8E00"
          speed={4}
          noiseIntensity={0}
          scale={0.2}
          rotation={30}
        />

        {/* Overlay gradasi hitam dari bawah */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* Teks di atas beam */}
        <div
          ref={containerRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <div className="block">
              <VariableProximity
                label="Kelola Aset Anda Secara"
                fromFontVariationSettings={`"wght" 400, "GRAD" 0, "YTLC" 500`}
                toFontVariationSettings={`"wght" 700, "GRAD" 100, "YTLC" 800`}
                containerRef={containerRef}
                radius={120}
                falloff="gaussian"
                className="inline-block"
              />
            </div>
            <div className="block">
              <VariableProximity
                label="Cerdas dan Terstruktur"
                fromFontVariationSettings={`"wght" 400, "GRAD" 0, "YTLC" 500`}
                toFontVariationSettings={`"wght" 700, "GRAD" 100, "YTLC" 800`}
                containerRef={containerRef}
                radius={120}
                falloff="gaussian"
                className="inline-block text-[#FF8E00]"
              />
            </div>
          </h1>

          {/* Paragraf Deskripsi */}
<DecryptedText
  text={`ASETRA hadir sebagai solusi modern untuk mengelola aset secara efisien dan terstruktur. 
  Mulai dari pencatatan, pelacakan, hingga pelaporan — semua dalam satu 
  platform yang mudah diakses dan terpercaya.`}
  speed={10}
  maxIterations={80}
  sequential={true}
  revealDirection="start"
  animateOn="view"
  className="mb-6 text-gray-300 max-w-2xl text-center text-base md:text-lg"
  encryptedClassName="text-gray-600"
  parentClassName="all-letters"
/>

        </div>
      </div>

      {/* Marquee */}
      <section className="relative -mt-100 z-10">
        <CurvedLoop
          marqueeText="✦ Aset ✦ Sistem ✦ Tracking ✦ ASETRA ✦ Web ✦ App ✦"
          speed={1}
          curveAmount={200}
          direction="right"
          interactive={true}
          className="custom-text-style"
        />
      </section>
    </div>
  );
}
