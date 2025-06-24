import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function Kategori() {
  const [kategori, setKategori] = useState([]);
  const navigate = useNavigate();

  const fetchKategori = async () => {
    const { data, error } = await supabase
      .from("kategori")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Gagal fetch kategori:", error);
    } else {
      setKategori(data);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Apakah kamu yakin ingin menghapus kategori ini?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("kategori")
      .delete()
      .eq("id_kategori", id);

    if (error) {
      console.error("Gagal menghapus:", error);
      alert("Gagal menghapus kategori: " + error.message);
    } else {
      fetchKategori(); // Refresh daftar
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Daftar Kategori Aset</h2>
        <Link
          to="/admin/kategori/add"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow"
        >
          + Tambah Kategori
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Nama Kategori</th>
              <th scope="col" className="px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kategori.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  Belum ada data kategori.
                </td>
              </tr>
            ) : (
              kategori.map((item) => (
                <tr
                  key={item.id_kategori}
                  className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{item.id_kategori}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4 space-x-3">
                    <Link
                      to={`/admin/kategori/edit/${item.id_kategori}`}
                      className="text-yellow-600 hover:underline text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id_kategori)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
