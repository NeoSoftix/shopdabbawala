import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiEditAlt } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { deleteItem, getAllItems, updateItem } from "../service/items.service";
import { getAllCategories } from "../service/category.service";

const Item = () => {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();

      setCategories(res.data);
    } catch (error) {
      console.log("Fetch categories error", error);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllItems();

      setItems(res.data);
    } catch (error) {
      console.log("Fetch items error");

      setError(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this item?");

    if (!confirmDelete) return;
    try {
      await deleteItem(id);

      setSuccess("Successfully Delete Item");

      fetchItems();
    } catch (error) {
      console.log("Delete Item error", error);

      setError(error?.response?.data?.message || "Failed to delete item");
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("name", selectedItem.name);
      formData.append("description", selectedItem.description);

      formData.append("category", selectedItem.category._id);

      formData.append("allergies", selectedItem.allergies.join(","));

      if (selectedItem.imageFile) {
        formData.append("image", selectedItem.imageFile);
      }

      await updateItem(selectedItem._id, formData);

      setSuccess("Item updated successfully");

      setIsEdit(false);

      fetchItems();
    } catch (error) {
      console.log("Update Item Error", error);

      setError(error?.response?.data?.message || "Failed to update item");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      {success && (
        <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 text-sm font-medium text-emerald-800 shadow-sm animate-fade-in">
          <svg
            className="h-4 w-4 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-rose-100 bg-rose-50/50 p-3 text-sm font-medium text-rose-800 shadow-sm animate-fade-in">
          <svg
            className="h-4 w-4 text-rose-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Items</h1>

          <p className="text-gray-500">Manage all items</p>
        </div>

        <button
          onClick={() => navigate("/admin/items/add")}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-medium"
        >
          + Add Item
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Category</th>
                <th className="p-4">Meal Type</th>
                <th className="p-4">Allergies</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <img
                        src={item.image?.url}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    </td>

                    <td className="p-4 font-medium">{item.name}</td>

                    <td className="p-4 max-w-[250px] text-gray-600">
                      {item.description}
                    </td>

                    <td className="p-4">{item.category?.name}</td>

                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                        {item.category?.mealType}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {item.allergies?.map((allergy, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-red-100 text-red-600 rounded-md text-xs"
                          >
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsEdit(true);
                          }}
                          className="px-3 py-1 border border-red-500 text-red-500 rounded-lg"
                        >
                          <BiEditAlt />
                        </button>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg"
                        >
                          <MdDeleteOutline />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    No Items Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6">Edit Item</h2>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block mb-2">Item Name</label>

                <input
                  type="text"
                  value={selectedItem?.name || ""}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      name: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2">Category</label>

                <select
                  value={selectedItem?.category?._id || ""}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      category: {
                        ...selectedItem.category,
                        _id: e.target.value,
                      },
                    })
                  }
                  className="w-full border p-3 rounded-lg"
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block mb-2">Description</label>

                <textarea
                  rows="4"
                  value={selectedItem?.description || ""}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      description: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2">Allergies</label>

                <input
                  type="text"
                  value={selectedItem?.allergies?.join(", ") || ""}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      allergies: e.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full border p-3 rounded-lg"
                />

                {(selectedItem?.previewImage || selectedItem?.image?.url) && (
                  <img
                    src={selectedItem.previewImage || selectedItem.image?.url}
                    alt="Preview"
                    className="w-24 h-24 rounded-lg mt-3 object-cover border"
                  />
                )}
              </div>

              <div>
                <label className="block mb-2">Image</label>

                <input
                  type="file"
                  className="w-full border p-3 rounded-lg"
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (file) {
                      setSelectedItem({
                        ...selectedItem,
                        imageFile: file,
                        previewImage: URL.createObjectURL(file),
                      });
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEdit(false)}
                className="border px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="bg-red-500 text-white px-5 py-2 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;
