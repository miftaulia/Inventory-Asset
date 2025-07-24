import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";

export default function KelolaUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  
  // Daftar role yang tersedia (disesuaikan dengan sistem Anda)
  const availableRoles = ['admin', 'guest', 'moderator'];

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

  // ✅ Fungsi untuk mengubah role user dengan sinkronisasi auth
  const updateRole = async (userId, newRole) => {
    try {
      // 1. Update role di tabel users
      const { error: dbError } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", userId);

      if (dbError) {
        console.error("Error updating role in database:", dbError);
        alert("Gagal mengubah role di database");
        return;
      }

      // 2. Ambil user yang akan diupdate
      const userToUpdate = users.find(user => user.id === userId);
      
      // 3. Update user_metadata di Supabase Auth jika user sedang login
      try {
        // Cari user di auth berdasarkan email
        const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
        
        if (listError) {
          console.error("Error listing users:", listError);
        } else {
          const authUser = authUsers.users.find(u => u.email === userToUpdate.email);
          
          if (authUser) {
            // Update user metadata di auth
            const { error: authError } = await supabase.auth.admin.updateUserById(
              authUser.id, 
              {
                user_metadata: { 
                  ...authUser.user_metadata,
                  role: newRole 
                }
              }
            );
            
            if (authError) {
              console.error("Error updating auth metadata:", authError);
              // Tidak perlu alert karena database sudah terupdate
            }
          }
        }
      } catch (authError) {
        console.error("Auth update error:", authError);
        // Database tetap terupdate, hanya auth metadata yang gagal
      }

      // 4. Update state lokal untuk perubahan langsung di UI
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      setEditingRole(null);
      
      // 5. Tampilkan notifikasi sukses
      alert(`Role berhasil diubah ke ${newRole}. User perlu login ulang untuk melihat perubahan tampilan.`);
      
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat mengubah role");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter berdasarkan pencarian
  const filteredUsers = users.filter((user) => {
    const keyword = searchTerm.toLowerCase();
    return (
      user.email?.toLowerCase().includes(keyword) ||
      user.nama?.toLowerCase().includes(keyword) ||
      user.role?.toLowerCase().includes(keyword)
    );
  });

  // ✅ Komponen untuk dropdown role
  const RoleSelector = ({ user }) => {
    if (editingRole === user.id) {
      return (
        <div className="flex items-center gap-2">
          <select
            value={user.role}
            onChange={(e) => updateRole(user.id, e.target.value)}
            className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            autoFocus
          >
            {availableRoles.map(role => (
              <option key={role} value={role}>
                {role === 'guest' ? 'Guest' : role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={() => setEditingRole(null)}
            className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
            title="Batal"
          >
            ✕
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <span 
          className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer hover:opacity-75 transition-opacity ${
            user.role === 'admin' 
              ? 'bg-purple-100 text-purple-800' 
              : user.role === 'moderator'
              ? 'bg-blue-100 text-blue-800'
              : user.role === 'guest'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
          onClick={() => setEditingRole(user.id)}
          title="Klik untuk mengubah role"
        >
          {user.role === 'guest' ? 'Guest' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
        <button
          onClick={() => setEditingRole(user.id)}
          className="px-1 py-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
          title="Edit role"
        >
          ✏️
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">👤 Kelola Pengguna</h2>
            <p className="text-sm text-gray-600 mt-1">
              Kelola role dan status pengguna dalam sistem
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="🔍 Cari pengguna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border text-black border-gray-300 rounded-md text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Catatan:</strong> Ketika mengubah role pengguna, user perlu login ulang untuk melihat perubahan tampilan dashboard.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center text-gray-500">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memuat data pengguna...
            </div>
          </div>
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
                    <td colSpan={6} className="text-center px-6 py-8 text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                        </svg>
                        <p>Tidak ada data pengguna yang cocok dengan pencarian.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="odd:bg-white even:bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{user.email}</td>
                      <td className="px-6 py-4">{user.nama || "-"}</td>
                      <td className="px-6 py-4">
                        <RoleSelector user={user} />
                      </td>
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
                        {new Date(user.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleAktif(user.id, user.aktif)}
                          className={`px-3 py-1 text-xs rounded text-white transition-colors ${
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