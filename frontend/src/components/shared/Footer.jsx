import { Link, useNavigate } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaTwitter,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Plans", to: "/#plans" },
  { label: "About", to: "/about" },
  { label: "Contact Us", to: "/contact-us" },
  {label:"Login", to:"/login"}
];

const serviceLinks = [
  { label: "Daily Tiffin", to: "/#plans" },
  { label: "Custom Packages", to: "/create-package" },
  { label: "Meals", to: "/dashboard" },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="relative overflow-hidden bg-white pt-12">
      {/* Background Blur Elements */}
      <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-red-100/70 blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-[250px] w-[250px] rounded-full bg-rose-50 blur-[90px]" />

      {/* CTA SECTION */}
      <div className="relative max-w-[1200px] mx-auto px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r bg-[#F82632] shadow-[0_15px_50px_rgba(220,38,38,0.15)]">
          <div className="grid lg:grid-cols-[280px_1fr] items-center">
            {/* Left Image */}
            <div className="hidden lg:flex justify-center pt-6 pl-6 self-end">
              <img
                src="/thali.png"
                alt="tiffin"
                className="w-[220px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.3)]"
              />
            </div>

            {/* Right Content */}
            <div className="p-8 lg:p-10 text-white">
              <span className="inline-block rounded-full bg-red-500/60 px-4 py-1 text-xs font-semibold tracking-wider backdrop-blur">
                HEALTHY • FRESH • HOMEMADE
              </span>

              <h2 className="mt-4 text-2xl md:text-3xl font-bold leading-tight">
                Ready for Fresh Homemade Meals?
              </h2>

              <p className="mt-2 max-w-xl text-red-100 text-base">
                Choose your package and start your healthy food journey today.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/create-package")}
                  className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-red-600 transition hover:scale-105 active:scale-95"
                >
                  Order Now
                </button>

                <a
                  href="/#plans"
                  className="rounded-xl border border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-red-600 active:scale-95"
                >
                  View Packages
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="relative bg-gray-50 mt-16">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] gap-y-12 gap-x-10 text-sm">
            {/* Brand */}
            <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="h-5 w-10 rounded-xl" />
                <div onClick={() => navigate("/")}>
                  <img src="/logo.png" className="h-20" />
                </div>
              </div>

              <p className="mt-5 leading-relaxed text-gray-600 max-w-sm">
                We deliver healthy, hygienic and delicious homemade meals
                straight to your doorstep.
              </p>

              <div className="mt-6 flex gap-3">
                {[FaInstagram, FaFacebookF, FaWhatsapp, FaTwitter].map(
                  (Icon, i) => (
                    <div
                      key={i}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-red-600 hover:text-white hover:shadow-red-200"
                    >
                      <Icon size={15} />
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-5 text-base font-bold text-gray-900 relative inline-block pb-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-8 after:bg-red-600">
                Quick Links
              </h3>
              <div className="space-y-3">
                {quickLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="flex cursor-pointer items-center gap-2 text-gray-600 transition hover:text-red-600 hover:translate-x-1 duration-300"
                  >
                    <IoIosArrowForward className="opacity-60" size={14} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="mb-5 text-base font-bold text-gray-900 relative inline-block pb-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-8 after:bg-red-600">
                Our Services
              </h3>
              <div className="space-y-3">
                {serviceLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="flex cursor-pointer items-center gap-2 text-gray-600 transition hover:text-red-600 hover:translate-x-1 duration-300"
                  >
                    <IoIosArrowForward className="opacity-60" size={14} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-5 text-base font-bold text-gray-900 relative inline-block pb-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-8 after:bg-red-600">
                Contact Us
              </h3>

              <div className="space-y-4 text-gray-600">
                <a
                  href="tel:+17783121686"
                  className="flex items-center gap-3 transition hover:text-red-600"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <FaPhoneAlt size={13} />
                  </span>
                  <span>+1 (778) 312-1686</span>
                </a>

                <a
                  href="mailto:info@prepplates.com"
                  className="flex items-center gap-3 transition hover:text-red-600"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <MdEmail size={15} />
                  </span>
                  <span className="break-all">info@prepplates.com</span>
                </a>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=1668+Fosters+Way+Delta+BC+V3M+6S6+Canada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition hover:text-red-600"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <FaMapMarkerAlt size={14} />
                  </span>
                  <span>1668 Fosters Way Delta, BC V3M 6S6 Canada</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200">
          <div className="max-w-[1200px] mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500 text-center md:text-left">
              <p className="flex flex-wrap items-center justify-center gap-x-1.5">
                <span>
                  © {new Date().getFullYear()} SHOP DABBA WALA • ALL RIGHTS
                  RESERVED
                </span>
                <a
                  href="https://neosoftix.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors"
                >
                  DEVELOPED BY NEOSOFTIX PVT. LTD.
                </a>
              </p>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <Link
                  to="/privacy-policy"
                  className="cursor-pointer hover:text-red-600 transition"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms-and-conditions"
                  className="cursor-pointer hover:text-red-600 transition"
                >
                  Terms & Condition
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
