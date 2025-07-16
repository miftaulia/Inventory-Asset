import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import { PieChart, Pie, Tooltip } from "recharts";
import HeaderGuest from "../guest/HeaderGuest.jsx";

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

        const validDipinjam = data.filter(
          (item) => item.status === "disetujui" || item.status === "dikembalikan"
        );

        const totalDipinjam = validDipinjam.reduce((sum, item) => sum + item.jumlah, 0);
        const totalKembali = validDipinjam.reduce(
          (sum, item) => sum + (item.tanggal_kembali ? item.jumlah : 0),
          0
        );
        const totalBelumKembali = totalDipinjam - totalKembali;

        setStats({
          totalDipinjam,
          totalKembali,
          totalBelumKembali,
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

  const statusPieData = [
    {
      name: "Menunggu",
      value: riwayat.filter((item) => item.status === "menunggu").length,
      fill: "#facc15",
    },
    {
      name: "Disetujui",
      value: riwayat.filter((item) => item.status === "disetujui").length,
      fill: "#22c55e",
    },
    {
      name: "Ditolak",
      value: riwayat.filter((item) => item.status === "ditolak").length,
      fill: "#ef4444",
    },
    {
      name: "Dikembalikan",
      value: riwayat.filter((item) => item.status === "dikembalikan").length,
      fill: "#3b82f6",
    },
  ];

  const filteredAssets = assets.filter((asset) =>
    asset.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
      <HeaderGuest
        title="📊 Dashboard Guest"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        message={message}
      >
        
      </HeaderGuest>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h4 className="text-sm text-gray-500 mb-1">Total Dipinjam</h4>
            <p className="text-2xl font-bold text-blue-600">{stats.totalDipinjam}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h4 className="text-sm text-gray-500 mb-1">Sudah Dikembalikan</h4>
            <p className="text-2xl font-bold text-green-600">{stats.totalKembali}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h4 className="text-sm text-gray-500 mb-1">Belum Dikembalikan</h4>
            <p className="text-2xl font-bold text-red-500">{stats.totalBelumKembali}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center justify-center">
            <h4 className="text-sm text-gray-500 mb-2">Status Peminjaman</h4>
            <PieChart width={160} height={160}>
              <Pie
                dataKey="value"
                data={statusPieData}
                cx="50%"
                cy="50%"
                outerRadius={55}
                label
              />
              <Tooltip />
            </PieChart>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daftar Aset */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Daftar Aset Tersedia</h2>

          {successMessage && (
            <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-100">
              {successMessage}
            </div>
          )}

          {loadingAssets ? (
            <p>Loading aset...</p>
          ) : (
            <div className="overflow-x-auto relative">
              <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Nama</th>
                    <th className="px-4 py-2">Kategori</th>
                    <th className="px-4 py-2 text-center">Tersedia</th>
                    {/* <th className="px-4 py-2 text-center">Aksi</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{asset.nama}</td>
                      <td className="px-4 py-2">{asset.kategori?.name || "-"}</td>
                      <td className="px-4 py-2 text-center">{asset.jumlah}</td>
                      {/* <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => setSelectedAsset(asset)}
                          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                          Pinjam
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedAsset && (
            <div className="mt-6 p-6 bg-blue-50 border border-blue-300 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">
                Ajukan Peminjaman: {selectedAsset.nama}
              </h3>
              <div className="mb-4">
                <label className="block mb-1">Jumlah</label>
                <input
                  type="number"
                  min="1"
                  max={selectedAsset.jumlah}
                  value={jumlah}
                  onChange={(e) =>
                    setJumlah(Math.min(Number(e.target.value), selectedAsset.jumlah))
                  }
                  className="w-24 px-3 py-2 border rounded-md text-sm"
                />
              </div>
              <div className="space-x-3">
                <button
                  onClick={handlePeminjaman}
                  className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Kirim
                </button>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="text-gray-800 bg-gray-200 hover:bg-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Riwayat Peminjaman */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Riwayat Peminjaman</h2>

          {loadingRiwayat ? (
            <p>Loading riwayat...</p>
          ) : riwayat.length === 0 ? (
            <p className="text-gray-500">Belum ada riwayat peminjaman.</p>
          ) : (
            <div className="overflow-x-auto relative">
              <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Nama Aset</th>
                    <th className="px-4 py-2">Kategori</th>
                    <th className="px-4 py-2">Jumlah</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Tanggal Pinjam</th>
                    <th className="px-4 py-2">Tanggal Kembali</th>
                  </tr>
                </thead>
                <tbody>
                  {riwayat.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{item.assets?.nama || "-"}</td>
                      <td className="px-4 py-2">{item.assets?.kategori?.name || "-"}</td>
                      <td className="px-4 py-2 text-center">{item.jumlah}</td>
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
                        {new Date(item.tanggal_pinjam).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        {item.tanggal_kembali
                          ? new Date(item.tanggal_kembali).toLocaleString()
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
