import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [meal, setMeal] = useState("");
  const [foodType, setFoodType] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCategory = {
      id: Date.now(),
      name,
      meal,
      foodType,
      image: image?.name || "",
    };

    const existingCategories =
      JSON.parse(localStorage.getItem("categories")) || [];

    existingCategories.push(newCategory);

    localStorage.setItem("categories", JSON.stringify(existingCategories));

    toast.success("Category Added");

    setName("");
    setMeal("");
    setFoodType("");
    setImage(null);
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
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow transition-all duration-200"
        >
          <span className="text-lg">←</span>
          <span>Back to Categories</span>
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Meal Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meal Type
              </label>

              <select
                required
                value={meal}
                onChange={(e) => setMeal(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Meal</option>

                <option value="Breakfast">Breakfast</option>

                <option value="Lunch">Lunch</option>

                <option value="Dinner">Dinner</option>
              </select>
            </div>

            {/* Food Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Type
              </label>

              <select
                required
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
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

              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 transition">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Click to upload image</p>

                  {image && (
                    <p className="text-xs text-green-600 mt-2">{image.name}</p>
                  )}
                </div>

                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          {/* Preview */}
          {image && (
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Selected Image</p>

              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="w-28 h-28 rounded-lg object-cover border"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setName("");
                setMeal("");
                setFoodType("");
                setImage(null);
              }}
              className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50"
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
