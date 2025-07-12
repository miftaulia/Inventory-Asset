import ScrollReveal from "../components/magicui/text-reveal.jsx";
export default function About({ innerRef }) {
  return (
    <section
      ref={innerRef}
      className="bg-black text-white min-h-screen flex items-center justify-center px-6 lg:px-24"
    >
      <div className="flex flex-col lg:flex-row items-center gap-16 max-w-7xl w-full">
        {/* Gambar kiri */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src="/img/logo-asetra-putih.png"
            alt="ASETRA Illustration"
            className="max-w-full h-auto object-contain"
          />
        </div>

        {/* Text Scroll Reveal kanan */}
        <div className="w-full lg:w-1/2">
         <ScrollReveal
  containerClassName="text-left"
  textClassName="text-white"
  baseOpacity={0.6}
  baseRotation={20}
  blurStrength={1} // jangan 60, terlalu ekstrem
>
  ASETRA adalah sistem manajemen aset modern yang dirancang untuk memberikan kontrol penuh, transparansi, dan efisiensi dalam pelacakan aset di berbagai organisasi.
</ScrollReveal>

        </div>
      </div>
    </section>
  );
}