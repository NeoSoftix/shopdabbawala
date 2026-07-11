import React from "react";
import AppLoader from "./AppLoader";
import logo from "/logo.png";

/**
 * Full-page loader overlay — branded ShopDabbaWala loader
 */
export const PageLoader = () => <AppLoader />;

/**
 * Inline section loader (e.g. inside a card) — compact branded version
 */
export const SectionLoader = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <div className="relative flex h-16 w-16 items-center justify-center">
      <svg className="app-loader-ring absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="none" stroke="#FDE2E2" strokeWidth="6" />
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="#E23747"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="180 300"
        />
      </svg>
      <img src={logo} alt="ShopDabbaWala" className="relative h-9 w-9 object-contain" />
    </div>
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
