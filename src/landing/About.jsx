import TextReveal from "../components/magicui/text-reveal.tsx";

export default function About({ innerRef }) {
  return (
    <section
      ref={innerRef}
      className="bg-black text-white relative min-h-[200vh]"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center px-6 lg:px-24">
        <div className="flex flex-col lg:flex-row items-center gap-22 max-w-9xl w-full">
          {/* Gambar di kiri */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src="public/img/logo-asetra-putih.png" // ganti sesuai gambar kamu
              alt="ASETRA Illustration"
              className="max-w-full h-auto object-contain"
            />
          </div>

          {/* TextReveal di kanan */}
          <div className="w-full lg:w-1/2">
            <TextReveal>
              ASETRA adalah sistem manajemen aset modern yang dirancang untuk memberikan kontrol penuh, transparansi, dan efisiensi dalam pelacakan aset di berbagai organisasi.
            </TextReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
