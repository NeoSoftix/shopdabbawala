import { useEffect, useState } from "react";
import { Menu, X, LogOut, User, ChevronDown } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
// Agar aap Vite ya standard React setup use kar rahe hain, toh logo ko aise import karein:
import logoImg from "/logo.png"; // Apne folder structure ke hisaab se path sahi kar lein
import UserLogin from "./UserLogin";
import UserProfileEdit from "./UserProfileEdit";

export default function HeroHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [location]);

  const isLinkActive = (link) => {
    if (link.isRouterLink) {
      if (link.to === "/") {
        return location.pathname === "/" && !activeHash;
      }
      return location.pathname === link.to;
    }
    return activeHash === link.href || (!activeHash && link.href === "#home");
  };

  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Home", to: "/", isRouterLink: true },
    ...(user ? [{ label: "Dashboard", to: "/dashboard", isRouterLink: true }] : []),
    { label: "Plans", href: "#plans" },
    { label: "Menu", href: "#menu" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollToPackages = () => {
    const section = document.getElementById("plans");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-[100%] z-50 transition-all duration-500 ease-in-out">
      {/* Premium Minimal Progress Bar */}
      <div
        className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-red-500 via-rose-600 to-red-600 z-[999] transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <div>
        <div
          className={`
            flex items-center justify-between
            py-2 md:py-2 px-6 md:px-10
            transition-all duration-500 ease-in-out
            ${
              scrolled
                ? "bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.05)]"
                : "bg-transparent border border-transparent"
            }
          `}
        >
          {/* Logo Brand Block (Updated with Image) */}
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer select-none group">
            <img 
              src={logoImg} 
              alt="Meals Logo" 
              className="h-10 w-auto object-cover transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {links.map((link, index) => {
              const active = isLinkActive(link);
              const activeClass = active
                ? "text-red-600 font-extrabold"
                : scrolled
                  ? "text-slate-600 hover:text-red-600"
                  : "text-slate-800 md:text-slate-900 lg:text-slate-900 hover:text-red-500";
              const commonProps = {
                key: link.label,
                className: `relative font-bold text-xs lg:text-sm uppercase tracking-widest transition-colors duration-300 group py-1 ${activeClass}`
              };

              const indicator = (
                <span
                  className={`
                    absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-red-600 transition-all duration-300 rounded-full
                    ${active ? "w-6" : "w-0 group-hover:w-6"}
                  `}
                />
              );

              if (link.isRouterLink) {
                return (
                  <Link to={link.to} {...commonProps}>
                    {link.label}
                    {indicator}
                  </Link>
                );
              }

              return (
                <a href={link.href} {...commonProps}>
                  {link.label}
                  {indicator}
                </a>
              );
            })}
          </nav>

          {/* Right Action Trigger Deck */}
          <div className="hidden md:flex items-center gap-5 lg:gap-7">
            {user ? (
              <div className="relative flex items-center gap-2">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-85 transition-opacity duration-200"
                >
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={`text-xs font-bold ${scrolled ? "text-slate-800" : "text-slate-900"}`}>
                      {user.name?.split(" ")[0] || (user.phone ? `***${user.phone.slice(-4)}` : "User")}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider flex items-center gap-0.5">
                      Account <ChevronDown size={10} />
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu Container */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <>
                      {/* Click outside backdrop */}
                      <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-12 z-50 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-2"
                      >
                        <Link
                          to="/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User size={14} /> My Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setIsProfileOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors text-left"
                        >
                          👤 Edit Profile
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            logout();
                            navigate("/");
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50/50 transition-colors text-left"
                        >
                          <LogOut size={14} /> Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <button onClick={() => setIsLoginOpen(true)} className={`text-xs lg:text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${scrolled ? "text-slate-600 hover:text-red-600" : "text-slate-900 hover:text-red-500"}`}>
                  Login
                </button>
                <button
                  className="
                    px-6 lg:px-8 py-2.5 lg:py-3
                    text-xs lg:text-sm uppercase tracking-widest font-black
                    rounded-full bg-red-600 text-white
                    shadow-md shadow-red-600/10
                    hover:bg-red-700 hover:scale-[1.04] hover:shadow-lg hover:shadow-red-600/20
                    active:scale-[0.98]
                    transition-all duration-300
                  "
                  onClick={scrollToPackages}
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburguer Control Icon */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`md:hidden p-1.5 rounded-full transition-colors ${scrolled ? "hover:bg-slate-100 text-slate-900" : "hover:bg-white/10 text-white"}`}
            aria-label="Open Menu"
          >
            <Menu size={22} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* ================= MODERN SIDE OVERLAY DRAWER (MOBILE MODE) ================= */}
      <div className={`fixed inset-0 z-[1000] transition-all duration-500 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        {/* Blurry Backdrop */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />

        {/* Drawer Window Panel */}
        <div
          className={`
            absolute top-0 right-0
            h-full w-[290px] sm:w-[340px]
            bg-white shadow-[0_0_50px_rgba(0,0,0,0.15)]
            p-6 flex flex-col justify-between
            transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)
            ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* Drawer Top Header Row (Updated with Image) */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <img 
                src={logoImg} 
                alt="Meals Logo" 
                className="h-8 w-auto object-contain" 
              />
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-full transition-colors">
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Menu Core Links Stack */}
          <div className="flex flex-col gap-1.5 my-auto">
            {links.map((link, index) => {
              const active = isLinkActive(link);
              const activeClass = active ? "bg-red-50 text-red-600 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900";
              const commonProps = {
                key: link.label,
                onClick: () => setIsMenuOpen(false),
                className: `text-sm font-bold uppercase tracking-widest px-4 py-3.5 rounded-xl transition-all ${activeClass}`
              };

              if (link.isRouterLink) {
                return (
                  <Link to={link.to} {...commonProps}>
                    {link.label}
                  </Link>
                );
              }

              return (
                <a href={link.href} {...commonProps}>
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Bottom Call to Action Triggers */}
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold bg-slate-50 text-slate-800 border border-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <User size={16} /> My Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                    navigate("/");
                  }}
                  className="w-full py-3.5 rounded-xl text-xs uppercase tracking-widest font-black bg-red-50 text-red-600 shadow-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setIsMenuOpen(false); setIsLoginOpen(true); }} className="w-full py-3.5 rounded-xl text-xs text-center uppercase tracking-widest font-bold text-slate-700 hover:bg-slate-50 border border-slate-200 transition-all block">
                  Login
                </button>
                <button className="w-full py-3.5 rounded-xl text-xs uppercase tracking-widest font-black bg-red-600 text-white shadow-md shadow-red-600/10 hover:bg-red-700 transition-all" onClick={scrollToPackages}>
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <UserLogin isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <UserProfileEdit isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </header>
  );
}