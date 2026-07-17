import { useState, useEffect } from "react";

// Path ko apne folder structure ke according adjust karlein
import { getActiveAddOns } from "../../services/addOn.service";

import { SectionLoader } from "../shared/Loader";
import CategoryTabs from "./AddOnsSection/CategoryTabs";
import AddOnsGrid from "./AddOnsSection/AddOnsGrid";
import { filterAddOnsByTab } from "./AddOnsSection/addOnsUtils";

// Read-only catalog - add-ons are actually ordered per-day while scheduling
// a meal (see MealPlanner/DayAddOns.jsx), not purchased directly from here,
// so this page has no cart/add-to-cart/checkout of its own.
export default function AddonsSection() {
  const [addonsData, setAddonsData] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeTab, setActiveTab] = useState("All");
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveAddons = async () => {
      try {
        setLoading(true);
        const result = await getActiveAddOns();

        if (result.success && result.data) {
          setAddonsData(result.data);
          const dynamicCategories = result.data
            .map((item) => item.category)
            .filter((category) => category);

          const uniqueCategories = [
            "All",
            "Recommended",
            ...new Set(dynamicCategories),
          ];
          setCategories(uniqueCategories);
        } else {
          setError(result.message || "Failed to fetch active add-ons");
        }
      } catch (err) {
        console.error("Error fetching add-ons via service:", err);
        setError("Something went wrong while loading add-ons.");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveAddons();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredItems = filterAddOnsByTab(addonsData, activeTab);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FDFBF9]">
        <SectionLoader text="Loading add-ons..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FDFBF9] p-4 text-center">
        <div className="text-red-600 font-bold max-w-md">{error}</div>
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

        {/* Dynamic Categories Tab */}
        <CategoryTabs categories={categories} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Dynamic Main Addons Grid Area */}
      <AddOnsGrid
        items={filteredItems}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
    </section>
  );
}
