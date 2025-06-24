import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../../../supabaseClient";

export default function EditBarang() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    kategori_id: "",
    jumlah: 0,
  });
  const [kategoriList, setKategoriList] = useState([]);

  useEffect(() => {
    // Fetch data barang
    const fetchBarang = async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("id", id)
        .single();

      if (data) setFormData(data);
    };

    // Fetch list kategori
    const fetchKategori = async () => {
      const { data } = await supabase.from("kategori").select("*");
      setKategoriList(data || []);
    };

    fetchBarang();
    fetchKategori();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("assets")
      .update({
        nama: formData.nama,
        kategori_id: formData.kategori_id,
        jumlah: parseInt(formData.jumlah),
      })
      .eq("id", id);

    if (!error) {
      alert("Data berhasil diperbarui!");
      navigate("/admin/assets");
    } else {
      alert("Gagal update aset: " + error.message);
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded shadow min-h-screen">
      <h2 className="mb-4 text-xl font-bold text-black">Edit Barang</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        <div>
          <label className="block mb-1 font-medium">Nama Barang</label>
          <input
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Nama Barang"
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Kategori</label>
          <select
            name="kategori_id"
            value={formData.kategori_id}
            onChange={handleChange}
            className="w-full p-2 border rounded text-black"
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
            name="jumlah"
            type="number"
            value={formData.jumlah}
            onChange={handleChange}
            placeholder="Jumlah"
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 font-medium text-white bg-black rounded hover:bg-gray-800"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
