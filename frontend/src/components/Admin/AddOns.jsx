import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  getAllAddOns,
  deleteAddOn,
  updateAddOn,
  toggleStatus,
} from "../../service/addOn.service.js";

const AddOns = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [updateImage, setUpdateImage] = useState(null);
  const [selectedAddOn, setSelectedAddOn] = useState(null);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAddOns = async () => {
    try {
      setLoading(true);

      const response = await getAllAddOns();

      setAddons(response.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddOns();
  }, []);

  const getStatusBadge = (isActive) =>
    isActive
      ? "inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700"
      : "inline-flex rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700";

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure?");

      if (!confirmDelete) return;

      await deleteAddOn(id);

      fetchAddOns();
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleStatus(id);
      fetchAddOns();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("name", selectedAddOn.name);
      formData.append("description", selectedAddOn.description);
      formData.append("price", selectedAddOn.price);

      selectedAddOn.allergies
        .split(",")
        .map((item) => item.trim())
        .forEach((item) => {
          if (item) {
            formData.append("allergies", item);
          }
        });

      if (updateImage) {
        formData.append("image", updateImage);
      }

      await updateAddOn(selectedAddOn._id, formData);

      setShowModal(false);
      setSelectedAddOn(null);
      setUpdateImage(null);

      fetchAddOns();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Add Ons</h1>
          <p className="text-gray-500 mt-1">
            Manage your add-on items and toggle availability.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/add-on/add")}
          className="inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-2.5 text-white transition hover:bg-red-600"
        >
          Create Add On
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-sm text-slate-600">
          <thead>
            <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-4">Image</th>
              <th className="px-4 py-4">Name</th>
              <th className="px-4 py-4">Description</th>
              <th className="px-4 py-4">Allergies</th>
              <th className="px-4 py-4">Price</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {addons.map((addon, index) => (
              <tr
                key={addon._id}
                className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
              >
                <td className="px-4 py-4 align-middle">
                  {addon.image?.url ? (
                    <img
                      src={addon.image.url}
                      alt={addon.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-500">
                      No image
                    </div>
                  )}
                </td>

                <td className="px-4 py-4 align-middle font-medium text-slate-900">
                  {addon.name}
                </td>

                <td className="px-4 py-4 align-middle text-slate-600 max-w-[260px] truncate">
                  {addon.description}
                </td>

                <td className="px-4 py-4 align-middle text-slate-600 max-w-[220px] truncate">
                  {addon.allergies?.join(", ")}
                </td>

                <td className="px-4 py-4 align-middle font-semibold text-slate-900">
                  ₹{addon.price}
                </td>

                <td className="px-4 py-4 align-middle">
                  <span className={getStatusBadge(addon.isActive)}>
                    {addon.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-4 py-4 align-middle">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(addon._id)}
                      className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                      {addon.isActive ? "Disable" : "Enable"}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedAddOn({
                          ...addon,
                          allergies: addon.allergies?.join(", "),
                        });
                        setUpdateImage(null);
                        setShowModal(true);
                      }}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                      aria-label="Edit add on"
                    >
                      <MdEdit size={20} />
                    </button>

                    <button
                      onClick={() => handleDelete(addon._id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                      aria-label="Delete add on"
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
                  colSpan="7"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Loading add-ons...
                </td>
              </tr>
            )}

            {!loading && addons.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No add-ons found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* update modal */}
      {showModal && selectedAddOn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[600px] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Update Add On</h2>

            <input
              type="text"
              value={selectedAddOn.name}
              onChange={(e) =>
                setSelectedAddOn({
                  ...selectedAddOn,
                  name: e.target.value,
                })
              }
              className="w-full border p-3 rounded mb-3"
            />

            <textarea
              value={selectedAddOn.description}
              onChange={(e) =>
                setSelectedAddOn({
                  ...selectedAddOn,
                  description: e.target.value,
                })
              }
              className="w-full border p-3 rounded mb-3"
            />

            <input
              type="number"
              value={selectedAddOn.price}
              onChange={(e) =>
                setSelectedAddOn({
                  ...selectedAddOn,
                  price: e.target.value,
                })
              }
              className="w-full border p-3 rounded mb-3"
            />

            <input
              type="text"
              value={selectedAddOn.allergies}
              onChange={(e) =>
                setSelectedAddOn({
                  ...selectedAddOn,
                  allergies: e.target.value,
                })
              }
              className="w-full border p-3 rounded mb-3"
            />

            <div className="mb-3">
              <label className="block mb-2">Image</label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUpdateImage(e.target.files[0])}
                className="w-full border p-3 rounded"
              />

              <div className="mb-3">
                <img
                  src={
                    updateImage
                      ? URL.createObjectURL(updateImage)
                      : selectedAddOn.image?.url
                  }
                  alt="preview"
                  className="w-24 h-24 object-cover rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedAddOn(null);
                  setUpdateImage(null);
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

export default AddOns;
