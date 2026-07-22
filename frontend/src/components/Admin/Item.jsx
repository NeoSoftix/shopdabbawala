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
import { confirmDeleteToast } from "../../utils/confirmDeleteToast";
import { toTitleCase } from "../../utils/format";
import { SectionLoader } from "../shared/Loader";
import Pagination from "../shared/Pagination";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

const DEFAULT_PREVIEW =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#FEE2E2"/><circle cx="50" cy="50" r="30" fill="#ffffff" stroke="#E31A1A" stroke-width="2"/><g fill="#E31A1A"><rect x="28" y="30" width="2.5" height="18"/><rect x="33" y="30" width="2.5" height="18"/><rect x="38" y="30" width="2.5" height="18"/><rect x="27" y="48" width="15" height="3" rx="1.5"/><rect x="33" y="48" width="3" height="22"/><ellipse cx="68" cy="38" rx="6" ry="9"/><rect x="66.5" y="46" width="3" height="24"/></g></svg>'
  );

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setEditPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    fetchItems(page, categoryFilter);
  }, [page, categoryFilter]);

  useEffect(() => {
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

  const fetchItems = async (pageNum = 1, category = "") => {
    try {
      setLoading(true);
      const res = await getAllItems(pageNum, 10, category);
      setItems(res.data);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to load items.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
    setPage(1);
  };

  const handleDelete = (id) => {
    confirmDeleteToast("Delete this item?", async () => {
      try {
        await deleteItem(id);
        toast.success("Item deleted successfully.");
        fetchItems(page, categoryFilter);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete item.");
      }
    });
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);

      const data = new FormData();
      data.append("name", selectedItem.name);
      data.append("description", selectedItem.description);
      data.append("category", selectedItem.category._id || selectedItem.category);
      data.append("allergies", JSON.stringify(selectedItem.allergies || []));
      if (editImage) data.append("image", editImage);

      await updateItem(selectedItem._id, data);
      setSuccess("Item updated successfully");
      setIsEdit(false);
      setEditImage(null);
      setEditPreview("");
      fetchItems(page, categoryFilter);
    } catch (error) {
      console.log("Update Item Error", error);
      setError(error?.response?.data?.message || "Failed to update item");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Items</h1>
          {/* <p className="text-gray-500 mt-1">Manage your items.</p> */}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Select
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
            className="min-w-[180px] py-2!"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {toTitleCase(category.name)}
              </option>
            ))}
          </Select>

          <Button onClick={() => navigate("/admin/items/add")} className="rounded-full! whitespace-nowrap! shrink-0">
            Create Item
          </Button>
        </div>
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
        <table className="w-full min-w-[1000px] text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <th className="py-2 px-4">Image</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Allergies</th>
              <th className="py-2 px-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {items.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50/40 transition-colors duration-150"
              >
                <td className="py-2 px-3">
                  <img
                    src={item.image?.url || DEFAULT_PREVIEW}
                    alt={item.name}
                    className="h-10 w-10 rounded-lg object-cover border border-gray-100"
                    onError={(e) => {
                      e.target.src = DEFAULT_PREVIEW;
                      e.target.onerror = null;
                    }}
                  />
                </td>

                <td className="py-2 px-3 text-sm font-semibold text-gray-800">
                  {item.name}
                </td>

                <td className="py-2 px-3 text-sm text-gray-500 max-w-[200px] truncate">
                  {item.description}
                </td>

                <td className="py-2 px-3 text-sm text-gray-600">
                  {toTitleCase(item.category?.name)}
                </td>

                <td className="py-2.5 px-4 text-sm text-gray-500 max-w-[200px] truncate">
                  {item.allergies?.join(", ")}
                </td>

                <td className="py-2.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setEditImage(null);
                        setEditPreview(item.image?.url || "");
                        setIsEdit(true);
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                      aria-label="Edit item"
                    >
                      <MdEdit size={15} />
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                      aria-label="Delete item"
                    >
                      <MdDelete size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td colSpan="6">
                  <SectionLoader text="Loading items..." />
                </td>
              </tr>
            )}

            {!loading && items.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-8 text-sm text-gray-400"
                >
                  No items found. Create one to get started.
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

      <Modal
        isOpen={isEdit && !!selectedItem}
        onClose={() => {
          setIsEdit(false);
          setSelectedItem(null);
          setEditImage(null);
          setEditPreview("");
        }}
        wide
        showCloseButton
      >
        {selectedItem && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Update Item</h2>

            <div className="mb-4 flex flex-col items-center justify-center text-center">
              <img
                src={editPreview || DEFAULT_PREVIEW}
                alt="Item"
                className="h-24 w-24 rounded-2xl border-4 border-red-100 object-cover shadow-sm"
                onError={(e) => {
                  e.target.src = DEFAULT_PREVIEW;
                  e.target.onerror = null;
                }}
              />
              <label className="mt-3 cursor-pointer rounded-lg bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors shadow-sm">
                Change Image
                <input type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
              </label>
            </div>

            <div className="space-y-3">
              <Input
                label="Item Name"
                type="text"
                value={selectedItem.name || ""}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    name: e.target.value,
                  })
                }
              />

              <Select
                label="Category"
                value={selectedItem.category?._id || selectedItem.category || ""}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    category: {
                      ...selectedItem.category,
                      _id: e.target.value,
                    },
                  })
                }
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {toTitleCase(category.name)}
                  </option>
                ))}
              </Select>

              <Textarea
                label="Description"
                rows="3"
                value={selectedItem.description || ""}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    description: e.target.value,
                  })
                }
              />

              <Input
                label="Allergies"
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
                placeholder="Comma separated"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEdit(false);
                  setSelectedItem(null);
                  setEditImage(null);
                  setEditPreview("");
                }}
                disabled={updating}
              >
                Cancel
              </Button>

              <Button onClick={handleUpdate} loading={updating}>
                {updating ? "Updating..." : "Update"}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Item;
