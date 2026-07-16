import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../../services/category.service.js";
import { toast } from "react-hot-toast";
import { SectionLoader, ButtonSpinner } from "../shared/Loader";
import Pagination from "../shared/Pagination";

const PAGE_SIZE = 10;

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updating, setUpdating] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAllCategories();
      setCategories(res.data);
      setPage(1);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(categories.length / PAGE_SIZE));
  const paginatedCategories = categories.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-sm text-gray-800">Delete this category?</p>
          <p className="text-xs text-gray-500">This action cannot be undone.</p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deleteCategory(id);
                  toast.success("Category deleted successfully.");
                  fetchCategories();
                } catch (error) {
                  toast.error(error?.response?.data?.message || "Failed to delete category.");
                }
              }}
              className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 8000 }
    );
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditOpen(true);
    setError("");
    setSuccess("");
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      await updateCategory(selectedCategory._id, {
        name: selectedCategory.name,
        foodType: selectedCategory.foodType,
      });
      await fetchCategories();
      setSuccess("Category updated successfully");
      setIsEditOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.log("Update category error", error);
      setSuccess("");
      setError(error?.response?.data?.message || "Failed to update category");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="px-5 py-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-gray-500 mt-1">Manage your categories.</p>
        </div>

        <button
          onClick={() => navigate("/admin/categories/add")}
          className="inline-flex items-center justify-center rounded-full bg-red-500 px-4 py-1.5 text-white transition hover:bg-red-600"
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

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <th className="py-2.5 px-4">Category Name</th>
              <th className="py-2.5 px-4">Food Type</th>
              <th className="py-2.5 px-4">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {paginatedCategories.map((category) => (
              <tr
                key={category._id}
                className="hover:bg-gray-50/40 transition-colors duration-150"
              >
                <td className="py-2.5 px-4 text-sm font-semibold text-gray-800">
                  {category.name}
                </td>

                <td className="py-2.5 px-4">
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

                <td className="py-2.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                      aria-label="Edit category"
                    >
                      <MdEdit size={15} />
                    </button>

                    <button
                      onClick={() => handleDelete(category._id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                      aria-label="Delete category"
                    >
                      <MdDelete size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td colSpan="3">
                  <SectionLoader text="Loading categories..." />
                </td>
              </tr>
            )}

            {!loading && categories.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-8 text-sm text-gray-400"
                >
                  No categories found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

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

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedCategory(null);
                }}
                disabled={updating}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={updating}
                className="bg-red-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {updating && <ButtonSpinner />}
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
