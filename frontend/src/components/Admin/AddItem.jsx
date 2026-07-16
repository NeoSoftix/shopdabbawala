import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { getAllCategories } from "../../services/category.service";
import { createItem } from "../../services/items.service";
import { toast } from "react-hot-toast";
import { ButtonSpinner } from "../shared/Loader";

const AddItem = () => {
  const navigate = useNavigate();
  // Pre-select the category when arriving from a "+ Add Item" shortcut
  // elsewhere (e.g. the Weekly Menu page, when a category has no items yet).
  const [searchParams] = useSearchParams();
  const preselectedCategory = searchParams.get("category") || "";
  // If we arrived from the Weekly Menu page's "+ Add Item" shortcut, send
  // the admin back there after saving instead of the generic Items list.
  const returnTo = searchParams.get("from") === "weekly-menu" ? "/admin/weekly-menu" : "/admin/items";

  const [itemData, setItemData] = useState({
    name: "",
    description: "",
    category: preselectedCategory,
    allergies: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data || []);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    setItemData({ ...itemData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!itemData.name.trim()) newErrors.name = "Item name is required.";
    if (!itemData.description.trim()) newErrors.description = "Description is required.";
    if (!itemData.category) newErrors.category = "Please select a category.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      setLoading(true);

      await createItem({
        name: itemData.name,
        description: itemData.description,
        category: itemData.category,
        allergies: itemData.allergies.split(",").map((item) => item.trim()).filter(Boolean),
      });

      toast.success("Item created successfully!");
      navigate(returnTo);
    } catch (error) {
      console.log("Create item error", error);

      toast.error(error?.response?.data?.message || "Failed to create item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Add Item</h1>
          <p className="text-gray-500 mt-1">Create a new menu item</p>
        </div>
        <button
          onClick={() => navigate(returnTo)}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Items
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side */}
            <div className="space-y-5">
              {/* Item Name */}
              <div>
                <label className="block mb-1.5 font-medium text-gray-700">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={itemData.name}
                  onChange={handleChange}
                  placeholder="Enter Item Name"
                  className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 ${errors.name ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-red-200"
                    }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1.5 font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  name="description"
                  value={itemData.description}
                  onChange={handleChange}
                  placeholder="Enter Description"
                  className={`w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 ${errors.description ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-red-200"
                    }`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.description}</p>}
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-5">
              {/* Category */}
              <div>
                <label className="block mb-1.5 font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={itemData.category}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-3 bg-white focus:outline-none focus:ring-2 ${errors.category ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-red-200"
                    }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.category}</p>}
              </div>

              {/* Allergies */}
              <div>
                <label className="block mb-1.5 font-medium text-gray-700">Allergies</label>
                <input
                  type="text"
                  name="allergies"
                  value={itemData.allergies}
                  onChange={handleChange}
                  placeholder="Milk, Nuts, Gluten"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-200"
                />
                <p className="text-sm text-gray-400 mt-1">Separate allergies with commas.</p>
              </div>
            </div >
          </div >

          {/* Buttons */}
          < div className="flex justify-end gap-4 mt-8" >
            <button
              type="button"
              onClick={() => navigate("/admin/items")}
              className="border border-gray-300 px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-xl text-white ${loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
                }`}
            >
              {loading ? "Saving..." : "Save Item"}
            </button>
          </div >
        </form >
      </div >
    </div >
  );
};

export default AddItem;
