import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../services/category.service.js";
import { getAllMeals } from "../../services/meal.service.js";

const AddCategory = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [meal, setMeal] = useState("");
  const [foodType, setFoodType] = useState("");
  const [image, setImage] = useState(null);
  const [meals, setMeals] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const res = await getAllMeals();
        setMeals(res.data || []);
      } catch (err) {
        console.log("Get all meals error", err);
      }
    };

    loadMeals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("name", name);
      formData.append("meal", meal);
      formData.append("foodType", foodType);
      if (image) {
        formData.append("image", image);
      }

      await createCategory(formData);

      setSuccess("Add category successfully");
      setError("");

      setName("");
      setMeal("");
      setFoodType("");
      setImage(null);
    } catch (error) {
      console.log("Create Category error", error);
      setSuccess("");
      setError(error?.response?.data?.message || "Failed to add category");
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Add Category</h1>

          <p className="text-sm text-gray-500 mt-1">
            Create a new food category
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/categories")}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
        >
          <span>←</span>
          <span>Back to Categories</span>
        </button>
      </div>
      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 font-medium shadow-sm">
          <div className="flex items-center gap-2">
            <span>{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-medium shadow-sm">
          <div className="flex items-center gap-2">
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>

              <input
                type="text"
                value={name}
                placeholder="Enter category name"
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Meal Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meal
              </label>

              <select
                value={meal}
                onChange={(e) => setMeal(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Meal</option>
                {meals.map((mealOption) => (
                  <option key={mealOption._id} value={mealOption._id}>
                    {mealOption.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Food Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Type
              </label>

              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Food Type</option>

                <option value="veg">Veg</option>

                <option value="non-veg">Non Veg</option>
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Image
              </label>

              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Click to upload image</p>

                  {image && (
                    <p className="text-xs text-green-600 mt-2">{image.name}</p>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          {/* Image Preview */}
          {image && (
            <div className="border rounded-lg p-4 mt-6">
              <p className="text-sm text-gray-600 mb-2">Selected Image</p>

              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-28 h-28 rounded-lg object-cover border"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setName("");
                setMeal("");
                setFoodType("");
                setImage(null);
              }}
              className="px-5 py-2.5 border rounded-lg text-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium"
            >
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
