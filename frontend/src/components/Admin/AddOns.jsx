import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  getAllAddOns,
  deleteAddOn,
  updateAddOn,
  toggleStatus,
} from "../../services/addOn.service.js";
import { toast } from "react-hot-toast";
import { SectionLoader, ButtonSpinner } from "../shared/Loader";
import Pagination from "../shared/Pagination";
import { FALLBACK_ADDON_IMAGE } from "../User/AddOnsSection/addOnsUtils";

const AddOns = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedAddOn, setSelectedAddOn] = useState(null);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState("");

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setEditPreview(URL.createObjectURL(file));
    }
  };

  const fetchAddOns = async (pageNum = 1) => {
    try {
      setLoading(true);

      const response = await getAllAddOns(pageNum);

      setAddons(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddOns(page);
  }, [page]);

  const getStatusBadge = (isActive) =>
    isActive
      ? "inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700"
      : "inline-flex rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700";

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-sm text-gray-800">Delete this add-on?</p>
          <p className="text-xs text-gray-500">This action cannot be undone.</p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deleteAddOn(id);
                  toast.success("Add-on deleted successfully.");
                  fetchAddOns(page);
                } catch (error) {
                  toast.error("Failed to delete add-on.");
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

  const handleToggleStatus = async (id) => {
    try {
      await toggleStatus(id);
      fetchAddOns(page);
    } catch (error) {
      console.log(error);
    }
  };

  const validateAddOn = () => {
    const newErrors = {};
    if (!selectedAddOn.name?.trim()) newErrors.name = "Name is required.";
    if (!selectedAddOn.description?.trim())
      newErrors.description = "Description is required.";
    if (!selectedAddOn.price || Number(selectedAddOn.price) <= 0)
      newErrors.price = "Enter a valid price.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateAddOn()) return;
    try {
      setUpdating(true);

      const allergies = selectedAddOn.allergies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const data = new FormData();
      data.append("name", selectedAddOn.name);
      data.append("description", selectedAddOn.description);
      data.append("price", selectedAddOn.price);
      data.append("allergies", JSON.stringify(allergies));
      if (editImage) data.append("image", editImage);

      await updateAddOn(selectedAddOn._id, data);

      setShowModal(false);
      setSelectedAddOn(null);
      setEditImage(null);
      setEditPreview("");

      fetchAddOns(page);
      toast.success("Add-on updated successfully.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update add-on.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Ons</h1>
          {/* <p className="text-gray-500 mt-1">
            Manage your add-on items and toggle availability.
          </p> */}
        </div>

        <button
          onClick={() => navigate("/admin/add-on/add")}
          className="inline-flex items-center justify-center rounded-full bg-red-500 px-3 py-2 text-white transition hover:bg-red-600"
        >
          Create Add On
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <th className="py-2 px-4">Image</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Allergies</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {addons.map((addon) => (
              <tr
                key={addon._id}
                className="hover:bg-gray-50/40 transition-colors duration-150"
              >
                <td className="py-2.5 px-4">
                  <img
                    src={addon.image?.url || FALLBACK_ADDON_IMAGE}
                    alt={addon.name}
                    className="h-10 w-10 rounded-lg object-cover border border-gray-100"
                    onError={(e) => {
                      e.target.src = FALLBACK_ADDON_IMAGE;
                      e.target.onerror = null;
                    }}
                  />
                </td>

                <td className="py-2.5 px-4 text-sm font-semibold text-gray-800">
                  {addon.name}
                </td>

                <td className="py-2.5 px-4 text-sm text-gray-500 max-w-[260px] truncate">
                  {addon.description}
                </td>

                <td className="py-2.5 px-4 text-sm text-gray-500 max-w-[220px] truncate">
                  {addon.allergies?.join(", ")}
                </td>

                <td className="py-2.5 px-4 text-sm font-bold text-gray-900">
                  ${addon.price}
                </td>

                <td className="py-2.5 px-4">
                  <span className={getStatusBadge(addon.isActive)}>
                    {addon.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="py-2.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleStatus(addon._id)}
                      className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
                    >
                      {addon.isActive ? "Disable" : "Enable"}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedAddOn({
                          ...addon,
                          allergies: addon.allergies?.join(", "),
                        });
                        setErrors({});
                        setEditImage(null);
                        setEditPreview(addon.image?.url || "");
                        setShowModal(true);
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                      aria-label="Edit add on"
                    >
                      <MdEdit size={15} />
                    </button>

                    <button
                      onClick={() => handleDelete(addon._id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                      aria-label="Delete add on"
                    >
                      <MdDelete size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td colSpan="7">
                  <SectionLoader text="Loading add-ons..." />
                </td>
              </tr>
            )}

            {!loading && addons.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-8 text-sm text-gray-400"
                >
                  No add-ons found. Create one to get started.
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

      {/* update modal */}
      {showModal && selectedAddOn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[600px] rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Update Add On</h2>

            <div className="mb-4 flex flex-col items-center justify-center text-center">
              <img
                src={editPreview || FALLBACK_ADDON_IMAGE}
                alt="Add-on"
                className="h-24 w-24 rounded-2xl border-4 border-red-100 object-cover shadow-sm"
                onError={(e) => {
                  e.target.src = FALLBACK_ADDON_IMAGE;
                  e.target.onerror = null;
                }}
              />
              <label className="mt-3 cursor-pointer rounded-lg bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors shadow-sm">
                Change Image
                <input type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
              </label>
            </div>

            <div className="mb-3">
              <input
                type="text"
                placeholder="Name"
                value={selectedAddOn.name}
                onChange={(e) =>
                  setSelectedAddOn({
                    ...selectedAddOn,
                    name: e.target.value,
                  })
                }
                className="w-full border p-3 rounded"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="mb-3">
              <textarea
                placeholder="Description"
                value={selectedAddOn.description}
                onChange={(e) =>
                  setSelectedAddOn({
                    ...selectedAddOn,
                    description: e.target.value,
                  })
                }
                className="w-full border p-3 rounded"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div className="mb-3">
              <input
                type="number"
                placeholder="Price"
                value={selectedAddOn.price}
                onChange={(e) =>
                  setSelectedAddOn({
                    ...selectedAddOn,
                    price: e.target.value,
                  })
                }
                className="w-full border p-3 rounded"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <input
              type="text"
              placeholder="Allergies (comma separated)"
              value={selectedAddOn.allergies}
              onChange={(e) =>
                setSelectedAddOn({
                  ...selectedAddOn,
                  allergies: e.target.value,
                })
              }
              className="w-full border p-3 rounded mb-3"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedAddOn(null);
                  setErrors({});
                  setEditImage(null);
                  setEditPreview("");
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

export default AddOns;
