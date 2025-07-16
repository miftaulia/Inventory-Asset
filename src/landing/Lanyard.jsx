import LanyardGroup from "../components/magicui/LanyardGroup";
import lanyardTexture1 from "../assets/lanyard.png";

const cardImage1 = "/img/logo-asetra-putih.png";
const cardImage2 = "/img/logo-nanta.png";
const cardImage3 = "/img/logo-asetra-putih.png";

const lanyards = [
  { cardImage: cardImage1, lanyardTexture: lanyardTexture1, position: [-3, 2, 0] },
  { cardImage: cardImage2, lanyardTexture: lanyardTexture1, position: [0, 2, 0] },
  { cardImage: cardImage3, lanyardTexture: lanyardTexture1, position: [3, 2, 0] },
];


export default function ContactWithLanyard(innerRef) {
  return (
    
    <section className="bg-[#eeeeee] min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 p-8">
      <div className="w-full lg:w-1/2 -mt-90 z-50">
        <LanyardGroup items={lanyards} />
      </div>

      {/* Kanan: Contact Form */}
      <div className="w-full max-w-lg  p-10 rounded-xl shadow-md">
        <h1 className="text-3xl text-black font-bold mb-6">Contact</h1>
        <form className="space-y-6">
          <input
            type="text"
            placeholder="Your name"
            className="w-full border-b border-black outline-none bg-transparent py-2 placeholder-gray-500"
          />
          <input
            type="email"
            placeholder="Your email"
            className="w-full border-b border-black outline-none bg-transparent py-2 placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="Subject"
            className="w-full border-b border-black outline-none bg-transparent py-2 placeholder-gray-500"
          />
          <textarea
            placeholder="Your Message"
            className="w-full border-b border-black outline-none bg-transparent py-2 placeholder-gray-500"
            rows="4"
          ></textarea>
          <button
            type="submit"
            className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-md"
          >
            <span>📧</span> Send
          </button>
        </form>
      </div>
    </section>
  );
}
