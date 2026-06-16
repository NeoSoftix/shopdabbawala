import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMeal } from "../../service/meal.service.js";

const AddMeal = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("name", name);
      if (image) {
        formData.append("image", image);
      }

      const res = await createMeal(formData);

      setSuccess(res.message || "Meal Created Successfully");

      setName("");
      setImage(null);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Add Meal</h1>

          <p className="mt-1 text-sm text-gray-500">Create a new meal</p>
        </div>

        <button
          onClick={() => navigate("/admin/meals")}
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-600 transition hover:bg-red-100"
        >
          ← Back to Meals
        </button>
      </div>

      {/* Form */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        {error && (
          <div className="mb-4 animate-in slide-in-from-top-2 duration-300 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-[#e61e2d]/20 bg-[#e61e2d]/5 px-4 py-3 shadow-sm animate-pulse">
            <p className="text-sm font-medium text-[#e61e2d]">✓ {success}</p>
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            {/* Meal Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Meal Name
              </label>

              <input
                type="text"
                required
                value={name}
                placeholder="Enter meal name"
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Meal Image
              </label>

              <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition hover:border-red-500">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Click to upload image</p>

                  {image && (
                    <p className="mt-2 text-xs text-green-600">{image.name}</p>
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

          {/* Preview */}
          {image && (
            <div className="rounded-lg border p-4">
              <p className="mb-2 text-sm text-gray-600">Selected Image</p>

              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="h-28 w-28 rounded-lg border object-cover"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col justify-end gap-3 sm:flex-row">
            <button
              disabled={loading}
              type="button"
              onClick={() => {
                setName("");
                setImage(null);
                setError("");
                setSuccess("");
              }}
              className="rounded-lg border px-5 py-2.5 text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>

            <button
              type="submit"
              className="rounded-lg bg-red-600 px-6 py-2.5 font-medium text-white hover:bg-red-700"
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
