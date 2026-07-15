import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { createCategory } from "../../services/category.service.js";
import { toast } from "react-hot-toast";
import { ButtonSpinner } from "../shared/Loader";

const AddCategory = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [foodType, setFoodType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Category name is required.";
    if (!foodType) newErrors.foodType = "Please select a food type.";
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

      await createCategory({ name, foodType });
      toast.success("Category added successfully!");
      setName("");
      setFoodType("");
      setErrors({});
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add category.");
    } finally {
      setLoading(false);
    }
  };

  const clearField = (field) => {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Add Category</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new food category</p>
        </div>
        <button
          onClick={() => navigate("/admin/categories")}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Categories</span>
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                placeholder="Enter category name"
                onChange={(e) => { setName(e.target.value); clearField("name"); }}
                className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 ${
                  errors.name ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-red-400"
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.name}</p>}
            </div>

            {/* Food Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Food Type <span className="text-red-500">*</span>
              </label>
              <select
                value={foodType}
                onChange={(e) => { setFoodType(e.target.value); clearField("foodType"); }}
                className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 bg-white ${
                  errors.foodType ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-red-400"
                }`}
              >
                <option value="">Select Food Type</option>
                <option value="veg">Veg</option>
                <option value="non-veg">Non Veg</option>
              </select>
              {errors.foodType && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.foodType}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setName(""); setFoodType(""); setErrors({});
              }}
              className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              {loading && <ButtonSpinner />}
              {loading ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
