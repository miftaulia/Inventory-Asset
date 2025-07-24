import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../../supabaseClient";

export default function EditKategori() {
  const [name, setName] = useState("");
  const { id } = useParams(); // ini adalah id_kategori yang dikirim dari URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKategori = async () => {
      const { data, error } = await supabase
        .from("kategori")
        .select("*")
        .eq("id_kategori", id)
        .single();

      if (error) {
        console.error("Gagal fetch kategori:", error);
      } else {
        setName(data.name);
      }
    };

    fetchKategori();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("kategori")
      .update({ name })
      .eq("id_kategori", id); // Ganti ke id_kategori di sini juga!

    if (error) {
      console.error("Gagal update:", error);
      alert("Gagal update kategori: " + error.message);
    } else {
      navigate("/admin/kategori");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-base-200">
      <h2 className="text-2xl font-bold mb-6">Edit Kategori</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4 max-w-md">
        <div>
          <label className="block mb-1 font-medium">Nama Kategori</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
      </form>
    </div>
  );
}
