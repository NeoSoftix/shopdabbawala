import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../../services/category.service.js";
import { getAllMeals } from "../../services/meal.service.js";

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await getAllMeals();
      setMeals(res.data || []);
    } catch (error) {
      console.log("Get all meals error", error);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllCategories();
      setCategories(res.data);
    } catch (error) {
      console.log("Get all categrioes error", error);
      setError(error?.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?",
    );
    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");
      await deleteCategory(id);
      setSuccess("Category deleted successfully");
      await fetchCategories();
    } catch (error) {
      console.log("Delete category error", error);
      setSuccess("");
      setError(error?.response?.data?.message || "Failed to delete category");
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditOpen(true);
    setError("");
    setSuccess("");
  };

  const handleUpdate = async () => {
    try {
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("name", selectedCategory.name);
      formData.append(
        "meal",
        selectedCategory.meal?._id || selectedCategory.meal || "",
      );
      formData.append("foodType", selectedCategory.foodType);

      if (selectedCategory.imageFile) {
        formData.append("image", selectedCategory.imageFile);
      }

      await updateCategory(selectedCategory._id, formData);
      await fetchCategories();
      setSuccess("Category updated successfully");
      setIsEditOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.log("Update category error", error);
      setSuccess("");
      setError(error?.response?.data?.message || "Failed to update category");
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-500 mt-1">Manage your categories.</p>
        </div>

        <button
          onClick={() => navigate("/admin/categories/add")}
          className="inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-2.5 text-white transition hover:bg-red-600"
        >
          Create Category
        </button>
      </div>

      {success && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3.5 text-sm text-emerald-800 shadow-sm backdrop-blur-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="font-medium">{success}</p>
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-rose-100 bg-rose-50/50 p-3.5 text-sm text-rose-800 shadow-sm backdrop-blur-sm">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-sm text-slate-600">
          <thead>
            <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-4">Image</th>
              <th className="px-4 py-4">Category Name</th>
              <th className="px-4 py-4">Meal Type</th>
              <th className="px-4 py-4">Food Type</th>
              <th className="px-4 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category, index) => (
              <tr
                key={category._id}
                className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
              >
                <td className="px-4 py-4 align-middle">
                  {category.image?.url ? (
                    <img
                      src={category.image.url}
                      alt={category.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-500">
                      No image
                    </div>
                  )}
                </td>

                <td className="px-4 py-4 align-middle font-medium text-slate-900">
                  {category.name}
                </td>

                <td className="px-4 py-4 align-middle">
                  <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {category.meal?.name || category.meal}
                  </span>
                </td>

                <td className="px-4 py-4 align-middle">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      category.foodType === "veg"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {category.foodType}
                  </span>
                </td>

                <td className="px-4 py-4 align-middle">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                      aria-label="Edit category"
                    >
                      <MdEdit size={20} />
                    </button>

                    <button
                      onClick={() => handleDelete(category._id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                      aria-label="Delete category"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Loading categories...
                </td>
              </tr>
            )}

            {!loading && categories.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No categories found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isEditOpen && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[600px] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Update Category</h2>

            <div className="mb-3">
              <label className="block mb-2">Category Name</label>
              <input
                type="text"
                value={selectedCategory.name}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    name: e.target.value,
                  })
                }
                className="w-full border p-3 rounded mb-3"
              />
            </div>

            <div className="mb-3">
              <label className="block mb-2">Meal</label>
              <select
                value={
                  selectedCategory.meal?._id || selectedCategory.meal || ""
                }
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    meal: e.target.value,
                  })
                }
                className="w-full border p-3 rounded mb-3"
              >
                <option value="">Select Meal</option>
                {meals.map((meal) => (
                  <option key={meal._id} value={meal._id}>
                    {meal.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block mb-2">Food Type</label>
              <select
                value={selectedCategory.foodType}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    foodType: e.target.value,
                  })
                }
                className="w-full border p-3 rounded mb-3"
              >
                <option value="veg">Veg</option>
                <option value="non-veg">Non Veg</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setSelectedCategory({
                      ...selectedCategory,
                      imageFile: file,
                      previewImage: URL.createObjectURL(file),
                    });
                  }
                }}
                className="w-full border p-3 rounded mb-3"
              />

              <div className="mb-3">
                {(selectedCategory.previewImage ||
                  selectedCategory.image?.url) && (
                  <img
                    src={
                      selectedCategory.previewImage ||
                      selectedCategory.image?.url
                    }
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedCategory(null);
                }}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
