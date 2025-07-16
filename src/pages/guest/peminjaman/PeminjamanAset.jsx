import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import HeaderGuest from "../../guest/HeaderGuest.jsx";

export default function PeminjamanAset() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [jumlah, setJumlah] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAssets = async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*, kategori: kategori_id(name)");
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
      status: "menunggu",
    });

    if (!error) {
      setSuccessMessage("✅ Peminjaman berhasil diajukan.");
      setSelectedAsset(null);
      setJumlah(1);
    }
  };

  const filteredAssets = assets.filter((asset) =>
    asset.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
      <HeaderGuest
        title="📦 Peminjaman Aset"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        message={message}
      >
        
      </HeaderGuest>

      {successMessage && (
        <div className="p-4 mb-4 text-sm text-green-800 bg-green-100 border border-green-300 rounded">
          {successMessage}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-md">
        {loading ? (
          <p>Loading aset...</p>
        ) : (
          <div className="overflow-x-auto relative">
            <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Nama</th>
                  <th className="px-4 py-2">Kategori</th>
                  <th className="px-4 py-2 text-center">Tersedia</th>
                  <th className="px-4 py-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{asset.nama}</td>
                    <td className="px-4 py-2">{asset.kategori?.name || "-"}</td>
                    <td className="px-4 py-2 text-center">{asset.jumlah}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => setSelectedAsset(asset)}
                        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
                      >
                        Pinjam
                      </button>
                    </td>
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
    </div>
  );
}
