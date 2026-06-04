import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddMeal = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMeal = {
      id: Date.now(),
      name,
      image: image?.name || "",
    };

    const existingMeals = JSON.parse(localStorage.getItem("meals")) || [];

    existingMeals.push(newMeal);

    localStorage.setItem("meals", JSON.stringify(existingMeals));

    alert("Meal Added");

    setName("");
    setImage(null);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Add Meal</h1>

          <p className="text-sm text-gray-500 mt-1">Create a new meal</p>
        </div>

        <button
          onClick={() => navigate("/admin/meals")}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition"
        >
          ← Back to Meals
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Meal Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meal Name
              </label>

              <input
                type="text"
                required
                value={name}
                placeholder="Enter meal name"
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meal Image
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

          {/* Image Preview */}
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
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setName("");
                setImage(null);
              }}
              className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium"
            >
              Save Meal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMeal;
