import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const Categories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Indian",
      meal: "Breakfast",
      foodType: "Veg",
      image: "https://picsum.photos/id/292/200/200",
    },
    {
      id: 2,
      name: "Chinese",
      meal: "Lunch",
      foodType: "Non Veg",
      image: "https://picsum.photos/id/1080/200/200",
    },
    {
      id: 3,
      name: "South Indian",
      meal: "Dinner",
      foodType: "Veg",
      image: "https://picsum.photos/id/431/200/200",
    },
  ]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleDelete = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
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
    setIsEditOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}{" "}
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
              {categories.map((category) => (
                <tr key={category.id} className="border-b hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-14 h-14 rounded-lg object-cover border"
                    />
                  </td>

                  <td className="px-5 py-4 font-medium">{category.name}</td>

                  <td className="px-5 py-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                      {category.meal}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
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
                        className="text-blue-600"
                      >
                        <FiEdit3 size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
                value={selectedCategory.meal}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    meal: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-3"
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
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
                <option>Veg</option>
                <option>Non Veg</option>
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
                        image: URL.createObjectURL(file),
                      });
                    }
                  }}
                  className="w-full border rounded-lg px-4 py-3"
                />

                {selectedCategory.image && (
                  <img
                    src={selectedCategory.image}
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
