import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { getActiveCategory } from "../../services/category.service.js";
import { getItemsByCategory } from "../../services/items.service.js";
import { getWeeklyMenu, saveWeeklyMenu } from "../../services/weeklyMenu.service.js";
import { PageLoader } from "../../components/shared/Loader";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const mondayOf = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diff);
  return d;
};

const dateKey = (date) => {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Admin picks a category + week, then for each of that week's 7 dates
// checks off which items (from that category) are available to order on
// that specific date. Saved as a WeeklyMenu doc keyed by (category, week) -
// re-done every week, not a permanent recurring template.
const WeeklyMenuManager = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [weekStart, setWeekStart] = useState(() => mondayOf(new Date()));
  const [categoryItems, setCategoryItems] = useState([]);
  // { "YYYY-MM-DD": Set(itemId) }
  const [selection, setSelection] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingWeek, setLoadingWeek] = useState(false);
  const [saving, setSaving] = useState(false);

  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    }),
    [weekStart]
  );

  useEffect(() => {
    getActiveCategory()
      .then((res) => {
        if (res.success) {
          const cats = res.data || [];
          setCategories(cats);
          if (cats.length > 0) setSelectedCategory(cats[0]._id);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        toast.error("Failed to load categories.");
      })
      .finally(() => setLoading(false));
  }, []);

  const loadWeek = useCallback(async () => {
    if (!selectedCategory) return;
    setLoadingWeek(true);
    try {
      const [itemsRes, menuRes] = await Promise.all([
        getItemsByCategory(selectedCategory),
        getWeeklyMenu(selectedCategory, dateKey(weekStart)),
      ]);

      if (itemsRes.success) setCategoryItems(itemsRes.data || []);

      const nextSelection = {};
      weekDates.forEach((d) => {
        nextSelection[dateKey(d)] = new Set();
      });

      if (menuRes.success && menuRes.data) {
        (menuRes.data.days || []).forEach((day) => {
          const key = dateKey(day.date);
          if (nextSelection[key]) {
            nextSelection[key] = new Set((day.items || []).map((it) => it._id || it));
          }
        });
      }

      setSelection(nextSelection);
    } catch (error) {
      console.error("Failed to load weekly menu:", error);
      toast.error("Failed to load this week's menu.");
    } finally {
      setLoadingWeek(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, weekStart]);

  useEffect(() => {
    loadWeek();
  }, [loadWeek]);

  const toggleItemForDay = (dayKey, itemId) => {
    setSelection((prev) => {
      const daySet = new Set(prev[dayKey] || []);
      if (daySet.has(itemId)) {
        daySet.delete(itemId);
      } else {
        daySet.add(itemId);
      }
      return { ...prev, [dayKey]: daySet };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const days = weekDates.map((d) => {
        const key = dateKey(d);
        return { date: key, items: Array.from(selection[key] || []) };
      });

      const res = await saveWeeklyMenu({
        category: selectedCategory,
        weekStartDate: dateKey(weekStart),
        days,
      });

      if (res.success) {
        toast.success("Weekly menu saved successfully!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save weekly menu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Weekly Menu</h1>
        <p className="text-gray-500">
          Choose which items are available, per day, for each category this week.
        </p>
      </div>

      <div className="mx-auto w-full max-w-5xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div className="flex items-end gap-3">
            <div className="max-w-xs">
              <label className="mb-1.5 block text-xs font-medium text-gray-500">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm capitalize focus:border-[#e61e2d] focus:outline-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id} className="capitalize">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/admin/items/add?category=${selectedCategory}&from=weekly-menu`)}
              disabled={!selectedCategory}
              className="flex items-center gap-1.5 rounded-lg border border-[#e61e2d] px-3 py-2 text-sm font-semibold text-[#e61e2d] hover:bg-red-50 disabled:opacity-50 whitespace-nowrap"
            >
              <Plus size={15} /> Add Item
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setWeekStart((prev) => { const d = new Date(prev); d.setDate(d.getDate() - 7); return d; })}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
              {weekDates[0].toLocaleDateString("en-US", { day: "numeric", month: "short" })} - {weekDates[6].toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <button
              type="button"
              onClick={() => setWeekStart((prev) => { const d = new Date(prev); d.setDate(d.getDate() + 7); return d; })}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {loadingWeek ? (
          <div className="py-16 text-center text-sm text-gray-400">Loading week...</div>
        ) : categoryItems.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400 space-y-3">
            <p>No items exist in this category yet.</p>
            <button
              type="button"
              onClick={() => navigate(`/admin/items/add?category=${selectedCategory}&from=weekly-menu`)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#e61e2d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
            >
              <Plus size={15} /> Add an item to this category
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              {weekDates.map((date, i) => {
                const key = dateKey(date);
                const daySelection = selection[key] || new Set();

                return (
                  <div key={key} className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                    <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                      {DAY_LABELS[i]}
                    </p>
                    <p className="text-[11px] text-gray-400 mb-2">
                      {date.toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                    </p>

                    <div className="space-y-1.5 max-h-56 overflow-y-auto no-scrollbar pr-0.5">
                      {categoryItems.map((item) => (
                        <label
                          key={item._id}
                          className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={daySelection.has(item._id)}
                            onChange={() => toggleItemForDay(key, item._id)}
                            className="h-3.5 w-3.5 rounded border-gray-300 text-[#e61e2d] focus:ring-[#e61e2d]"
                          />
                          <span className="truncate">{item.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-[#e61e2d] px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                {saving ? "Saving..." : "Save Weekly Menu"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeeklyMenuManager;
