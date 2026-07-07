import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../services/category.service.js";
import { getAllMeals } from "../../services/meal.service.js";
import { toast } from "react-hot-toast";
import { ButtonSpinner } from "../shared/Loader";

const DEFAULT_IMG = "https://placehold.co/128x128?text=No+Image";

const AddCategory = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [meal, setMeal] = useState("");
  const [foodType, setFoodType] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const res = await getAllMeals();
        setMeals(res.data || []);
      } catch (err) {
        toast.error("Failed to load meals.");
      }
    };
    loadMeals();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Category name is required.";
    if (!meal) newErrors.meal = "Please select a meal.";
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
      const formData = new FormData();
      formData.append("name", name);
      formData.append("meal", meal);
      formData.append("foodType", foodType);
      if (image) formData.append("image", image);

      await createCategory(formData);
      toast.success("🎉 Category added successfully!");
      setName("");
      setMeal("");
      setFoodType("");
      setImage(null);
      setPreviewUrl(null);
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
          <span>←</span>
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
              {errors.name && <p className="text-red-500 text-sm mt-1">⚠ {errors.name}</p>}
            </div>

            {/* Meal Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Meal <span className="text-red-500">*</span>
              </label>
              <select
                value={meal}
                onChange={(e) => { setMeal(e.target.value); clearField("meal"); }}
                className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 bg-white ${
                  errors.meal ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-red-400"
                }`}
              >
                <option value="">Select Meal</option>
                {meals.map((mealOption) => (
                  <option key={mealOption._id} value={mealOption._id}>
                    {mealOption.name}
                  </option>
                ))}
              </select>
              {errors.meal && <p className="text-red-500 text-sm mt-1">⚠ {errors.meal}</p>}
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
              {errors.foodType && <p className="text-red-500 text-sm mt-1">⚠ {errors.foodType}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Image</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-400 transition-colors">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Click to upload image</p>
                  {image && <p className="text-xs text-green-600 mt-2">{image.name}</p>}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImage(file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="border rounded-lg p-4 mt-6">
              <p className="text-sm text-gray-600 mb-2">Selected Image</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-28 h-28 rounded-lg object-cover border"
                onError={(e) => { e.target.src = DEFAULT_IMG; e.target.onerror = null; }}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setName(""); setMeal(""); setFoodType(""); setImage(null);
                setPreviewUrl(null); setErrors({});
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
