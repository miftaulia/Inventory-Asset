import LanyardGroup from "../components/magicui/LanyardGroup";
import lanyardTexture1 from "../assets/lanyard.png";
import Noise from "../components/components1/Noise";

const cardImage1 = "/img/ANANTA FIRDAUS (3).png";
const cardImage2 = "/img/mifta1.png";
const cardImage3 = "/img/izazier1.png";

const lanyards = [
  { cardImage: cardImage1, lanyardTexture: lanyardTexture1, position: [-3, 2, 0] },
  { cardImage: cardImage2, lanyardTexture: lanyardTexture1, position: [0, 2, 0] },
  { cardImage: cardImage3, lanyardTexture: lanyardTexture1, position: [3, 2, 0] },
];

export default function ContactWithLanyard() {
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
      <div className="w-full max-w-lg p-10 rounded-xl shadow-md bg-white z-10">
        <h1 className="text-3xl text-black font-bold mb-6">Contact</h1>
        <form className="space-y-6">
          <input
            type="text"
            placeholder="Your name"
            className="w-full border-b border-black outline-none bg-transparent py-2 placeholder-gray-500 text-black"
          />
          <input
            type="email"
            placeholder="Your email"
            className="w-full border-b border-black outline-none bg-transparent py-2 placeholder-gray-500 text-black"
          />
          <input
            type="text"
            placeholder="Subject"
            className="w-full border-b border-black outline-none bg-transparent py-2 placeholder-gray-500 text-black"
          />
          <textarea
            placeholder="Your Message"
            className="w-full border-b border-black outline-none bg-transparent py-2 placeholder-gray-500 text-black"
            rows="4"
          ></textarea>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-black hover:bg-gray-900 transition px-6 py-2 rounded-md text-white"
          >
             Send
          </button>
        </form>
      </div>
    </section>
  );
}
