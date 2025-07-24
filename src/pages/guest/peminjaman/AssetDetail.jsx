// components/AssetDetail.jsx
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
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <img
        src={asset.gambar || "https://via.placeholder.com/400x250?text=No+Image"}
        alt={asset.nama}
        className="h-80 w-full object-cover"
      />
        <h3 className="text-xl font-semibold mb-2">{asset.nama}</h3>
        <p className="text-gray-500 mb-4">keterangan: {asset.keterangan || "-"}</p>
        <p className="text-gray-500 mb-2">Kategori: {asset.kategori?.name || "-"}</p>
        <p className="text-gray-500 mb-4">Tersedia: {asset.jumlah}</p>

        <label className="block mb-2">Jumlah yang ingin dipinjam:</label>
        <input
          type="number"
          min="1"
          max={asset.jumlah}
          value={jumlah}
          onChange={(e) =>
            setJumlah(Math.min(Number(e.target.value), asset.jumlah))
          }
          className="w-full px-3 py-2 mb-4 border rounded-md"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Batal
          </button>
          <button
            onClick={handlePeminjaman}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            {loading ? "Mengirim..." : "Pinjam"}
          </button>
        </div>
      </div>
    </div>
  );
}
