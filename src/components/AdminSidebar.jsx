import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Archive,
  ClipboardList,
  FileText,
  LogOut,
  Eye,
  User,
  Mail,
} from "lucide-react";
import supabase from "../supabaseClient";

export default function AdminSidebar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const [messageCount, setMessageCount] = useState(0);
useEffect(() => {
  const fetchUnreadCount = async () => {
    const { count, error } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false); // ✅ Hanya pesan belum dibaca
    if (!error) setMessageCount(count || 0);
  };

  fetchUnreadCount();

  // ✅ Realtime listener jika ada pesan baru masuk
  const channel = supabase
    .channel("contact_messages")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "contact_messages" }, () => {
      fetchUnreadCount();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);


  return (
    <aside className="w-64 min-h-screen bg-[#002347] flex flex-col justify-between text-white">
      <div>
        {/* Logo & Branding */}
        <div className="px-6 py-4 font-bold text-2xl text-[#FF8E00] flex items-center gap-2">
          <img
            src="/img/logo-asetra-orange.png"
            alt="Logo Asetra"
            className="w-8 h-8 object-contain"
          />
          Admin Asetra
        </div>

        <div className="px-4">
          {/* Profil Admin */}
          {user && (
            <div className="mb-6 p-4 rounded-lg bg-[#003366] shadow-inner">
              <div className="flex items-center gap-2 mb-1">
                <User size={16} />
                <span className="font-semibold">
                  {user.user_metadata?.nama || "Admin"}
                </span>
              </div>
              <p className="text-xs text-gray-300 truncate">{user.email}</p>
            </div>
          )}

          {/* Main */}
          <p className="text-gray-300 uppercase text-xs font-semibold mb-2">
            Main
          </p>
          <nav className="space-y-1 mb-4">
            <SidebarItem
              icon={<LayoutDashboard size={16} />}
              label="Dashboard"
              to="/admin/dashboard"
              activePath={location.pathname}
            />
          </nav>

          {/* Manajemen Aset */}
          <p className="text-gray-300 uppercase text-xs font-semibold mb-2">
            Manajemen Aset
          </p>
          <nav className="space-y-1 mb-4">
            <SidebarItem
              icon={<Archive size={16} />}
              label="Data Aset"
              to="/admin/assets"
              activePath={location.pathname}
            />
            <SidebarItem
              icon={<ClipboardList size={16} />}
              label="Peminjaman"
              to="/admin/Peminjaman"
              activePath={location.pathname}
            />
            <SidebarItem
              icon={<FileText size={16} />}
              label="Laporan"
              to="/admin/Laporan"
              activePath={location.pathname}
            />
            <SidebarItem
              icon={<FileText size={16} />}
              label="Kategori"
              to="/admin/Kategori"
              activePath={location.pathname}
            />
            <SidebarItem
              icon={<FileText size={16} />}
              label="Kelola User"
              to="/admin/kelola-user"
              activePath={location.pathname}
            />
            <SidebarItem
  icon={<Mail size={16} />}
  label={
    <span className="flex items-center gap-2">
      Pesan Masuk
      {messageCount > 0 && (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {messageCount}
        </span>
      )}
    </span>
  }
  to="/admin/messages"
  activePath={location.pathname}
/>

          </nav>

          {/* Akses Lain */}
          <p className="text-gray-300 uppercase text-xs font-semibold mb-2">
            Akses Lain
          </p>
          <nav className="space-y-1">
            <SidebarItem
              icon={<Eye size={16} />}
              label="Lihat Sebagai Guest"
              to="/guest/dashboard"
              activePath={location.pathname}
            />
            <SidebarItem
              icon={<FileText size={16} />}
              label="Kelola FAQ"
              to="/admin/faq"
              activePath={location.pathname}
            />
            <SidebarItem
              icon={<User size={16} />}
              label="Edit Profil"
              to="/admin/EditProfile"
              activePath={location.pathname}
            />
          </nav>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-[#FF5003] hover:text-[#FD7702] transition text-sm"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}

// SidebarItem component
function SidebarItem({ icon, label, to, activePath }) {
  const isActive = activePath === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-2 py-2 rounded transition
        ${
          isActive
            ? "bg-[#003F7D] text-[#FF8E00] font-semibold"
            : "hover:bg-[#003F7D] text-white"
        }`}
    >
      {icon}
      {label}
    </Link>
  );
}
