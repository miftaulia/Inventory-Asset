import { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setNama(user?.user_metadata?.nama || '');
        setEmail(user?.email || '');
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const handleUpdate = async () => {
    // Update di auth
    const { error: authError } = await supabase.auth.updateUser({
      email,
      data: { nama }
    });

    // Update di tabel users
    const { error: dbError } = await supabase
      .from("users")
      .update({ nama, email })
      .eq("id", user.id);

    if (authError || dbError) {
      alert('Gagal update profil.');
    } else {
      setSuccessMsg('Profil berhasil diperbarui!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profil</h2>

        {loading ? (
          <p className="text-gray-500">Memuat data pengguna...</p>
        ) : (
          <>
            {successMsg && (
              <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-sm font-medium">
                {successMsg}
              </div>
            )}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full text-black px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-black shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>

              <div>
                <button
                  onClick={handleUpdate}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
