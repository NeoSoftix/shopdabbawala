import { useState, useEffect, useCallback } from "react";
import { RefreshCw, UtensilsCrossed } from "lucide-react";

// Path ko apne folder structure ke according adjust karlein
import { getActiveAddOns } from "../../services/addOn.service";

import { SectionLoader } from "../shared/Loader";
import AddOnsGrid from "./AddOnsSection/AddOnsGrid";

// Read-only catalog - add-ons are actually ordered per-day while scheduling
// a meal (see MealPlanner/DayAddOns.jsx), not purchased directly from here,
// so this page has no cart/add-to-cart/checkout of its own.
export default function AddonsSection() {
  const [addonsData, setAddonsData] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActiveAddons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getActiveAddOns();

      if (result.success && result.data) {
        setAddonsData(result.data);
      } else {
        setError(result.message || "Failed to fetch active add-ons");
      }
    } catch (err) {
      console.error("Error fetching add-ons via service:", err);
      setError("We're having trouble reaching our servers. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveAddons();
  }, [fetchActiveAddons]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FDFBF9]">
        <SectionLoader text="Loading add-ons..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#FDFBF9] px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-5 shadow-inner">
          <UtensilsCrossed size={28} />
        </div>

        <h3 className="text-lg font-black text-slate-900 tracking-tight">Unable to load add-ons</h3>
        <p className="text-sm text-slate-400 font-medium mt-1.5 mb-6 max-w-sm">{error}</p>

        <button
          type="button"
          onClick={fetchActiveAddons}
          className="inline-flex items-center gap-2 rounded-full bg-red-600 text-white px-6 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-red-700 active:scale-[0.98] transition-all shadow-md shadow-red-600/10"
        >
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="relative w-full bg-[#FDFBF9] p-[15px] sm:p-8 lg:px-16 font-sans select-none pb-16 md:pb-20">
      {/* Header Info Banner */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
        <div className="text-left">
          <span className="text-xs font-black tracking-widest text-red-600 uppercase block mb-1">
            CUSTOMIZE YOUR MEAL
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
            Add-<span className="text-red-600">ons</span>
          </h2>
          <p className="text-gray-400 font-medium text-xs sm:text-sm mt-2">
            Add extra items and make your meal perfect.
          </p>
        </div>
      </div>

      {/* Dynamic Main Addons Grid Area */}
      <AddOnsGrid
        items={addonsData}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
    </section>
  );
}
