import React from "react";
import { useLocation } from "react-router-dom";
import Footer from "../../components/shared/Footer";
import HeroHeader from "../../components/User/HeroHeader";
const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-16 w-16 sm:h-20 sm:w-20"
  >
    <path
      d="M5 12.5L9.5 17L19 7.5"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DocumentIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-6 w-6"
  >
    <path
      d="M7 3.5H14L18 7.5V20.5H7V3.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M14 3.5V8H18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M10 12H15M10 15H15"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-6 w-6"
  >
    <rect
      x="4"
      y="5.5"
      width="16"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M8 3.5V7.5M16 3.5V7.5M4 9.5H20"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M9 14L11 16L15 12"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-6 w-6"
  >
    <rect
      x="3.5"
      y="5.5"
      width="17"
      height="13"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M5 7L12 13L19 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-6 w-6"
  >
    <circle
      cx="12"
      cy="12"
      r="8.5"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M12 7.5V12L15 14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoItem = ({ icon, title, value, highlight = false }) => {
  return (
    <div className="relative flex flex-col items-center px-4 py-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
        {icon}
      </div>

      <h3 className="mb-2 text-sm font-bold text-slate-900">
        {title}
      </h3>

      <p
        className={`text-xs font-medium sm:text-sm ${
          highlight ? "text-red-500" : "text-slate-500"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

// If we navigated here right after a real submission, `submittedAt` arrives
// as an ISO timestamp from the backend - format it for display; otherwise
// (direct nav to the URL) fall back to the default text already in place.
const formatSubmittedAt = (value) => {
  if (!value) return "May 17, 2025 at 10:45 AM";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    year: "numeric", month: "long", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
};

const ThankYouPage = () => {
  const location = useLocation();
  const state = location.state || {};

  const referenceId = state.referenceId || "PP-250517-4587";
  const submittedAt = formatSubmittedAt(state.submittedAt);
  const supportEmail = state.supportEmail || "info@prepplates.com";
  const responseTime = state.responseTime || "Within 24 hours";

  return (
    <main className="relative min-h-screen overflow-hidden bg-white font-sans">
      <HeroHeader />
      {/* Decorative Elements */}
      <div className="pointer-events-none absolute left-[-80px] top-[45%] h-52 w-52 rounded-full border border-red-100 opacity-60" />
      <div className="pointer-events-none absolute left-[-45px] top-[49%] h-36 w-36 rounded-full border border-red-100 opacity-60" />

      <div className="pointer-events-none absolute right-[-80px] top-32 h-48 w-48 rounded-full border border-dashed border-red-100 opacity-70" />

      <div className="pointer-events-none absolute right-[8%] top-[28%] h-28 w-28 rounded-full border border-dashed border-red-100 opacity-50" />

      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-3 text-xs font-medium text-slate-400 sm:mb-10">
          <a
            href="/"
            className="transition-colors duration-200 hover:text-red-500"
          >
            Home
          </a>

          <span className="text-slate-300">›</span>

          <span className="font-semibold text-slate-700">
            Thank You
          </span>
        </div>

        {/* Main Content */}
        <section className="mx-auto flex max-w-5xl flex-col items-center text-center">
          {/* Success Icon */}
          <div className="relative mb-7">
            <div className="absolute inset-[-16px] rounded-full bg-red-100 opacity-50 blur-sm" />

            <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[8px] border-red-100 bg-red-50 text-red-500 shadow-[0_12px_40px_rgba(239,68,68,0.25)] sm:h-32 sm:w-32">
              <CheckIcon />
            </div>

            {/* Small decorative dots */}
            <span className="absolute -right-7 top-1 h-2 w-2 rounded-full bg-red-200" />
            <span className="absolute -left-8 top-8 h-1.5 w-1.5 rounded-full bg-red-200" />
            <span className="absolute -right-3 bottom-[-15px] h-1.5 w-1.5 rounded-full bg-red-300" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Thank{" "}
            <span className="text-red-500">
              You!
            </span>
          </h1>

          <p className="mt-4 text-base font-semibold text-slate-500 sm:text-lg">
            Your message has been received successfully.
          </p>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Our team will get back to you shortly.
          </p>

          {/* Bottom Accent */}
          <div className="mt-6 flex items-center gap-2">
            <span className="h-[3px] w-10 rounded-full bg-red-500" />
            <span className="h-[3px] w-4 rounded-full bg-red-300" />
          </div>

          {/* Information Card */}
          <div className="mt-10 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
            <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
              <InfoItem
                icon={<DocumentIcon />}
                title="Reference ID"
                value={referenceId}
                highlight
              />

              <InfoItem
                icon={<CalendarIcon />}
                title="Submitted Successfully"
                value={submittedAt}
              />

              <InfoItem
                icon={<MailIcon />}
                title="Support Email"
                value={supportEmail}
              />

              <InfoItem
                icon={<ClockIcon />}
                title="Response Time"
                value={responseTime}
              />
            </div>
          </div>

          {/* Optional Home Button */}
          <a
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-red-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-600"
          >
            Back to Home
          </a>
        </section>
      </div>

      <section>
        <Footer />
      </section>
    </main>
  );
};

export default ThankYouPage;