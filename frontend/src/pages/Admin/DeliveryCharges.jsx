import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { Pencil, Trash2, Search } from "lucide-react";
import {
  createDeliveryCharge,
  getAllDeliveryCharges,
  updateDeliveryCharge,
  deleteDeliveryCharge,
} from "../../services/deliveryCharge.service.js";
import Pagination from "../../components/shared/Pagination";
import AppLoader from "../../components/shared/AppLoader.jsx";

const PAGE_SIZE = 6;

// Lets the admin set a delivery charge per pincode. Used later at checkout
// to add a delivery fee based on the customer's pincode.
const DeliveryCharges = () => {
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pincodeInput, setPincodeInput] = useState("");
  const [chargeInput, setChargeInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  async function fetchCharges() {
    try {
      setLoading(true);
      const res = await getAllDeliveryCharges();
      if (res.success) setCharges(res.data || []);
    } catch (error) {
      console.error("Failed to fetch delivery charges:", error);
      toast.error("Failed to load delivery charges.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCharges();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setPincodeInput("");
    setChargeInput("");
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setPincodeInput(item.pincode);
    setChargeInput(String(item.charge));
  };

  const handlePincodeChange = (e) => {
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    setPincodeInput(raw);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[A-Za-z0-9]{6}$/.test(pincodeInput.trim())) {
      toast.error("Please enter a valid 6-character pincode.");
      return;
    }
    if (chargeInput === "" || Number(chargeInput) < 0 || Number.isNaN(Number(chargeInput))) {
      toast.error("Please enter a valid delivery charge.");
      return;
    }

    try {
      setSaving(true);
      const payload = { pincode: pincodeInput.trim(), charge: Number(chargeInput) };

      const res = editingId
        ? await updateDeliveryCharge(editingId, payload)
        : await createDeliveryCharge(payload);

      if (res.success) {
        toast.success(
          editingId ? "Delivery charge updated!" : "Delivery charge added!",
        );
        resetForm();
        fetchCharges();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to save delivery charge.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      const res = await deleteDeliveryCharge(id);
      if (res.success) {
        toast.success("Delivery charge removed.");
        if (editingId === id) resetForm();
        fetchCharges();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to remove delivery charge.",
      );
    } finally {
      setDeletingId("");
    }
  };

  const filteredCharges = useMemo(
    () =>
      charges.filter((item) =>
        item.pincode.toUpperCase().replace(/\s/g, "").includes(searchTerm),
      ),
    [charges, searchTerm],
  );

  const totalPages = Math.max(1, Math.ceil(filteredCharges.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedCharges = filteredCharges.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
    setPage(1);
  };

  if (loading) {
  return <AppLoader />;
}

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8">
      {/* Add / Edit Form — compact */}
      <div className="mx-auto w-full max-w-4xl rounded-xl border border-gray-100 bg-white p-5 shadow-sm mb-6">
        <h1 className="text-base font-bold text-slate-900">
          {editingId ? "Edit Delivery Charge" : "Add Delivery Charge"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-gray-500">
              Pincode <span className="text-[#e61e2d]">*</span>
            </label>
            <input
              type="text"
              maxLength={6}
              value={pincodeInput}
              onChange={handlePincodeChange}
              placeholder="e.g. AB1234"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#e61e2d] focus:outline-none"
            />
          </div>

          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-gray-500">
              Delivery Charge ($) <span className="text-[#e61e2d]">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={chargeInput}
              onChange={(e) => setChargeInput(e.target.value)}
              placeholder="Charge amount"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#e61e2d] focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#e61e2d] px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors whitespace-nowrap"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* All Delivery Charges */}
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 p-5 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All Delivery Charges
            </h2>
            <p className="text-sm text-gray-500">
              Manage delivery fees configured for each pincode.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              maxLength={6}
              placeholder="Search by pincode (e.g. AB1234)"
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-[#e61e2d] focus:outline-none"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {paginatedCharges.length === 0 && !loading && (
            <p className="px-6 py-8 text-center text-gray-400">
              {searchTerm
                ? "No delivery charges match this pincode."
                : "No delivery charges added yet."}
            </p>
          )}

          {paginatedCharges.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between gap-4 px-6 py-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div>
                  <p className="font-semibold text-gray-900">{item.pincode}</p>
                  <p className="text-xs text-gray-500">${item.charge} delivery fee</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${item.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => handleEditClick(item)}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                  className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition disabled:opacity-60"
                  title="Remove"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCharges.length > PAGE_SIZE && (
          <div className="border-t border-gray-100 px-6 py-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setPage(Math.max(1, Math.min(totalPages, p)))}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryCharges;
