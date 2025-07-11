import {
  RocketIcon,
  LightningBoltIcon,
  GearIcon,
  CalendarIcon,
  BellIcon,
  
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "../components/magicui/bento-grid.tsx";

export default function Features({ innerRef }) {
  const features = [
    {
      Icon: RocketIcon,
      name: "Pelacakan Aset Real-time",
      description:
        "Lacak pergerakan dan status aset secara langsung, kapan saja dan di mana saja.",
      href: "#",
      cta: "Pelajari",
      background: (
        <div className="absolute inset-0 " />
      ),
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
      background: (
        <div className="absolute inset-0  /5" />
      ),
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
      background: (
        <div className="absolute inset-0  " />
      ),
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
      background: (
        <div className="absolute inset-0  " />
      ),
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
      background: (
        <div className="absolute inset-0  " />
      ),
      className: "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4",
            iconColor: "text-blue-500",

    },
  ];

  return (
    <section
      ref={innerRef}
      className="bg-black text-white py-20 px-6 md:px-12 lg:px-24 pb-40"
    >
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
        Fitur Unggulan ASETRA
      </h2>

      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard
            key={feature.name}
            {...feature}
            className={`bg-[#1a1a1a] hover:scale-[1.01] transition-transform duration-300 ${feature.className}`}
          />
        ))}
      </BentoGrid>
    </section>
  );
}
