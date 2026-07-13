import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

// Fixed bottom-right button that appears once the user has scrolled down and
// smooth-scrolls the page back to the top - rendered once at the app root so
// it shows on every page (User/Admin/Vendor) regardless of layout.
export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-[1200] flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30 transition-all duration-300 hover:bg-red-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 ${
        isVisible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUp size={20} strokeWidth={2.5} />
    </button>
  );
}
