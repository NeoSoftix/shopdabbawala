import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMeal } from "../../services/meal.service.js";
import { toast } from "react-hot-toast";
import { ButtonSpinner } from "../shared/Loader";

const DEFAULT_IMG = "https://placehold.co/128x128?text=No+Image";

const AddMeal = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Meal name is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("image", image);

      const res = await createMeal(formData);
      toast.success(res.message || "🎉 Meal created successfully!");
      setName("");
      setImage(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Failed to create meal."
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
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            {/* Meal Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Meal Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                placeholder="Enter meal name"
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                }}
                className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
                  errors.name ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-red-200"
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">⚠ {errors.name}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Meal Image</label>
              <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition hover:border-red-400">
                <div className="text-center">
                  {image ? (
                    <p className="text-xs text-green-600 font-medium">{image.name}</p>
                  ) : (
                    <p className="text-sm text-gray-400">Click to upload image</p>
                  )}
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

          {/* Preview */}
          {previewUrl && (
            <div className="rounded-lg border p-4">
              <p className="mb-2 text-sm text-gray-600">Selected Image</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="h-28 w-28 rounded-lg border object-cover"
                onError={(e) => { e.target.src = DEFAULT_IMG; e.target.onerror = null; }}
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
                setPreviewUrl(null);
                setErrors({});
              }}
              className="rounded-lg border px-5 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-red-600 px-6 py-2.5 font-medium text-white hover:bg-red-700 disabled:opacity-60 flex items-center gap-2 transition-colors"
            >
              {loading && <ButtonSpinner />}
              {loading ? "Saving..." : "Save Meal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMeal;
