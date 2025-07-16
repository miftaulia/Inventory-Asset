import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";

export default function KelolaUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Tambahan untuk search

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("id, email, nama, role, aktif, created_at")
      .order("created_at", { ascending: false });

    if (!error) setUsers(data);
    setLoading(false);
  };

  const toggleAktif = async (id, current) => {
    await supabase.from("users").update({ aktif: !current }).eq("id", id);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Filter berdasarkan pencarian
  const filteredUsers = users.filter((user) => {
    const keyword = searchTerm.toLowerCase();
    return (
      user.email?.toLowerCase().includes(keyword) ||
      user.nama?.toLowerCase().includes(keyword) ||
      user.role?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">👤 Kelola Pengguna</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="🔍 Cari pengguna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border text-black border-gray-300 rounded-md text-sm w-full md:w-64"
            />
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-gray-500">Memuat data pengguna...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Nama</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Dibuat</th>
                  <th className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center px-6 py-4 text-gray-500">
                      Tidak ada data pengguna yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{user.email}</td>
                      <td className="px-6 py-4">{user.nama || "-"}</td>
                      <td className="px-6 py-4 capitalize">{user.role}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            user.aktif
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.aktif ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(user.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleAktif(user.id, user.aktif)}
                          className={`px-3 py-1 text-xs rounded text-white ${
                            user.aktif
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {user.aktif ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
