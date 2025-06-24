import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";

export default function PeminjamanAsetAdmin() {
  const [peminjaman, setPeminjaman] = useState([]);

  const fetchPeminjaman = async () => {
    const { data, error } = await supabase
      .from("peminjaman")
      .select("*, assets(nama, kategori: kategori_id(name))")
      .order("tanggal_pinjam", { ascending: false });

    if (error) console.error("Error fetching peminjaman:", error);
    else setPeminjaman(data);
  };

  const updateStatus = async (id, status) => {
    const updateData =
      status === "dikembalikan"
        ? { status, tanggal_kembali: new Date().toISOString() }
        : { status };

    const { error } = await supabase.from("peminjaman").update(updateData).eq("id", id);
    if (!error) fetchPeminjaman();
  };

  const formatTanggal = (tanggal) =>
    tanggal ? new Date(tanggal).toLocaleString() : "-";

  useEffect(() => {
    fetchPeminjaman();
  }, []);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-6 bg-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Manajemen Peminjaman Aset
      </h2>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Aset</th>
            <th className="px-6 py-3">Kategori</th>
            <th className="px-6 py-3">Jumlah</th>
            <th className="px-6 py-3">ID Peminjam</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Tanggal Pinjam</th>
            <th className="px-6 py-3">Tanggal Kembali</th>
            <th className="px-6 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {peminjaman.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center px-6 py-4 text-gray-500">
                Tidak ada data peminjaman.
              </td>
            </tr>
          ) : (
            peminjaman.map((item) => (
              <tr
                key={item.id}
                className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {item.assets?.nama || "-"}
                </td>
                <td className="px-6 py-4">
                  {item.assets?.kategori?.name || "Tidak diketahui"}
                </td>
                <td className="px-6 py-4">{item.jumlah}</td>
                <td className="px-6 py-4">{item.id_pengguna}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      item.status === "menunggu"
                        ? "bg-yellow-100 text-yellow-800"
                        : item.status === "disetujui"
                        ? "bg-blue-100 text-blue-800"
                        : item.status === "pengembalian"
                        ? "bg-purple-100 text-purple-800"
                        : item.status === "ditolak"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">{formatTanggal(item.tanggal_pinjam)}</td>
                <td className="px-6 py-4">{formatTanggal(item.tanggal_kembali)}</td>
                <td className="px-6 py-4 space-x-2">
                  {item.status === "menunggu" && (
                    <>
                      <button
                        onClick={() => updateStatus(item.id, "disetujui")}
                        className="text-green-600 hover:underline text-sm"
                      >
                        Setujui
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, "ditolak")}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Tolak
                      </button>
                    </>
                  )}
                  {(item.status === "disetujui" || item.status === "pengembalian") && (
                    <button
                      onClick={() => updateStatus(item.id, "dikembalikan")}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {item.status === "pengembalian"
                        ? "Konfirmasi Pengembalian"
                        : "Tandai Dikembalikan"}
                    </button>
                  )}
                  {item.status === "dikembalikan" && (
                    <span className="text-green-600 text-sm font-medium">
                      Selesai
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
