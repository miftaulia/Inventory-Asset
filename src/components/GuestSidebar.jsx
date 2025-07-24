import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LogOut,
  LayoutDashboard,
  Package,
  Archive,
  Settings,
  User,
  Eye,
  HelpCircle, 
  Mail,

} from 'lucide-react';
import supabase from '../supabaseClient';

export default function GuestSidebar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-md text-sm flex flex-col justify-between">
      <div className="px-6 py-4 font-bold text-2xl text-[#FF8E00] tracking-tight flex items-center gap-2">
  <img
    src="/img/logo-asetra-orange.png"
    alt="Logo Asetra"
    className="w-8 h-8 object-contain"
  />
  Asetra
</div>


      <div className="px-4 flex-1 overflow-auto">
        {/* Profil */}
        {user && (
          <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-100 text-sm">
            <div className="flex items-center gap-2 text-[#002347] mb-1">
              <User size={16} />
              <span className="font-semibold">
                {user.user_metadata?.nama || 'Pengguna'}
              </span>
            </div>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        )}

        {/* Menu Main */}
        <p className="text-gray-400 uppercase text-xs font-semibold mb-2">
          Main
        </p>
        <nav className="space-y-1 mb-4">
          <SidebarItem
            icon={<LayoutDashboard size={16} />}
            label="Dashboard"
            to="/guest/dashboard"
            active={location.pathname === '/guest/dashboard'}
          />
        </nav>

        {/* Menu Inventory */}
        <p className="text-gray-400 uppercase text-xs font-semibold mb-2">
          Inventory
        </p>
        <nav className="space-y-1 mb-4">
          <SidebarItem
            icon={<Archive size={16} />}
            label="Peminjaman Assets"
            to="/guest/peminjaman"
            active={location.pathname === '/guest/peminjaman'}
          />
          <SidebarItem
            icon={<Package size={16} />}
            label="Riwayat"
            to="/guest/riwayat"
            active={location.pathname === '/guest/riwayat'}
          />
          <SidebarItem
          icon={<HelpCircle size={16} />}
          label="Bantuan"
          to="/..."
          active={location.pathname === '/...'}
        />
        <SidebarItem
        icon={<Mail size={16} />}
        label="Kontak Admin"
        to="..."
        active={location.pathname === '...'}
      />

        </nav>
        {/* Lainnya */}
        <p className="text-gray-400 uppercase text-xs font-semibold mb-2">Akses Lain</p>
        <nav className="space-y-1">
          <SidebarItem
            icon={<Eye size={16} />}
            label="Lihat Sebagai Admin"
            to="/login"
            active={location.pathname === '/login'}
            
          />
          
          <SidebarItem
            icon={<Settings size={16} />}
            label="Edit Profile"
            to="/guest/edit-profile"
            active={location.pathname === '/guest/edit-profile'}
          />
        </nav>
      </div>

      {/* Logout */}
      <div className="p-5 ">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-600 transition text-sm"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, to, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
        active
          ? 'bg-[#FFF5EB] text-[#FF5003] font-semibold border border-orange-200'
          : 'text-gray-700 hover:bg-orange-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
