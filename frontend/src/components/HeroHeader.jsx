export default function HeroHeader() {
    return (
        <header className="absolute top-6 left-0 w-full z-50">
            <div className="max-w-[1400px] mx-auto px-5">

                <div
                    className="
flex items-center justify-between
px-8 lg:px-12
py-4
rounded-full

bg-gradient-to-r
from-white/25
via-[#f5ead8]/20
to-white/25

backdrop-blur-3xl

border border-white/40

shadow-[0_20px_60px_rgba(0,0,0,.08)]

"
                >
                    {/* Logo */}
                    <div>
                        <h2 className="text-3xl font-black text-[#1f1f1f]">
                            Meals<span className="text-red-500">.</span>
                        </h2>
                    </div>

                    {/* Menu */}
                    <nav className="hidden lg:flex items-center gap-10">
                        <a
                            href="#"
                            className="text-[#000] font-medium hover:text-white transition"
                        >
                            Home
                        </a>

                        <a
                            href="#"
                            className="text-[#000] font-medium hover:text-white transition"
                        >
                            Plans
                        </a>

                        <a
                            href="#"
                            className="text-[#000] font-medium hover:text-white transition"
                        >
                            Menu
                        </a>

                        <a
                            href="#"
                            className="text-[#000] font-medium hover:text-white transition"
                        >
                            About
                        </a>

                        <a
                            href="#"
                            className="text-[#000] font-medium hover:text-white transition"
                        >
                            Contact
                        </a>
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        <button className="hidden md:block text-[#000] font-semibold hover:text-white transition">
                            Login
                        </button>

                        <button
                            className="
              hidden md:block
              px-7
              py-3
              rounded-full
              bg-white/70
              backdrop-blur-xl
              text-[#000]
              font-semibold
              shadow-lg
              hover:scale-105
              transition
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