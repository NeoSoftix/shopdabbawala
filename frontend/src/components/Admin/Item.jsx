import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  deleteItem,
  getAllItems,
  updateItem,
} from "../../services/items.service";
import { getAllCategories } from "../../services/category.service";
import { toast } from "react-hot-toast";
import { SectionLoader, ButtonSpinner } from "../shared/Loader";

const Item = () => {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updating, setUpdating] = useState(false);

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
      const res = await getAllItems();
      setItems(res.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to load items.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-sm text-gray-800">Delete this item?</p>
          <p className="text-xs text-gray-500">This action cannot be undone.</p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deleteItem(id);
                  toast.success("Item deleted successfully.");
                  fetchItems();
                } catch (error) {
                  toast.error(error?.response?.data?.message || "Failed to delete item.");
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

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("name", selectedItem.name);
      formData.append("description", selectedItem.description);
      formData.append(
        "category",
        selectedItem.category._id || selectedItem.category,
      );
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
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Items</h1>
          <p className="text-gray-500 mt-1">Manage your items.</p>
        </div>

        <button
          onClick={() => navigate("/admin/items/add")}
          className="inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-2.5 text-white transition hover:bg-red-600"
        >
          Create Item
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
        <table className="w-full min-w-[1000px] text-sm text-slate-600">
          <thead>
            <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-4">Image</th>
              <th className="px-4 py-4">Name</th>
              <th className="px-4 py-4">Description</th>
              <th className="px-4 py-4">Category</th>
              <th className="px-4 py-4">Meal Type</th>
              <th className="px-4 py-4">Allergies</th>
              <th className="px-4 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr
                key={item._id}
                className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
              >
                <td className="px-4 py-4 align-middle">
                  <img
                    src={item.image?.url || "https://placehold.co/56x56?text=No+Img"}
                    alt={item.name}
                    className="h-14 w-14 rounded-xl object-cover"
                    onError={(e) => { e.target.src = "https://placehold.co/56x56?text=No+Img"; e.target.onerror = null; }}
                  />
                </td>

                <td className="px-4 py-4 align-middle font-medium text-slate-900">
                  {item.name}
                </td>

                <td className="px-4 py-4 align-middle text-slate-600 max-w-[200px] truncate">
                  {item.description}
                </td>

                <td className="px-4 py-4 align-middle">
                  {item.category?.name}
                </td>

                <td className="px-4 py-4 align-middle">
                  <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {item.category?.meal?.name}
                  </span>
                </td>

                <td className="px-4 py-4 align-middle max-w-[200px] truncate">
                  {item.allergies?.join(", ")}
                </td>

                <td className="px-4 py-4 align-middle">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setIsEdit(true);
                      }}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                      aria-label="Edit item"
                    >
                      <MdEdit size={20} />
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                      aria-label="Delete item"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td colSpan="7">
                  <SectionLoader text="Loading items..." />
                </td>
              </tr>
            )}

            {!loading && items.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No items found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isEdit && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[600px] rounded-xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Update Item</h2>

            <div className="mb-3">
              <label className="block mb-2">Item Name</label>
              <input
                type="text"
                value={selectedItem.name || ""}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    name: e.target.value,
                  })
                }
                className="w-full border p-3 rounded mb-3"
              />
            </div>

            <div className="mb-3">
              <label className="block mb-2">Category</label>
              <select
                value={
                  selectedItem.category?._id || selectedItem.category || ""
                }
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    category: {
                      ...selectedItem.category,
                      _id: e.target.value,
                    },
                  })
                }
                className="w-full border p-3 rounded mb-3"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block mb-2">Description</label>
              <textarea
                rows="3"
                value={selectedItem.description || ""}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    description: e.target.value,
                  })
                }
                className="w-full border p-3 rounded mb-3"
              />
            </div>

            <div className="mb-3">
              <label className="block mb-2">Allergies</label>
              <input
                type="text"
                value={selectedItem.allergies?.join(", ") || ""}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    allergies: e.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full border p-3 rounded mb-3"
                placeholder="Comma separated"
              />
            </div>

            <div className="mb-3">
              <label className="block mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (file.size > 1 * 1024 * 1024) {
                      toast.error("Image must be 1MB or smaller.");
                      e.target.value = "";
                      return;
                    }
                    setSelectedItem({
                      ...selectedItem,
                      imageFile: file,
                      previewImage: URL.createObjectURL(file),
                    });
                  }
                }}
                className="w-full border p-3 rounded mb-3"
              />

              <div className="mb-3">
                {(selectedItem.previewImage || selectedItem.image?.url) && (
                  <img
                    src={
                      selectedItem.previewImage ||
                      selectedItem.image?.url ||
                      "https://placehold.co/96x96?text=No+Img"
                    }
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => { e.target.src = "https://placehold.co/96x96?text=No+Img"; e.target.onerror = null; }}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEdit(false);
                  setSelectedItem(null);
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

export default Item;
