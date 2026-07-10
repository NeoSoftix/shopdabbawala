import { useState, useEffect } from "react";
import {
  assignVendor,
  getAllAssignments,
  removeAssignment,
} from "../../services/vendorAssignment.service";
import { getAllVendors } from "../../services/vendor.service";
import { getActivePackages } from "../../services/package.service";

export default function AssignVendor() {
  const [assignments, setAssignments] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    vendor: "",
    pincode: "",
    package: "",
  });

  const fetchAssignments = async () => {
    try {
      const res = await getAllAssignments();
      setAssignments(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch assignments");
    }
  };

  const fetchVendors = async () => {
    try {
      const res = await getAllVendors();
      setVendors(res.data || []);
    } catch (err) {
      console.error("Get Vendors Error", err);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await getActivePackages();
      setPackages(res.data || []);
    } catch (err) {
      console.error("Get Packages Error", err);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchVendors();
    fetchPackages();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vendor || !formData.pincode || !formData.package) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const res = await assignVendor(formData);
      setSuccess(res?.message || "Vendor Assigned Successfully");

      setFormData({ vendor: "", pincode: "", package: "" });
      fetchAssignments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign vendor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeAssignment(id);
      setSuccess("Assignment Removed Successfully");
      fetchAssignments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove assignment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Assign Vendor Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Assign Vendor to Pincode + Package
        </h2>

        <p className="text-gray-500 mt-2 mb-6">
          A package can only be assigned to one vendor per pincode.
        </p>

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 border border-green-300">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Vendor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
              >
                <option value="">Select Vendor</option>
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.organizationName}
                  </option>
                ))}
              </select>
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pincode"
                placeholder="Enter Pincode"
                onChange={handleChange}
                value={formData.pincode}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Package */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                name="package"
                value={formData.package}
                onChange={handleChange}
              >
                <option value="">Select Package</option>
                {packages.map((pkg) => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="mt-6 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-xl transition disabled:opacity-60"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Assigning..." : "Assign Vendor"}
          </button>
        </form>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">All Assignments</h2>
          <p className="text-gray-500 mt-1">
            Manage which vendor serves which package in which pincode.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">#</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Vendor</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Pincode</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Package</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>

            <tbody>
              {assignments.map((assignment, index) => (
                <tr
                  key={assignment._id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-medium text-gray-800">
                    {assignment.vendor?.organizationName || "N/A"}
                  </td>
                  <td className="p-4 text-gray-600">{assignment.pincode}</td>
                  <td className="p-4 text-gray-600">
                    {assignment.package?.name || "N/A"}
                  </td>
                  <td className="p-4">
                    <button
                      className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition"
                      onClick={() => handleDelete(assignment._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}

              {assignments.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No vendor assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
