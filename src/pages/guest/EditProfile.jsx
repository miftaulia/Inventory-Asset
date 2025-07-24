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
    const { error: authError } = await supabase.auth.updateUser({
      email,
      data: { nama }
    });

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
    <div className="min-h-screen bg-[#F5F7FA] p-6 text-[#002347]">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-[#003366]/20">
        <h2 className="text-2xl font-bold text-[#003F7D] mb-6 border-b pb-2">Edit Profil</h2>

        {loading ? (
          <p className="text-[#003366]">Memuat data pengguna...</p>
        ) : (
          <>
            {successMsg && (
              <div className="mb-4 p-3 rounded bg-[#DFF5E1] text-[#1A7F37] text-sm font-medium shadow">
                {successMsg}
              </div>
            )}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#003366] mb-1">Nama</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full text-[#002347] px-4 py-2 border border-[#003F7D]/40 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF8E00]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#003366] mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-[#002347] px-4 py-2 border border-[#003F7D]/40 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF8E00]"
                />
              </div>

              <div>
                <button
                  onClick={handleUpdate}
                  className="w-full py-2 px-4 bg-[#FD7702] hover:bg-[#003f7d] text-white rounded-lg font-semibold shadow transition-all"
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
