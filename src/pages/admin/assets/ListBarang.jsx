import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../../../supabaseClient";

export default function ListBarang() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Untuk pencarian

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    const { data, error } = await supabase
      .from("assets")
      .select("*, kategori: kategori_id(name)");

    if (!error) setItems(data);
  };

  // ✅ Filter berdasarkan pencarian
  const filteredItems = items.filter((item) => {
    const nama = item.nama?.toLowerCase() || "";
    const kategori = item.kategori?.name?.toLowerCase() || "";
    const jumlah = String(item.jumlah).toLowerCase();
    const keyword = searchTerm.toLowerCase();
    return nama.includes(keyword) || kategori.includes(keyword) || jumlah.includes(keyword);
  });

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">📦 Daftar Aset</h1>

        <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="🔍 Cari aset..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 text-black rounded-md text-sm w-full md:w-64"
          />
          <Link
            to="/admin/assets/add"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow"
          >
            + Tambah Aset
          </Link>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Nama</th>
              <th className="px-6 py-3">Kategori</th>
              <th className="px-6 py-3">Jumlah</th>
              <th className="px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data yang cocok.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="odd:bg-white even:bg-gray-50 border-b border-gray-200">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.nama}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {item.kategori?.name || "Tidak diketahui"}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.jumlah}</td>
                  <td className="px-6 py-4 space-x-2">
                    <Link
                      to={`/admin/assets/edit/${item.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/admin/assets/delete/${item.id}`}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Hapus
                    </Link>
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
