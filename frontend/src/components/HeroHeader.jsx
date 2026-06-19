export default function HeroHeader() {
  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="max-w-[1600px] mx-auto px-5 lg:px-10 py-5 flex items-center justify-between">

        <div>
          <h2 className="text-3xl font-black text-white">
            Meals<span className="text-red-300">.</span>
          </h2>
        </div>

        <nav className="hidden lg:flex items-center gap-10">
          <a href="#" className="text-white/80 hover:text-white">
            Home
          </a>

          <a href="#" className="text-white/80 hover:text-white">
            Plans
          </a>

          <a href="#" className="text-white/80 hover:text-white">
            Menu
          </a>

          <a href="#" className="text-white/80 hover:text-white">
            About
          </a>

          <a href="#" className="text-white/80 hover:text-white">
            Contact
          </a>
        </nav>

        <button className="hidden md:block bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
          Order Now
        </button>
      </div>
    </header>
  );
}