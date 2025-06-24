import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";

export default function RiwayatPeminjaman() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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

  useEffect(() => {
    fetchRiwayat();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">📦 Riwayat Peminjaman Saya</h1>

      {message && (
        <div className="mb-4 p-4 text-sm text-green-800 rounded-lg bg-green-100 border border-green-300">
          {message}
        </div>
      )}

      {loading ? (
        <p>Loading riwayat...</p>
      ) : riwayat.length === 0 ? (
        <p className="text-gray-500">Belum ada riwayat peminjaman.</p>
      ) : (
        <div className="overflow-x-auto relative bg-white p-6 rounded-xl shadow-md">
          <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-4 py-2">Nama Aset</th>
                <th className="px-4 py-2">Kategori</th>
                <th className="px-4 py-2 text-center">Jumlah</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Tanggal Pinjam</th>
                <th className="px-4 py-2">Tanggal Kembali</th>
                <th className="px-4 py-2 text-center">Aksi</th>
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
                          : item.status === "pengembalian"
                          ? "bg-purple-600"
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
                  <td className="px-4 py-2 text-center">
                    {item.status === "disetujui" && (
                      <button
                        onClick={() => ajukanPengembalian(item.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded"
                      >
                        Ajukan Pengembalian
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
