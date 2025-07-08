import { Link } from "react-router-dom";

export default function NavbarHero({ refs }) {
  const scrollTo = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50  flex justify-center">
      <div className="bg-white/20 border border-white/30 backdrop-blur-md shadow-lg rounded-full px-6 py-3 w-[40vw] max-w-6xl flex items-center justify-between relative">
        
        {/* Logo */}
        <div className="text-lg font-bold text-[#FF8E00] tracking-wide">
          ASETRA
        </div>

        {/* Center Nav Menu */}
        <div className="absolute left-1/2 -translate-x-1/2 flex gap-6 text-sm font-medium">
          <button
            onClick={() => scrollTo(refs?.homeRef)}
            className="text-white hover:text-[#FF5003] transition"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo(refs?.aboutRef)}
            className="text-white hover:text-[#FF5003] transition"
          >
            About
          </button>
          <button
            onClick={() => scrollTo(refs?.featuresRef)}
            className="text-white hover:text-[#FF5003] transition"
          >
            Features
          </button>
          <button
            onClick={() => scrollTo(refs?.contactRef)}
            className="text-white hover:text-[#FF5003] transition"
          >
            Contact
          </button>
        </div>

        {/* Login & Register */}
        <div className="flex gap-4 text-sm font-medium">
          <Link
            to="/login"
            className="text-white hover:text-[#FF5003] transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-white hover:text-[#FF5003] transition"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
