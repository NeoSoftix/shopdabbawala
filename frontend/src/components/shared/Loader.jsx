import React from "react";

/**
 * Full-page loader overlay
 */
export const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-[#E23747] rounded-full animate-spin" />
      <p className="text-sm font-semibold text-gray-500">Loading...</p>
    </div>
  </div>
);

/**
 * Inline section loader (e.g. inside a card)
 */
export const SectionLoader = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <div className="w-10 h-10 border-4 border-gray-200 border-t-[#E23747] rounded-full animate-spin" />
    <p className="text-sm font-medium text-gray-400">{text}</p>
  </div>
);

/**
 * Inline button spinner (use inside button when submitting)
 */
export const ButtonSpinner = () => (
  <svg
    className="animate-spin h-4 w-4 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

export default PageLoader;
