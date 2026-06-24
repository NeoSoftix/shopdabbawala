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

      const progress = (window.scrollY / totalHeight) * 100;

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Home", "Plans", "Menu", "About", "Contact"];

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-red-500 z-[999]"
        style={{ width: `${scrollProgress}%` }}
      />

      <header className="fixed top-6 left-0 w-full z-50">
        <div className="max-w-[1400px] mx-auto px-5">
          <div
            className={`
              flex items-center justify-between
              px-6 lg:px-10 py-4
              rounded-full
              transition-all duration-500
              ${
                scrolled
                  ? `
                    bg-white/70
                    backdrop-blur-2xl
                    border border-white/50
                    shadow-[0_10px_50px_rgba(0,0,0,0.08)]
                  `
                  : `
                    bg-transparent
                    border border-transparent
                  `
              }
            `}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold shadow-lg">
                M
              </div>

              <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-[#111]">
                Meals<span className="text-red-500">.</span>
              </h2>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((item, index) => (
                <a
                  key={item}
                  href="#"
                  className={`
                    relative
                    font-medium
                    transition-all
                    duration-300
                    ${
                      index === 0
                        ? "text-red-600"
                        : "text-gray-800 hover:text-red-500"
                    }
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
                      ${
                        index === 0
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }
                    `}
                  />
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="font-semibold text-gray-800 hover:text-red-500 transition-colors">
                Login
              </button>

              <button
                className="
                  px-7 py-3
                  rounded-full
                  bg-gradient-to-r
                  from-red-500
                  to-red-600
                  text-white
                  font-semibold
                  shadow-lg
                  hover:scale-105
                  hover:shadow-red-300
                  transition-all
                  duration-300
                "
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden"
            >
              <Menu size={30} className="text-black" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`
          fixed inset-0 z-[100]
          transition-all duration-500
          ${
            isMenuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-md"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`
            absolute top-0 right-0
            h-full w-[300px]
            bg-white
            shadow-2xl
            p-8
            transition-transform duration-500
            ${
              isMenuOpen
                ? "translate-x-0"
                : "translate-x-full"
            }
          `}
        >
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6"
          >
            <X size={28} />
          </button>

          <div className="mt-20 flex flex-col gap-8">
            {navLinks.map((item) => (
              <a
                key={item}
                href="#"
                onClick={() => setIsMenuOpen(false)}
                className="
                  text-xl
                  font-semibold
                  text-gray-800
                  hover:text-red-500
                  transition-colors
                "
              >
                {item}
              </a>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4">
            <button className="py-3 rounded-full border border-gray-200 font-semibold">
              Login
            </button>

            <button
              className="
                py-3
                rounded-full
                bg-gradient-to-r
                from-red-500
                to-red-600
                text-white
                font-semibold
              "
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
}