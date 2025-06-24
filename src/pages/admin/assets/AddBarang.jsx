import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../supabaseClient";

export default function AddBarang() {
  const [nama, setNama] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [jumlah, setJumlah] = useState(0);
  const [kategoriList, setKategoriList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKategori = async () => {
      const { data, error } = await supabase.from("kategori").select("*");
      if (!error) setKategoriList(data);
    };
    fetchKategori();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await supabase.auth.getUser();
    const user_id = user.data.user?.id;

    const { error } = await supabase.from("assets").insert([
      {
        nama,
        kategori_id: kategoriId,
        jumlah,
        user_id,
      },
    ]);

    if (error) {
      alert("Gagal menambahkan aset: " + error.message);
    } else {
      alert("Aset berhasil ditambahkan!");
      navigate("/admin/assets");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <h1 className="text-2xl font-bold mb-6">Tambah Data Aset</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 rounded-lg shadow p-6 space-y-4 max-w-md"
      >
        <div>
          <label className="block mb-1 font-medium">Nama Barang</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Kategori</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={kategoriId}
            onChange={(e) => setKategoriId(e.target.value)}
            required
          >
            <option value="">-- Pilih Kategori --</option>
            {kategoriList.map((kat) => (
              <option key={kat.id_kategori} value={kat.id_kategori}>
                {kat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Jumlah</label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={jumlah}
            onChange={(e) => setJumlah(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-black text-white rounded hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
          >
            Kembali
          </button>
        </div>
      </form>
    </div>
  );
}
