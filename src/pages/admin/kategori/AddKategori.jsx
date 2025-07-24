import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../supabaseClient";

export default function AddKategori() {
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg("Nama kategori tidak boleh kosong.");
      return;
    }

    const { error } = await supabase.from("kategori").insert([{ name }]);

    if (error) {
      console.error("Insert Error:", error);
      setErrorMsg("Gagal menambahkan kategori: " + error.message);
    } else {
      setErrorMsg("");
      navigate("/admin/kategori");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <h2 className="text-2xl font-bold mb-6">Tambah Kategori Baru</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 rounded-lg shadow p-6 space-y-4 max-w-md"
      >
        <div>
          <label className="block mb-1 font-semibold">Nama Kategori</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: Elektronik, Kendaraan"
          />
          {errorMsg && (
            <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-black text-white rounded hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
