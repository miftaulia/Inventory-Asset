import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../../supabaseClient";

export default function EditBarang() {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [jumlah, setJumlah] = useState(0);
  const [keterangan, setKeterangan] = useState("");
  const [gambar, setGambar] = useState(null);
  const [kategoriList, setKategoriList] = useState([]);
  const [gambarLama, setGambarLama] = useState(null); // untuk gambar sebelumnya

  useEffect(() => {
    const fetchKategori = async () => {
      const { data } = await supabase.from("kategori").select("*");
      setKategoriList(data);
    };

    const fetchBarang = async () => {
      const { data } = await supabase
        .from("assets")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setNama(data.nama);
        setKategoriId(data.kategori_id);
        setJumlah(data.jumlah);
        setKeterangan(data.keterangan);
        setGambarLama(data.gambar); // simpan gambar lama
      }
    };

    fetchKategori();
    fetchBarang();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let gambarUrl = gambarLama;

    if (gambar) {
      const ext = gambar.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const filePath = `assets/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gambar")
        .upload(filePath, gambar);

      if (uploadError) {
        alert("Gagal upload gambar: " + uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("gambar")
        .getPublicUrl(filePath);

      gambarUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase
      .from("assets")
      .update({
        nama,
        kategori_id: kategoriId,
        jumlah,
        keterangan,
        gambar: gambarUrl,
      })
      .eq("id", id);

    if (error) {
      alert("Gagal memperbarui aset: " + error.message);
    } else {
      alert("Aset berhasil diperbarui!");
      navigate("/admin/assets");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <h1 className="text-2xl font-bold mb-6">Edit Data Aset</h1>
      <form onSubmit={handleSubmit} className="bg-gray-100 rounded-lg shadow p-6 space-y-4 max-w-md">
        <div>
          <label className="block mb-1 font-medium">Nama Barang</label>
          <input
            type="text"
            className="w-full px-3 py-2 border"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Kategori</label>
          <select
            className="w-full px-3 py-2 border"
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
            className="w-full px-3 py-2 border"
            value={jumlah}
            onChange={(e) => setJumlah(parseInt(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Keterangan</label>
          <textarea
            className="w-full px-3 py-2 border"
            rows="3"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">Gambar Baru (opsional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setGambar(e.target.files[0])}
          />
          {gambarLama && (
            <p className="text-sm mt-1">Gambar lama: <a href={gambarLama} target="_blank" rel="noreferrer" className="text-blue-500 underline">Lihat</a></p>
          )}
        </div>

        <div className="flex gap-4">
          <button type="submit" className="w-full px-4 py-2 bg-black text-white rounded hover:opacity-90">
            Simpan Perubahan
          </button>
          <button type="button" onClick={() => navigate(-1)} className="w-full px-4 py-2 bg-gray-300 text-black rounded">
            Kembali
          </button>
        </div>
      </form>
    </div>
  );
}
