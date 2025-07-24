import { useState } from "react";
import LanyardGroup from "../components/magicui/LanyardGroup";
import lanyardTexture1 from "../assets/lanyard.png";
import Noise from "../components/components1/Noise";
import supabase from "../supabaseClient";

const cardImage1 = "/img/ANANTA FIRDAUS (3).png";
const cardImage2 = "/img/mifta1.png";
const cardImage3 = "/img/izazier1.png";

const lanyards = [
  { cardImage: cardImage1, lanyardTexture: lanyardTexture1, position: [-3, 2, 0] },
  { cardImage: cardImage2, lanyardTexture: lanyardTexture1, position: [0, 2, 0] },
  { cardImage: cardImage3, lanyardTexture: lanyardTexture1, position: [3, 2, 0] },
];

export default function ContactWithLanyard() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("contact_messages").insert([formData]);

    if (error) {
      console.error(error);
      setStatus("failed");
    } else {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
    setLoading(false);
  };

  return (
    <section className="relative z-10 bg-[#eeeeee] min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 p-8 mb-10 overflow-hidden">
      <Noise
        patternSize={250}
        patternScaleX={1}
        patternScaleY={1}
        patternRefreshInterval={2}
        patternAlpha={15}
        className="absolute inset-0 z-0"
      />

      {/* Kiri: Lanyard 3D */}
      <div className="w-full lg:w-1/2 z-10 -mt-90">
        <LanyardGroup items={lanyards} />
      </div>

      {/* Kanan: Contact Form */}
      <div className="w-full max-w-lg p-10 text-black rounded-xl shadow-md bg-white z-10">
        <h1 className="text-3xl text-black font-bold mb-6">Contact</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full border-b border-black outline-none py-2"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email"
            className="w-full border-b border-black outline-none py-2"
            required
          />
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            className="w-full border-b border-black outline-none py-2"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="4"
            className="w-full border-b border-black outline-none py-2"
            required
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            {loading ? "Sending..." : "Send"}
          </button>

          {status === "success" && (
            <p className="text-green-600 mt-2">✅ Message sent successfully!</p>
          )}
          {status === "failed" && (
            <p className="text-red-600 mt-2">❌ Failed to send message!</p>
          )}
        </form>
      </div>
    </section>
  );
}
