import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function HeroHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      
      // Prevent division by zero if the page isn't scrollable
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Home", "Plans", "Menu", "About", "Contact"];

  return (
    <header className="fixed top-4 md:top-6 left-0 w-full z-50 transition-all duration-300">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-red-500 z-[999] transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`
            flex items-center justify-between
            px-5 md:px-8 py-3 md:py-4
            rounded-full
            transition-all duration-500
            ${
              scrolled
                ? "bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_10px_50px_rgba(0,0,0,0.06)]"
                : "bg-transparent border border-transparent"
            }
          `}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer select-none">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold shadow-md">
              M
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-gray-900">
              Meals<span className="text-red-500">.</span>
            </h2>
          </div>

          {/* Desktop/Tablet Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((item, index) => (
              <a
                key={item}
                href="#"
                className={`
                  relative
                  group
                  font-medium
                  text-sm lg:text-base
                  transition-all
                  duration-300
                  ${index === 0 ? "text-red-600" : "text-gray-700 hover:text-red-500"}
                `}
              >
                {item}
                <span
                  className={`
                    absolute
                    left-0
                    -bottom-1
                    h-[2px]
                    bg-red-500
                    transition-all
                    duration-300
                    ${index === 0 ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                />
              </a>
            ))}
          </nav>

          {/* Desktop/Tablet CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm lg:text-base font-semibold text-gray-700 hover:text-red-500 transition-colors">
              Login
            </button>
            <button
              className="
                px-5 lg:px-7 py-2.5 lg:py-3
                text-sm lg:text-base
                rounded-full
                bg-gradient-to-r from-red-500 to-red-600
                text-white
                font-semibold
                shadow-lg shadow-red-500/20
                hover:scale-105
                hover:shadow-red-500/30
                transition-all
                duration-300
              "
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button (Visible on screens smaller than 768px) */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Open Menu"
          >
            <Menu size={26} className="text-gray-900" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown/Drawer */}
      <div
        className={`
          fixed inset-0 z-[100]
          transition-all duration-500
          ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Drawer container */}
        <div
          className={`
            absolute top-0 right-0
            h-full w-full sm:w-[350px]
            bg-white
            shadow-2xl
            p-6 sm:p-8
            flex flex-col
            transition-transform duration-500 ease-out
            ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="self-end p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close Menu"
          >
            <X size={24} />
          </button>

          {/* Nav Links */}
          <div className="mt-12 flex flex-col gap-6">
            {navLinks.map((item) => (
              <a
                key={item}
                href="#"
                onClick={() => setIsMenuOpen(false)}
                className="
                  text-lg
                  font-semibold
                  text-gray-800
                  hover:text-red-500
                  transition-colors
                  pb-2
                  border-b border-gray-50
                "
              >
                {item}
              </a>
            ))}
          </div>

          {/* Auth Action Buttons */}
          <div className="mt-auto flex flex-col gap-4">
            <button className="py-3 rounded-full border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Login
            </button>
            <button
              className="
                py-3
                rounded-full
                bg-gradient-to-r from-red-500 to-red-600
                text-white
                font-semibold
                shadow-lg shadow-red-500/20
              "
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}