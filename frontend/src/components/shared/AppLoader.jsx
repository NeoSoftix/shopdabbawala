import React from "react";
import logo from "/logo.png";

/**
 * Branded full-page splash/loader shown while the app boots up.
 */
const AppLoader = ({
  title = "Preparing your experience...",
  subtitle = "We're setting everything up for you.",
}) => (
  <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#fff5f5] to-[#ffe9e9]">
    {/* decorative background dots */}
    <span className="absolute top-16 right-20 h-2 w-2 rounded-full bg-[#E23747]/70" />
    <span className="absolute top-40 left-16 h-2 w-2 rounded-full bg-[#E23747]/40" />
    <span className="absolute bottom-24 right-28 h-2 w-2 rounded-full bg-[#E23747]/30" />
    <span className="absolute bottom-40 left-24 h-2 w-2 rounded-full bg-[#E23747]/30" />

    <div className="relative flex h-56 w-56 items-center justify-center">
      <svg className="app-loader-ring absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="#FDE2E2"
          strokeWidth="4"
        />
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="#E23747"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="180 300"
        />
      </svg>

      <img
        src={logo}
        alt="ShopDabbaWala"
        className="app-loader-logo relative h-32 w-32 object-contain drop-shadow-md"
      />
    </div>

    <h2 className="mt-8 text-2xl font-bold text-gray-800">{title}</h2>
    <p className="mt-2 text-sm text-gray-500">{subtitle}</p>

    <div className="mt-5 flex items-center gap-2">
      <span className="app-loader-dot h-2.5 w-2.5 rounded-full bg-[#E23747]" style={{ animationDelay: "0s" }} />
      <span className="app-loader-dot h-2.5 w-2.5 rounded-full bg-[#E23747]" style={{ animationDelay: "0.2s" }} />
      <span className="app-loader-dot h-2.5 w-2.5 rounded-full bg-[#E23747]" style={{ animationDelay: "0.4s" }} />
    </div>
  </div>
);

export default AppLoader;
