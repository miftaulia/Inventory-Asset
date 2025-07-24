import { useState } from "react";
import supabase from "../../../supabaseClient";

export default function AssetDetail({ asset, onClose, onSuccess }) {
  const [jumlah, setJumlah] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePeminjaman = async () => {
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;

    const { error } = await supabase.from("peminjaman").insert({
      id_aset: asset.id,
      id_pengguna: user.id,
      jumlah,
      status: "menunggu",
    });

    if (!error) {
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-orange-100">
        <img
          src={asset.gambar || "https://via.placeholder.com/400x250?text=No+Image"}
          alt={asset.nama}
          className="h-64 w-full object-cover rounded-xl shadow mb-4"
        />

        <h3 className="text-2xl font-bold text-[#003366] mb-2">{asset.nama}</h3>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-semibold text-[#FF5003]">Keterangan:</span> {asset.keterangan || "-"}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-semibold text-[#FF5003]">Kategori:</span> {asset.kategori?.name || "-"}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-semibold text-[#FF5003]">Tersedia:</span> {asset.jumlah}
        </p>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Jumlah yang ingin dipinjam:
        </label>
        <input
          type="number"
          min="1"
          max={asset.jumlah}
          value={jumlah}
          onChange={(e) => setJumlah(Math.min(Number(e.target.value), asset.jumlah))}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8E00] focus:outline-none shadow-sm"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:text-white hover:bg-gray-500 transition"
          >
            Batal
          </button>
          <button
            onClick={handlePeminjaman}
            disabled={loading}
            className="px-4 py-2 bg-[#FF8E00] hover:bg-[#003366] text-white font-medium rounded-lg shadow-md transition"
          >
            {loading ? "Mengirim..." : "Pinjam"}
          </button>
        </div>
      </div>
    </div>
  );
}
