import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Save, ChevronLeft, ChevronRight } from "lucide-react";
import { getActiveCategory } from "../../services/category.service.js";
import { getItemsByCategory } from "../../services/items.service.js";
import { getWeeklyMenu, saveWeeklyMenu } from "../../services/weeklyMenu.service.js";
import { SectionLoader } from "../../components/shared/Loader";

const dateKey = (date) => {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const getMondayOfCurrentWeek = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Adjust to Monday
  d.setDate(d.getDate() + diff);
  return dateKey(d);
};

// Menu week runs Monday-Saturday only (kitchen is closed Sundays).
const getWeekLabel = (dateStr) => {
  const start = new Date(dateStr);
  const end = new Date(start);
  end.setDate(start.getDate() + 5);
  const opts = { day: '2-digit', month: 'short' };
  return `${start.toLocaleDateString('en-GB', opts)} - ${end.toLocaleDateString('en-GB', opts)}`;
};

export default function WeeklyMenuManager() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryItems, setCategoryItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getMondayOfCurrentWeek());
  
  // Array of sections: { id, label, requiredQuantity, items: Set }
  const [sections, setSections] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const loadMenuForDate = useCallback(async () => {
    if (!selectedCategory || !selectedDate) return;
    setLoadingMenu(true);
    try {
      const [itemsRes, menuRes] = await Promise.all([
        getItemsByCategory(selectedCategory),
        getWeeklyMenu(selectedCategory, selectedDate),
      ]);

      if (itemsRes.success) setCategoryItems(itemsRes.data || []);

      if (menuRes.success && menuRes.data && menuRes.data.sections) {
        const loadedSections = menuRes.data.sections.map((sec, idx) => ({
          id: sec._id || Date.now() + idx,
          label: sec.label || "",
          requiredQuantity: sec.requiredQuantity || 1,
          items: new Set(sec.items.map(i => i._id || i))
        }));
        setSections(loadedSections);
      } else {
        setSections([]); // No menu for this date
      }
    } catch (error) {
      console.error("Failed to load daily menu:", error);
      toast.error("Failed to load menu for the selected date.");
    } finally {
      setLoadingMenu(false);
    }
  }, [selectedCategory, selectedDate]);

  useEffect(() => {
    loadMenuForDate();
  }, [loadMenuForDate]);

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now(),
        label: "",
        requiredQuantity: 1,
        items: new Set(),
      }
    ]);
  };

  const removeSection = (id) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const updateSection = (id, field, value) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const toggleItemInSection = (sectionId, itemId) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s;
      const newItems = new Set(s.items);
      if (newItems.has(itemId)) newItems.delete(itemId);
      else newItems.add(itemId);
      return { ...s, items: newItems };
    }));
  };

  const handleSave = async () => {
    // Validate sections
    if (sections.length === 0) {
      toast.error("Please add at least one step/section.");
      return;
    }

    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      if (!s.label.trim()) {
        toast.error(`Step ${i + 1} is missing a label.`);
        return;
      }
      if (s.requiredQuantity < 1) {
        toast.error(`Step ${i + 1} required quantity must be at least 1.`);
        return;
      }
      if (s.items.size === 0) {
        toast.error(`Step ${i + 1} has no items selected.`);
        return;
      }
      if (s.items.size < s.requiredQuantity) {
        toast.error(`Step ${i + 1} requires ${s.requiredQuantity} items but you only selected ${s.items.size}.`);
        return;
      }
    }

    setSaving(true);
    try {
      const formattedSections = sections.map(s => ({
        label: s.label,
        requiredQuantity: s.requiredQuantity,
        items: Array.from(s.items)
      }));

      const res = await saveWeeklyMenu({
        category: selectedCategory,
        date: selectedDate,
        sections: formattedSections,
        applyToEntireWeek: true,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] p-4">
        <SectionLoader text="Loading menu builder..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4">
      <div className="mb-4 flex flex-col justify-between sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weekly Menu Builder</h1>
          {/* <p className="text-gray-500">
            Configure meal sections and limits for a specific date and category.
          </p> */}
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loadingMenu}
          className="mt-4 flex items-center gap-2 rounded-xl bg-[#e61e2d] px-6 py-2.5 font-bold text-white transition-all hover:bg-red-700 disabled:opacity-50 sm:mt-0 shadow-sm"
        >
          {saving ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save size={18} />}
          {saving ? "Saving..." : "Save Menu"}
        </button>
      </div>

      <div className="w-full space-y-4">

        {/* Top Controls */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Select Category</label>
              <button onClick={() => navigate('/admin/categories')} className="text-xs text-[#e61e2d] hover:underline font-semibold">
                + Add Category
              </button>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium focus:border-[#e61e2d] focus:outline-none bg-gray-50"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id} className="capitalize">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Select Week</label>
            </div>
            <div className="flex items-center justify-between w-full rounded-lg border border-gray-300 px-2 py-1.5 bg-white shadow-sm">
              <button 
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() - 7);
                  setSelectedDate(dateKey(d));
                }}
                className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm font-bold text-slate-800 tracking-wide">
                {getWeekLabel(selectedDate)}
              </span>
              <button 
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() + 7);
                  setSelectedDate(dateKey(d));
                }}
                className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Sections */}
        {loadingMenu ? (
          <SectionLoader text="Loading menu sections..." />
        ) : (
          <div className="space-y-4">
            {sections.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500 shadow-sm">
                <p className="mb-4 text-sm font-medium">No menu sections configured for this date yet.</p>
                <button onClick={addSection} className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black">
                  <Plus size={16} /> Add First Step
                </button>
              </div>
            ) : (
              sections.map((section, index) => (
                <div key={section.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#e61e2d]" />

                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-xs text-[#e61e2d]">{index + 1}</span>
                      Step {index + 1}
                    </h3>
                    <button onClick={() => removeSection(section.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wide">Section Label</label>
                      <input
                        type="text"
                        placeholder="e.g. Vegetables, Roti/Rice"
                        value={section.label}
                        onChange={(e) => updateSection(section.id, "label", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#e61e2d] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wide">Required Selection Quantity</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 2"
                        value={section.requiredQuantity}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw === "") {
                            updateSection(section.id, "requiredQuantity", "");
                            return;
                          }
                          const parsed = parseInt(raw, 10);
                          updateSection(section.id, "requiredQuantity", isNaN(parsed) ? "" : parsed);
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "" || parseInt(e.target.value, 10) < 1) {
                            updateSection(section.id, "requiredQuantity", 1);
                          }
                        }}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#e61e2d] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Select Items Available</label>
                      <button onClick={() => navigate(`/admin/items/add?category=${selectedCategory}&from=weekly-menu`)} className="text-xs text-[#e61e2d] hover:underline font-semibold">
                        + Create New Item
                      </button>
                    </div>
                    {categoryItems.length === 0 ? (
                      <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">No items exist in this category. Please create some first.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-3 rounded-xl bg-gray-50 border border-gray-100 p-4 max-h-60 overflow-y-auto">
                        {categoryItems.map(item => {
                          const isSelected = section.items.has(item._id);
                          return (
                            <label
                              key={item._id}
                              className="flex items-center gap-2.5 cursor-pointer min-w-0"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleItemInSection(section.id, item._id)}
                                className="h-4 w-4 shrink-0 rounded border-gray-300 text-[#e61e2d] accent-[#e61e2d] focus:ring-[#e61e2d]"
                              />
                              <span className="text-sm font-medium text-gray-700 truncate">{item.name}</span>
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {sections.length > 0 && (
              <button
                onClick={addSection}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 p-4 text-sm font-bold text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors bg-white"
              >
                <Plus size={18} /> Add Another Step
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
