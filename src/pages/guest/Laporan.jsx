import { useState } from "react";
import supabase from "../../supabaseClient";
import toast, { Toaster } from "react-hot-toast";

export default function GuestContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("contact_messages").insert([
      {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        is_read: false, // ✅ Pesan baru belum dibaca
      },
    ]);

    if (error) {
      toast.error("Gagal mengirim pesan!");
    } else {
      toast.success("Pesan berhasil dikirim!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-2xl text-black font-bold mb-4">📩 Kirim Pesan ke Admin</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border text-black border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full text-black border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Subjek</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="mt-1 block w-full border text-black border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Pesan</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            className="mt-1 block w-full text-black border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-400"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Mengirim..." : "Kirim Pesan"}
        </button>
      </form>
    </div>
  );
}
