import { Link } from "react-router-dom";

export default function FooterHero() {
  return (
    <footer className="bg-[#0f0f13] text-white pt-20 pb-10 mt-[-100px]">
      {/* Footer Content */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 px-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FF8E00] mb-4">ASETRA</h1>
          <p className="text-white/70 text-sm mb-6">
            Aplikasi Sistem Manajemen Inventaris Aset berbasis web. Membantu Anda melacak, mengelola, dan meminjam aset dengan lebih efisien.
          </p>
          <h6 className="text-lg font-semibold mb-2">Dapatkan info terbaru</h6>
          <div className="flex gap-2">
            <input
              type="text"
              className="bg-[#1c1c22] px-4 py-2 rounded-md text-sm w-full placeholder:text-white/50"
              placeholder="Alamat email"
            />
            <button className="bg-[#FF8E00] hover:bg-[#FF7003] text-white px-4 py-2 rounded-md text-sm">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-white/50 mt-2">Privasi Anda terjaga, tidak ada spam.</p>
        </div>

        <div>
          <h6 className="text-lg font-semibold mb-4">Navigasi</h6>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
            <li><Link to="/register" className="hover:text-white">Register</Link></li>
            <li><a href="#features" className="hover:text-white">Fitur</a></li>
            <li><a href="#contact" className="hover:text-white">Kontak</a></li>
          </ul>
        </div>

        <div>
          <h6 className="text-lg font-semibold mb-4">Informasi</h6>
          <ul className="space-y-2 text-sm text-white/70">
            <li><a href="#" className="hover:text-white">Tentang ASETRA</a></li>
            <li><a href="#" className="hover:text-white">Kebijakan Privasi</a></li>
            <li><a href="#" className="hover:text-white">Syarat & Ketentuan</a></li>
          </ul>
        </div>

        <div>
          <h6 className="text-lg font-semibold mb-4">Kontak Kami</h6>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Email: support@asetra.com</li>
            <li>Telp: +62 812 3456 7890</li>
            <li>Alamat: Pekanbaru, Riau, Indonesia</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-white/50 mt-10 text-sm border-t border-white/10 pt-6 px-4">
        © 2025 ASETRA. All rights reserved.
      </div>
    </footer>
  );
}
