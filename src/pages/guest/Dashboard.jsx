import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import HeaderGuest from "../guest/HeaderGuest.jsx";
import { Loader2, PackageOpen, History } from "lucide-react";

export default function GuestDashboard() {
  const [assets, setAssets] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [jumlah, setJumlah] = useState(1);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [loadingRiwayat, setLoadingRiwayat] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAssets = async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*, kategori: kategori_id(name)");
      if (!error) setAssets(data);
      setLoadingAssets(false);
    };
    fetchAssets();
  }, []);

  useEffect(() => {
    const fetchRiwayat = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      const { data, error } = await supabase
        .from("peminjaman")
        .select("*, assets(nama, kategori: kategori_id(name))")
        .eq("id_pengguna", user.id)
        .order("tanggal_pinjam", { ascending: false });

      if (!error) {
        setRiwayat(data);
        setLoadingRiwayat(false);

        const valid = data.filter(
          (item) => item.status === "disetujui" || item.status === "dikembalikan"
        );

        const totalDipinjam = valid.reduce((sum, item) => sum + item.jumlah, 0);
        const totalKembali = valid.reduce(
          (sum, item) => sum + (item.tanggal_kembali ? item.jumlah : 0),
          0
        );

        setStats({
          totalDipinjam,
          totalKembali,
          totalBelumKembali: totalDipinjam - totalKembali,
          statusCount: {
            menunggu: data.filter((i) => i.status === "menunggu").length,
            disetujui: data.filter((i) => i.status === "disetujui").length,
            ditolak: data.filter((i) => i.status === "ditolak").length,
            dikembalikan: data.filter((i) => i.status === "dikembalikan").length,
          },
        });
      }
    };
    fetchRiwayat();
  }, []);

  const handlePeminjaman = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    const { error } = await supabase.from("peminjaman").insert({
      id_aset: selectedAsset.id,
      id_pengguna: user.id,
      jumlah,
      status: "menunggu",
    });
    if (!error) {
      setSuccessMessage("✅ Peminjaman berhasil diajukan.");
      setSelectedAsset(null);
      setJumlah(1);
    }
  };

  const filteredAssets = assets.filter((a) =>
    a.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const COLORS = ["#FBBF24", "#22C55E", "#EF4444", "#3B82F6"];

  const statusPieData = [
    { name: "Menunggu", value: stats?.statusCount.menunggu || 0 },
    { name: "Disetujui", value: stats?.statusCount.disetujui || 0 },
    { name: "Ditolak", value: stats?.statusCount.ditolak || 0 },
    { name: "Dikembalikan", value: stats?.statusCount.dikembalikan || 0 },
  ];

  return (
    <div className="bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] min-h-screen px-6 py-8 text-gray-800">
      <HeaderGuest
        title="📊 Dashboard"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        message={message}
      />

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            {
              title: "Total Dipinjam",
              icon: <PackageOpen size={20} />,
              color: "bg-orange-100 text-orange-600",
              value: stats.totalDipinjam,
            },
            {
              title: "Sudah Dikembalikan",
              icon: <PackageOpen size={20} />,
              color: "bg-green-100 text-green-600",
              value: stats.totalKembali,
            },
            {
              title: "Belum Dikembalikan",
              icon: <PackageOpen size={20} />,
              color: "bg-red-100 text-red-600",
              value: stats.totalBelumKembali,
            },
            {
              title: "Status Peminjaman",
              icon: <History size={20} />,
              color: "bg-blue-100 text-blue-600",
              isChart: true,
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl shadow-sm border border-gray-200 ${
                item.color
              } flex flex-col items-center justify-center`}
            >
              <div className="mb-2">{item.icon}</div>
              <h4 className="text-sm mb-1 font-medium text-center">{item.title}</h4>
              {item.isChart ? (
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      dataKey="value"
                      outerRadius={40}
                      innerRadius={25}
                      label
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-2xl font-bold">{item.value}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aset Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold text-orange-600 mb-4">📦 Daftar Aset</h2>

          {successMessage && (
            <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded-md shadow-sm">
              {successMessage}
            </div>
          )}

          {loadingAssets ? (
            <div className="text-center py-10">
              <Loader2 className="animate-spin mx-auto text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">Loading data aset...</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-2">Nama</th>
                    <th className="px-4 py-2">Kategori</th>
                    <th className="px-4 py-2 text-center">Tersedia</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => (
                    <tr
                      key={asset.id}
                      className="hover:bg-orange-50 transition-all duration-150 cursor-pointer"
                      onClick={() => setSelectedAsset(asset)}
                    >
                      <td className="px-4 py-2">{asset.nama}</td>
                      <td className="px-4 py-2">{asset.kategori?.name || "-"}</td>
                      <td className="px-4 py-2 text-center">{asset.jumlah}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedAsset && (
            <div className="mt-6 bg-orange-50 p-5 rounded-lg border border-orange-200">
              <h4 className="text-md font-semibold mb-2">
                Ajukan Peminjaman:{" "}
                <span className="text-orange-600">{selectedAsset.nama}</span>
              </h4>
              <input
                type="number"
                min="1"
                max={selectedAsset.jumlah}
                value={jumlah}
                onChange={(e) =>
                  setJumlah(Math.min(Number(e.target.value), selectedAsset.jumlah))
                }
                className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm mb-3"
              />
              <div className="space-x-2">
                <button
                  onClick={handlePeminjaman}
                  className="bg-orange-600 text-white text-sm px-5 py-2 rounded-md hover:bg-orange-700"
                >
                  Kirim
                </button>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="bg-gray-200 text-sm px-5 py-2 rounded-md hover:bg-gray-300"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Riwayat */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold text-orange-600 mb-4">📝 Riwayat Peminjaman</h2>

          {loadingRiwayat ? (
            <div className="text-center py-10">
              <Loader2 className="animate-spin mx-auto text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">Loading riwayat...</p>
            </div>
          ) : riwayat.length === 0 ? (
            <p className="text-gray-500">Belum ada riwayat peminjaman.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-2">Nama Aset</th>
                    <th className="px-4 py-2">Kategori</th>
                    <th className="px-4 py-2">Jumlah</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Tgl Pinjam</th>
                    <th className="px-4 py-2">Tgl Kembali</th>
                  </tr>
                </thead>
                <tbody>
                  {riwayat.map((item) => (
                    <tr key={item.id} className="hover:bg-orange-50">
                      <td className="px-4 py-2">{item.assets?.nama || "-"}</td>
                      <td className="px-4 py-2">{item.assets?.kategori?.name || "-"}</td>
                      <td className="px-4 py-2">{item.jumlah}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full text-white ${
                            item.status === "menunggu"
                              ? "bg-yellow-500"
                              : item.status === "disetujui"
                              ? "bg-green-600"
                              : item.status === "ditolak"
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {new Date(item.tanggal_pinjam).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        {item.tanggal_kembali
                          ? new Date(item.tanggal_kembali).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
