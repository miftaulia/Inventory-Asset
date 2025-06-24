import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";

export default function PeminjamanAset() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [jumlah, setJumlah] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchAssets = async () => {
      const { data, error } = await supabase.from("assets").select("*");
      if (!error) setAssets(data);
      setLoading(false);
    };
    fetchAssets();
  }, []);

  const handlePeminjaman = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    const { error } = await supabase.from("peminjaman").insert({
      id_aset: selectedAsset.id,
      id_pengguna: user.id,
      jumlah,
      status: "menunggu"
    });
    if (!error) {
      setSuccessMessage("Peminjaman berhasil diajukan.");
      setSelectedAsset(null);
      setJumlah(1);
    }
  };

  if (loading) return <p>Loading assets...</p>;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-bold">Peminjaman Aset</h1>

      {successMessage && (
        <div className="px-4 py-2 mb-4 text-green-700 bg-green-100 border border-green-400 rounded">
          {successMessage}
        </div>
      )}

      <table className="w-full border table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Nama</th>
            <th className="px-4 py-2 border">Kategori</th>
            <th className="px-4 py-2 border">Jumlah Tersedia</th>
            <th className="px-4 py-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td className="px-4 py-2 border">{asset.nama}</td>
              <td className="px-4 py-2 border">{asset.kategori}</td>
              <td className="px-4 py-2 border">{asset.jumlah}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => setSelectedAsset(asset)}
                  className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Pinjam
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Form */}
      {selectedAsset && (
        <div className="p-4 mt-6 bg-white border rounded shadow">
          <h2 className="mb-2 text-lg font-semibold">
            Ajukan Peminjaman: {selectedAsset.nama}
          </h2>
          <label className="block mb-2">
            Jumlah:
            <input
              type="number"
              min="1"
              max={selectedAsset.jumlah}
              value={jumlah}
              onChange={(e) => setJumlah(Number(e.target.value))}
              className="w-24 px-2 py-1 ml-2 border"
            />
          </label>
          <div className="space-x-2">
            <button
              onClick={handlePeminjaman}
              className="px-4 py-1 text-white bg-green-500 rounded hover:bg-green-600"
            >
              Kirim
            </button>
            <button
              onClick={() => setSelectedAsset(null)}
              className="px-4 py-1 bg-gray-300 rounded"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
