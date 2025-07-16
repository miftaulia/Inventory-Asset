import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogOut,
  LayoutDashboard,
  Package,
  Archive,
  Layers,
  Boxes,
  Barcode,
  QrCode,
  Settings,
  User
} from 'lucide-react';
import supabase from '../supabaseClient';

export default function GuestSidebar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm text-sm flex flex-col justify-between">
      <div className="p-6 font-bold text-xl text-orange-600 tracking-tight">Asetra</div>

      <div className="px-4 flex-1 overflow-auto">
        {/* Profil Section */}
        {user && (
          <div className="mb-6 p-4 rounded-lg bg-gray-50 shadow-inner">
            <div className="flex items-center gap-2 text-gray-800 mb-1">
              <User size={16} />
              <span className="font-semibold">{user.user_metadata?.nama || 'Pengguna'}</span>
            </div>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        )}

        <p className="text-gray-400 uppercase text-xs font-semibold mb-2">Main</p>
        <nav className="space-y-1 mb-4">
          <SidebarItem icon={<LayoutDashboard size={16} />} label="Dashboard" to="/guest/dashboard" />
        </nav>

        <p className="text-gray-400 uppercase text-xs font-semibold mb-2">Inventory</p>
        <nav className="space-y-1 mb-4">
          <SidebarItem icon={<Archive size={16} />} label="peminjaman" to="/guest/peminjaman" />
          <SidebarItem icon={<Package size={16} />} label="Riwayat" to="/guest/riwayat" />
          <SidebarItem icon={<Settings size={16} />} label="Edit Profile" to="/guest/edit-profile" />
          {/* <SidebarItem icon={<Layers size={16} />} label="Category" to="/guest/category" />
          <SidebarItem icon={<Boxes size={16} />} label="Brands" to="/guest/brands" />
          <SidebarItem icon={<Barcode size={16} />} label="Print Barcode" to="/guest/print-barcode" />
          <SidebarItem icon={<QrCode size={16} />} label="Print QR Code" to="/guest/print-qr" /> */}
        </nav>

        {/* <p className="text-gray-400 uppercase text-xs font-semibold mb-2">Stock</p>
        <nav className="space-y-1">
          <SidebarItem icon={<Package size={16} />} label="Manage Stock" to="/guest/stock/manage" />
          <SidebarItem icon={<Settings size={16} />} label="Stock Adjustment" to="/guest/stock/adjustment" />
          <SidebarItem icon={<Settings size={16} />} label="Stock Transfer" to="/guest/stock/transfer" />
        </nav> */}
      </div>

      <div className="p-4">
        <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 hover:text-red-700 transition text-sm">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, to, highlight }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100 transition ${
        highlight ? 'text-yellow-600 font-semibold' : 'text-gray-700'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
