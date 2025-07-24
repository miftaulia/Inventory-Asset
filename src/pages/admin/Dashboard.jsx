import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Package, ClipboardList, Users, Layers, Clock, CheckCircle, Hourglass } from "lucide-react";
import {
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";


const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    orange: { bg: "bg-orange-100", iconBg: "bg-orange-500 text-white", text: "text-orange-600" },
    blue: { bg: "bg-blue-100", iconBg: "bg-blue-500 text-white", text: "text-blue-600" },
    emerald: { bg: "bg-emerald-100", iconBg: "bg-emerald-500 text-white", text: "text-emerald-600" },
    purple: { bg: "bg-purple-100", iconBg: "bg-purple-500 text-white", text: "text-purple-600" },
    yellow: { bg: "bg-yellow-100", iconBg: "bg-yellow-500 text-white", text: "text-yellow-600" },
    green: { bg: "bg-green-100", iconBg: "bg-green-500 text-white", text: "text-green-600" },
  };

  const colorClass = colors[color] || colors.orange;

  return (
    <div className={`rounded-xl p-4 shadow-md ${colorClass.bg}`}>
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-full ${colorClass.iconBg}`}>{icon}</div>
        <div className="text-right">
          <h4 className={`text-sm font-medium ${colorClass.text}`}>{title}</h4>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    assets: 0,
    borrows: 0,
    users: 0,
    kategori: 0,
    menunggu: 0,
    disetujui: 0,
    dikembalikan: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [latestBorrows, setLatestBorrows] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [assetsRes, borrowsRes, usersRes, kategoriRes, menungguRes, disetujuiRes, dikembalikanRes, latestBorrowsRes] = await Promise.all([
        supabase.from("assets").select("*", { count: "exact", head: true }),
        supabase.from("peminjaman").select("*", { count: "exact", head: true }),
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("kategori").select("*", { count: "exact", head: true }),
        supabase.from("peminjaman").select("*", { count: "exact", head: true }).eq("status", "menunggu"),
        supabase.from("peminjaman").select("*", { count: "exact", head: true }).eq("status", "disetujui"),
        supabase.from("peminjaman").select("*", { count: "exact", head: true }).eq("status", "dikembalikan"),
        supabase.from("peminjaman").select("*, assets(nama)" ).order("tanggal_pinjam", { ascending: false }).limit(5),
      ]);

      setStats({
        assets: assetsRes.count,
        borrows: borrowsRes.count,
        users: usersRes.count,
        kategori: kategoriRes.count,
        menunggu: menungguRes.count,
        disetujui: disetujuiRes.count,
        dikembalikan: dikembalikanRes.count,
      });

      setChartData([
        { name: "Aset", jumlah: assetsRes.count },
        { name: "Peminjaman", jumlah: borrowsRes.count },
        { name: "Pengguna", jumlah: usersRes.count },
        { name: "Kategori", jumlah: kategoriRes.count },
      ]);

      setLatestBorrows(latestBorrowsRes.data);
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
  <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Admin</h1>

  {/* Grid statistik */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
    <StatCard title="Total Aset" value={stats.assets} icon={<Package size={24} />} color="orange" />
    <StatCard title="Total Peminjaman" value={stats.borrows} icon={<ClipboardList size={24} />} color="blue" />
    <StatCard title="Total Pengguna" value={stats.users} icon={<Users size={24} />} color="emerald" />
    <StatCard title="Total Kategori" value={stats.kategori} icon={<Layers size={24} />} color="purple" />
    <StatCard title="Menunggu" value={stats.menunggu} icon={<Hourglass size={24} />} color="yellow" />
    <StatCard title="Disetujui" value={stats.disetujui} icon={<Clock size={24} />} color="blue" />
    <StatCard title="Dikembalikan" value={stats.dikembalikan} icon={<CheckCircle size={24} />} color="green" />
  </div>
{/* Grafik Tambahan - Status Peminjaman & Distribusi Data Utama */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

  {/* Pie Chart: Status Peminjaman */}
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">Distribusi Status Peminjaman</h2>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={[
            { name: "Menunggu", value: stats.menunggu },
            { name: "Disetujui", value: stats.disetujui },
            { name: "Dikembalikan", value: stats.dikembalikan },
          ]}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label
        >
          <Cell fill="#facc15" /> {/* Yellow */}
          <Cell fill="#60a5fa" /> {/* Blue */}
          <Cell fill="#34d399" /> {/* Green */}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* Radar Chart: Data Utama */}
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">Distribusi Data Utama</h2>
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius="80%"
        data={[
          { subject: "Aset", A: stats.assets },
          { subject: "Peminjaman", A: stats.borrows },
          { subject: "Pengguna", A: stats.users },
          { subject: "Kategori", A: stats.kategori },
        ]}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <Radar name="Jumlah" dataKey="A" stroke="#ff5003" fill="#fd7702" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  </div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Grafik Ringkasan Data */}
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">Grafik Ringkasan Data</h2>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="jumlah" fill="#003f7d" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Peminjaman Terbaru */}
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">Peminjaman Terbaru</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3 text-left">Aset</th>
            <th className="px-4 py-3 text-left">Jumlah</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Tanggal Pinjam</th>
          </tr>
        </thead>
        <tbody>
          {latestBorrows.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{item.assets?.nama || '-'}</td>
              <td className="px-4 py-2">{item.jumlah}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  item.status === "menunggu"
                    ? "bg-yellow-100 text-yellow-800"
                    : item.status === "disetujui"
                    ? "bg-blue-100 text-blue-800"
                    : item.status === "dikembalikan"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-2">{new Date(item.tanggal_pinjam).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  
</div>


</div>

  );
}
