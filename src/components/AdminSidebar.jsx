import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Archive, ClipboardList, FileText, LogOut, Eye } from 'lucide-react';
import supabase from '../supabaseClient';

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm text-sm">
      <div className="p-6 font-bold text-xl text-blue-700 tracking-tight">Admin Panel</div>

      <div className="px-4">
        <p className="text-gray-400 uppercase text-xs font-semibold mb-2">Main</p>
        <nav className="space-y-1 mb-4">
          <SidebarItem icon={<LayoutDashboard size={16} />} label="Dashboard" to="/admin/dashboard" />
        </nav>

        <p className="text-gray-400 uppercase text-xs font-semibold mb-2">Manajemen Aset</p>
        <nav className="space-y-1 mb-4">
          <SidebarItem icon={<Archive size={16} />} label="Data Aset" to="/admin/assets" />
          <SidebarItem icon={<ClipboardList size={16} />} label="Peminjaman" to="/admin/Peminjaman" />
          <SidebarItem icon={<FileText size={16} />} label="Laporan" to="/admin/Laporan" />
          <SidebarItem icon={<FileText size={16} />} label="Kategori" to="/admin/Kategori" />
          <SidebarItem icon={<FileText size={16} />} label="Kelola User" to="/admin/kelola-user" />
        </nav>

        <p className="text-gray-400 uppercase text-xs font-semibold mb-2">Akses Lain</p>
        <nav className="space-y-1">
          <SidebarItem icon={<Eye size={16} />} label="Lihat Sebagai Guest" to="/guest/dashboard" highlight />
        </nav>

        <p className="text-gray-400 uppercase text-xs font-semibold mb-2">Akses Lain</p>
        <nav className="space-y-1">
        <SidebarItem icon={<Eye size={16} />} label="Lihat Sebagai Guest" to="/guest/dashboard" highlight />
        <SidebarItem icon={<FileText size={16} />} label="Kelola FAQ" to="/admin/faq" />
        </nav>

        <hr className="my-4" />
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 transition text-sm">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, to, highlight }) {
  return (
    <Link to={to} className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100 transition ${highlight ? 'text-yellow-600 font-semibold' : 'text-gray-700'}`}>
      {icon}
      {label}
    </Link>
  );
}
