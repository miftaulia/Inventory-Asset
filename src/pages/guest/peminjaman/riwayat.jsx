import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import HeaderGuest from "../../guest/HeaderGuest.jsx";

export default function RiwayatPeminjaman() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRiwayat = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    const { data, error } = await supabase
      .from("peminjaman")
      .select("*, assets(nama, kategori: kategori_id(name))")
      .eq("id_pengguna", user.id)
      .order("tanggal_pinjam", { ascending: false });

    if (!error) setRiwayat(data);
    setLoading(false);
  };

  const ajukanPengembalian = async (id) => {
    const { error } = await supabase
      .from("peminjaman")
      .update({ status: "pengembalian" })
      .eq("id", id);

    if (!error) {
      setMessage("✅ Pengajuan pengembalian berhasil dikirim.");
      fetchRiwayat();
    }
  };

  const hapusPeminjaman = async (id) => {
    const konfirmasi = confirm("Yakin ingin menghapus peminjaman ini?");
    if (!konfirmasi) return;

    const { error } = await supabase.from("peminjaman").delete().eq("id", id);

    if (error) {
      console.error("Gagal menghapus:", error.message);
      setMessage("❌ Gagal menghapus: " + error.message);
    } else {
      setMessage("🗑️ Data berhasil dihapus.");
      fetchRiwayat();
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const filteredRiwayat = riwayat.filter((item) =>
    item.assets?.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#F9FAFC] min-h-screen text-gray-800 font-sans">
      <HeaderGuest
        title="📦 Riwayat Peminjaman Saya"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        message={message}
      />

      {message && (
        <div className="mb-4 p-4 text-sm text-green-800 rounded-md bg-green-100 border border-green-300 shadow-sm">
          {message}
        </div>
      )}

      {loading ? (
        <p>Loading riwayat...</p>
      ) : filteredRiwayat.length === 0 ? (
        <p className="text-gray-500">Belum ada riwayat peminjaman.</p>
      ) : (
        <div className="overflow-x-auto bg-white p-6 rounded-2xl shadow-md">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-[#FF8E00]/10 text-orange-700">
              <tr>
                <th className="px-4 py-3">Nama Aset</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3 text-center">Jumlah</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tgl Pinjam</th>
                <th className="px-4 py-3">Tgl Kembali</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRiwayat.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-orange-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">
                    {item.assets?.nama || "-"}
                  </td>
                  <td className="px-4 py-3">{item.assets?.kategori?.name || "-"}</td>
                  <td className="px-4 py-3 text-center">{item.jumlah}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold text-white shadow-sm ${
                        item.status === "menunggu"
                          ? "bg-yellow-500"
                          : item.status === "disetujui"
                          ? "bg-green-600"
                          : item.status === "ditolak"
                          ? "bg-red-500"
                          : item.status === "pengembalian"
                          ? "bg-purple-600"
                          : "bg-blue-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(item.tanggal_pinjam).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {item.tanggal_kembali
                      ? new Date(item.tanggal_kembali).toLocaleString()
                      : "-"}
                  </td>
                 <td className="px-4 py-2 text-center space-y-1">
                    {item.status === "disetujui" && (
                      <button
                        onClick={() => ajukanPengembalian(item.id)}
                        className="bg-blue-900 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded-lg block w-full"
                      >
                        Ajukan Pengembalian
                      </button>
                    )}
                    {(item.status === "ditolak" ||
                      item.status === "dikembalikan") && (
                      <button
                        onClick={() => hapusPeminjaman(item.id)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-lg transition"
                      >
                        Hapus
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
