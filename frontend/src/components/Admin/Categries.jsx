import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import {
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../../service/category.service.js";
import { getAllMeals } from "../../service/meal.service.js";

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

      console.log(res.data)
    } catch (error) {
      console.log("Get all categrioes error", error);

      setError(error?.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

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
        selectedCategory.meal?._id || selectedCategory.meal || ""
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
    <div className="p-4 md:p-6">
      {/* Header */}{" "}
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {" "}
        <div>
          {" "}
          <h1 className="text-2xl font-bold text-gray-800">Categories </h1>
          <p className="text-sm text-gray-500">Manage all categories</p>
        </div>
        <button
          onClick={() => navigate("/admin/categories/add")}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium"
        >
          + Add Category
        </button>
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-5 py-4 text-left">Image</th>

                <th className="px-5 py-4 text-left">Category Name</th>

                <th className="px-5 py-4 text-left">Meal Type</th>

                <th className="px-5 py-4 text-left">Food Type</th>

                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category._id} className="border-b hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <img
                        src={category.image?.url}
                        alt={category.name}
                        className="w-14 h-14 rounded-lg object-cover border"
                      />
                    </td>

                    <td className="px-5 py-4 font-medium">{category.name}</td>

                    <td className="px-5 py-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                        {category.meal?.name || category.meal}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          category.foodType === "veg"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {category.foodType}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600"
                        >
                          <FiEdit3 size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(category._id)}
                          className="text-red-600"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit Modal */}
      {isEditOpen && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-6">Edit Category</h2>

            <div className="space-y-4">
              <input
                type="text"
                value={selectedCategory.name}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    name: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-3"
              />

              <select
                value={selectedCategory.meal?._id || selectedCategory.meal || ""}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    meal: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-3"
              >
                <option value="">Select Meal</option>
                {meals.map((meal) => (
                  <option key={meal._id} value={meal._id}>
                    {meal.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory.foodType}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    foodType: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-3"
              >
                <option value="veg">Veg</option>
                <option value="non-veg">Non Veg</option>
              </select>

              <div>
                <label className="block mb-2 font-medium">Category Image</label>

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
                  className="w-full border rounded-lg px-4 py-3"
                />

                {(selectedCategory.previewImage ||
                  selectedCategory.image?.url) && (
                  <img
                    src={
                      selectedCategory.previewImage ||
                      selectedCategory.image?.url
                    }
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border mt-3"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedCategory(null);
                }}
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="bg-red-600 text-white px-5 py-2 rounded-lg"
              >
                Update Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
