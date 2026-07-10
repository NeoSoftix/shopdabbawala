import { Link } from "react-router-dom";
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

export default function Footer() {
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
                <button className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-red-600 transition hover:scale-105 active:scale-95">
                  Order Now
                </button>

                <button className="rounded-xl border border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-red-600 active:scale-95">
                  View Packages
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="relative max-w-[1200px] mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.2fr] gap-8 text-sm">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-600" />
              <div>
                <h2 className="text-3xl font-black tracking-tight text-red-600">
                  Tiffinly
                </h2>
                <p className="text-xs text-gray-400 font-medium">
                  Fresh Meals Daily
                </p>
              </div>
            </div>

            <p className="mt-4 leading-6 text-gray-600 max-w-sm">
              We deliver healthy, hygienic and delicious homemade meals straight
              to your doorstep.
            </p>

            <div className="mt-5 flex gap-3">
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
            <h3 className="mb-4 text-base font-bold text-gray-900">
              Quick Links
            </h3>
            <div className="space-y-2">
              {[
                "Home",
                "Packages",
                "Meals",
                "Reviews",
                "Service Areas",
                "Contact Us",
              ].map((item) => (
                <div
                  key={item}
                  className="flex cursor-pointer items-center justify-between py-1 text-gray-600 transition hover:text-red-600"
                >
                  {item}
                  <IoIosArrowForward className="opacity-60" size={14} />
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-base font-bold text-gray-900">
              Our Services
            </h3>
            <div className="space-y-2">
              {[
                "Daily Tiffin",
                "Weekly Plans",
                "Monthly Plans",
                "Custom Packages",
                "Corporate Meals",
                "Family Meals",
              ].map((item) => (
                <div
                  key={item}
                  className="flex cursor-pointer items-center justify-between py-1 text-gray-600 transition hover:text-red-600"
                >
                  {item}
                  <IoIosArrowForward className="opacity-60" size={14} />
                </div>
              ))}
            </div>
          </div>

          {/* Areas */}
          <div>
            <h3 className="mb-4 text-base font-bold text-gray-900">
              Service Areas
            </h3>
            <div className="space-y-2 text-gray-600">
              {["Chandigarh", "Mohali", "Panchkula", "Zirakpur", "Kharar"].map(
                (item) => (
                  <div key={item} className="py-0.5">
                    {item}
                  </div>
                ),
              )}
            </div>

            <button className="mt-4 rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white">
              View All Areas
            </button>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-base font-bold text-gray-900">
              Contact Us
            </h3>

            <div className="space-y-3.5 text-gray-600">
              <div className="flex items-center gap-2.5">
                <FaPhoneAlt className="text-red-600 flex-shrink-0" size={14} />
                <span>+91 98765 43210</span>
              </div>

              <div className="flex items-center gap-2.5">
                <MdEmail className="text-red-600 flex-shrink-0" size={15} />
                <span className="break-all">hello@tiffinly.com</span>
              </div>

              <div className="flex items-center gap-2.5">
                <FaMapMarkerAlt
                  className="text-red-600 flex-shrink-0"
                  size={15}
                />
                <span>Chandigarh, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 border-t border-gray-100 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© 2026 Tiffinly. All Rights Reserved.</p>

            <div className="flex flex-wrap justify-center gap-4 font-medium text-gray-600">
              <span>100% Hygienic</span>
              <span>•</span>
              <span>On Time Delivery</span>
              <span>•</span>
              <span>Fresh Ingredients</span>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/privacy-policy" className="cursor-pointer hover:text-red-600 transition">
                Privacy Policy
              </Link>
              <Link to="/terms-and-conditions" className="cursor-pointer hover:text-red-600 transition">
                Terms
              </Link>
              <span className="cursor-pointer hover:text-red-600 transition">
                Refund Policy
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
