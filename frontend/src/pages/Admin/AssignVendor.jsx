import { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "react-hot-toast";
import { Search, Trash2, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { getAllVendors, updateVendor } from "../../services/vendor.service.js";
import { getAllDeliveryCharges } from "../../services/deliveryCharge.service.js";

const PAGE_SIZE = 6;

// Assigns delivery pincodes to a vendor. Each vendor is onboarded for a
// single fixed package (chosen on Add Vendor) — so this page only needs a
// Vendor + Pincode, the package is read off the selected vendor. A pincode
// can only serve one vendor per package — the backend enforces this and
// returns a 409 on conflict.
const AssignVendor = () => {
  const [vendors, setVendors] = useState([]);
  const [deliveryCharges, setDeliveryCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [pincodeInput, setPincodeInput] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [removingKey, setRemovingKey] = useState("");

  // Searchable vendor dropdown
  const [vendorSearch, setVendorSearch] = useState("");
  const [isVendorDropdownOpen, setIsVendorDropdownOpen] = useState(false);
  const vendorDropdownRef = useRef(null);

  // Searchable pincode dropdown — options come from pincodes the admin has
  // already configured on the Delivery Charges page.
  const [isPincodeDropdownOpen, setIsPincodeDropdownOpen] = useState(false);
  const pincodeDropdownRef = useRef(null);

  // Assignments list search + pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  async function fetchVendors() {
    try {
      setLoading(true);
      const res = await getAllVendors();
      if (res.success) setVendors(res.data || []);
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
      toast.error("Failed to load vendors.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchDeliveryCharges() {
    try {
      const res = await getAllDeliveryCharges();
      if (res.success) setDeliveryCharges(res.data || []);
    } catch (error) {
      console.error("Failed to fetch delivery charges:", error);
    }
  }

  useEffect(() => {
    fetchVendors();
    fetchDeliveryCharges();
  }, []);

  // Close the vendor/pincode dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (vendorDropdownRef.current && !vendorDropdownRef.current.contains(e.target)) {
        setIsVendorDropdownOpen(false);
      }
      if (pincodeDropdownRef.current && !pincodeDropdownRef.current.contains(e.target)) {
        setIsPincodeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedVendor = vendors.find((v) => v._id === selectedVendorId);

  const vendorOptionLabel = (v) => `${v.organizationName} (${v.package?.name || "No package"})`;

  const filteredVendorOptions = useMemo(() => {
    const term = vendorSearch.trim().toLowerCase();
    if (!term) return vendors;
    // The field still shows the already-selected vendor's own composed
    // label (user reopened the dropdown without typing a new search) —
    // show every option instead of filtering by that exact string.
    if (selectedVendor && term === vendorOptionLabel(selectedVendor).toLowerCase()) {
      return vendors;
    }
    return vendors.filter(
      (v) =>
        v.organizationName?.toLowerCase().includes(term) ||
        v.package?.name?.toLowerCase().includes(term),
    );
  }, [vendors, vendorSearch, selectedVendor]);

  const handleSelectVendor = (vendor) => {
    setSelectedVendorId(vendor._id);
    setVendorSearch(vendorOptionLabel(vendor));
    setIsVendorDropdownOpen(false);
  };

  const filteredPincodeOptions = useMemo(() => {
    const term = pincodeInput.trim().toUpperCase().replace(/\s/g, "");
    if (!term) return deliveryCharges;
    return deliveryCharges.filter((dc) =>
      dc.pincode.toUpperCase().replace(/\s/g, "").includes(term),
    );
  }, [deliveryCharges, pincodeInput]);

  const handleSelectPincode = (dc) => {
    setPincodeInput(dc.pincode);
    setIsPincodeDropdownOpen(false);
  };

  // Flatten every vendor's servicePincodes into one row per (vendor, pincode)
  // for the assignments table.
  const assignments = vendors.flatMap((v) =>
    (v.servicePincodes || []).map((pincode) => ({
      vendorId: v._id,
      vendorName: v.organizationName,
      pincode,
      packageName: v.package?.name || "No package",
    })),
  );

  const handleAssign = async (e) => {
    e.preventDefault();

    if (!selectedVendorId) {
      toast.error("Please select a vendor.");
      return;
    }

    const vendor = vendors.find((v) => v._id === selectedVendorId);
    if (!vendor?.package) {
      toast.error("This vendor has no package assigned yet. Edit the vendor to set one first.");
      return;
    }

    const raw = pincodeInput.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const formatted = raw.length > 3 ? `${raw.slice(0, 3)} ${raw.slice(3)}` : raw;
    if (!/^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/.test(formatted)) {
      toast.error("Enter a valid Canadian postal code (e.g. A1A 1A1).");
      return;
    }

    if ((vendor.servicePincodes || []).includes(formatted)) {
      toast.error("This pincode is already assigned to this vendor.");
      return;
    }

    try {
      setAssigning(true);
      const data = new FormData();
      data.append(
        "servicePincodes",
        JSON.stringify([...(vendor.servicePincodes || []), formatted]),
      );

      const res = await updateVendor(selectedVendorId, data);
      if (res.success) {
        toast.success("Vendor assigned successfully!");
        setPincodeInput("");
        fetchVendors();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to assign vendor.",
      );
    } finally {
      setAssigning(false);
    }
  };

  const handleRemove = async (vendorId, pincode) => {
    const key = `${vendorId}:${pincode}`;
    try {
      setRemovingKey(key);
      const vendor = vendors.find((v) => v._id === vendorId);
      const updatedPincodes = (vendor?.servicePincodes || []).filter(
        (p) => p !== pincode,
      );

      const data = new FormData();
      data.append("servicePincodes", JSON.stringify(updatedPincodes));

      const res = await updateVendor(vendorId, data);
      if (res.success) {
        toast.success("Assignment removed.");
        fetchVendors();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to remove assignment.",
      );
    } finally {
      setRemovingKey("");
    }
  };

  const filteredAssignments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return assignments;
    return assignments.filter(
      (a) =>
        a.vendorName?.toLowerCase().includes(term) ||
        a.pincode.toLowerCase().replace(/\s/g, "").includes(term.replace(/\s/g, "")),
    );
  }, [assignments, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredAssignments.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedAssignments = filteredAssignments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8">
      {/* Assign Form — compact */}
      <div className="mx-auto w-full max-w-4xl rounded-xl border border-gray-100 bg-white p-5 shadow-sm mb-6">
        <h1 className="text-base font-bold text-slate-900">
          Assign Vendor to Pincode
        </h1>

        <form
          onSubmit={handleAssign}
          className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1 relative" ref={vendorDropdownRef}>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">
              Vendor <span className="text-[#e61e2d]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={vendorSearch}
                onChange={(e) => {
                  setVendorSearch(e.target.value);
                  setSelectedVendorId("");
                  setIsVendorDropdownOpen(true);
                }}
                onFocus={(e) => {
                  // Re-opening after a vendor is already selected: select the
                  // whole "Org (Package)" text so the dropdown shows every
                  // option again instead of filtering by that exact label.
                  if (selectedVendorId) e.target.select();
                  setIsVendorDropdownOpen(true);
                }}
                placeholder="Search vendor..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm focus:border-[#e61e2d] focus:outline-none"
              />
              <ChevronDown
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={14}
              />
            </div>

            {isVendorDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {filteredVendorOptions.length === 0 && (
                  <p className="px-3 py-2 text-sm text-gray-400">No vendors found.</p>
                )}
                {filteredVendorOptions.map((v) => (
                  <button
                    type="button"
                    key={v._id}
                    onClick={() => handleSelectVendor(v)}
                    className={`block w-full text-left px-3 py-2 text-sm hover:bg-red-50 ${selectedVendorId === v._id ? "bg-red-50 text-[#e61e2d] font-semibold" : "text-gray-700"}`}
                  >
                    {vendorOptionLabel(v)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 relative" ref={pincodeDropdownRef}>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">
              Pincode <span className="text-[#e61e2d]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={pincodeInput}
                onChange={(e) => {
                  setPincodeInput(e.target.value);
                  setIsPincodeDropdownOpen(true);
                }}
                onFocus={() => setIsPincodeDropdownOpen(true)}
                maxLength={7}
                placeholder="Search pincode..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm focus:border-[#e61e2d] focus:outline-none"
              />
              <ChevronDown
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={14}
              />
            </div>

            {isPincodeDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {filteredPincodeOptions.length === 0 && (
                  <p className="px-3 py-2 text-sm text-gray-400">
                    No pincodes found. Add one on the Delivery Charges page.
                  </p>
                )}
                {filteredPincodeOptions.map((dc) => (
                  <button
                    type="button"
                    key={dc._id}
                    onClick={() => handleSelectPincode(dc)}
                    className={`block w-full text-left px-3 py-2 text-sm hover:bg-red-50 ${pincodeInput === dc.pincode ? "bg-red-50 text-[#e61e2d] font-semibold" : "text-gray-700"}`}
                  >
                    {dc.pincode} <span className="text-gray-400">(${dc.charge})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={assigning || loading}
            className="rounded-lg bg-[#e61e2d] px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors whitespace-nowrap"
          >
            {assigning ? "Assigning..." : "Assign Vendor"}
          </button>
        </form>
        {selectedVendor && !selectedVendor.package && (
          <p className="mt-2 text-xs text-[#e61e2d]">
            This vendor has no package assigned yet. Edit the vendor to set one first.
          </p>
        )}
      </div>

      {/* All Assignments */}
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 p-5 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All Assignments
            </h2>
            <p className="text-sm text-gray-500">
              Manage which vendor serves which package in which pincode.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search vendor or pincode"
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-[#e61e2d] focus:outline-none"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {paginatedAssignments.length === 0 && !loading && (
            <p className="px-6 py-8 text-center text-gray-400">
              {searchTerm ? "No assignments match your search." : "No assignments yet."}
            </p>
          )}

          {paginatedAssignments.map((a) => {
            const key = `${a.vendorId}:${a.pincode}`;
            return (
              <div
                key={key}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{a.vendorName}</p>
                  <p className="text-xs text-gray-500">
                    {a.pincode} &middot; {a.packageName}
                  </p>
                </div>

                <button
                  onClick={() => handleRemove(a.vendorId, a.pincode)}
                  disabled={removingKey === key}
                  className="shrink-0 p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition disabled:opacity-60"
                  title="Remove"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>

        {filteredAssignments.length > PAGE_SIZE && (
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
            <p className="text-xs text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignVendor;
