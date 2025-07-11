import {
  RocketIcon,
  LightningBoltIcon,
  GearIcon,
  CalendarIcon,
  BellIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "../components/magicui/bento-grid.tsx";
import DecryptedText from "../components/magicui/DecryptedText.jsx";
import { BlurFade } from "../components/magicui/blur-fade.tsx";

export default function Features({ innerRef }) {
  const features = [
    {
      Icon: RocketIcon,
      name: "Pelacakan Aset Real-time",
      description:
        "Lacak pergerakan dan status aset secara langsung, kapan saja dan di mana saja.",
      href: "#",
      cta: "Pelajari",
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
      iconColor: "text-purple-500",
    },
    {
      Icon: GearIcon,
      name: "Manajemen Kategori",
      description:
        "Atur kategori, jenis, dan detail aset sesuai kebutuhan organisasi kamu.",
      href: "#",
      cta: "Atur Sekarang",
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
      iconColor: "text-orange-500",
    },
    {
      Icon: CalendarIcon,
      name: "Jadwal Maintenance",
      description:
        "Lihat dan atur jadwal pemeliharaan aset secara efisien dengan kalender interaktif.",
      href: "#",
      cta: "Jadwalkan",
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
      iconColor: "text-green-500",
    },
    {
      Icon: LightningBoltIcon,
      name: "Notifikasi Cerdas",
      description:
        "Dapatkan notifikasi otomatis untuk peminjaman, pengembalian, dan jadwal maintenance.",
      href: "#",
      cta: "Cek",
      className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
      iconColor: "text-yellow-500",
    },
    {
      Icon: BellIcon,
      name: "Reminder Otomatis",
      description:
        "Dapatkan pengingat otomatis untuk tindakan penting terkait aset kamu.",
      href: "#",
      cta: "Aktifkan",
      className: "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4",
      iconColor: "text-blue-500",
    },
  ];

  return (
    <section
      ref={innerRef}
      className="bg-black text-white py-20 px-6 md:px-12 lg:px-24 mb-40"
    >
      {/* Judul dengan DecryptedText */}
      <div className="flex justify-center text-center pb-12">
        <DecryptedText
          text="Fitur Unggulan ASETRA"
          speed={60}
          maxIterations={80}
          revealDirection="start"
          sequential={true}
          characters="123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+[]{}|;:',.<>?/~`"
          className="text-3xl md:text-5xl font-bold text-white"
          encryptedClassName="text-3xl md:text-5xl font-bold text-white opacity-30"
          animateOn="view"
          parentClassName="all-letters"
        />
      </div>

      {/* Bento Card Grid */}
     <BlurFade direction="up" inView delay={1.2}>
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard
          key={feature.name}
          {...feature}
          className={`bg-[#1a1a1a] hover:scale-[1.01] transition-transform duration-300 ${feature.className}`}
        />
      ))}
    </BentoGrid>
  </BlurFade>
    </section>
    
  );
}
