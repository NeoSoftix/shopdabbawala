import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("categories")) || [];

    setCategories(data);
  }, []);

  const handleDelete = (id) => {
    const updatedCategories = categories.filter(
      (category) => category.id !== id,
    );

    setCategories(updatedCategories);

    localStorage.setItem("categories", JSON.stringify(updatedCategories));
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    const updatedCategories = categories.map((category) =>
      category.id === selectedCategory.id ? selectedCategory : category,
    );

    setCategories(updatedCategories);

    localStorage.setItem("categories", JSON.stringify(updatedCategories));

    setIsEditOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>

          <p className="text-sm text-gray-500">Manage all categories</p>
        </div>

        <button
          onClick={() => navigate("/admin/categories/add")}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium"
        >
          + Add Category
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Search category..."
            className="w-full md:w-80 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Image
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Category Name
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Meal Type
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Food Type
                </th>

                <th className="px-5 py-4 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                        IMG
                      </div>
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-800">
                      {category.name}
                    </td>

                    <td className="px-5 py-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        {category.meal}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          category.foodType === "Veg"
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
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit3 size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">
                    No Categories Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditOpen && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-xl p-6">
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
                placeholder="Category Name"
                className="w-full border rounded-lg px-4 py-3"
              />

              <select
                value={selectedCategory.meal}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    meal: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-3"
              >
                <option value="Breakfast">Breakfast</option>

                <option value="Lunch">Lunch</option>

                <option value="Dinner">Dinner</option>
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
                <option value="Veg">Veg</option>

                <option value="Non Veg">Non Veg</option>
              </select>
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
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
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
