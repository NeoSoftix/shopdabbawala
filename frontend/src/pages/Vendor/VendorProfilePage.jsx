import { useState, useEffect } from "react";
import {
  FaStore,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCamera,
  FaEdit,
  FaLock,
} from "react-icons/fa";
import { getVendorProfile, updateVendor } from "../../services/vendor.service.js";
import { SectionLoader } from "../../components/shared/Loader";
import ChangePasswordModal from "../../components/shared/ChangePasswordModal";
import toast from "react-hot-toast";

export default function VendorProfilePage() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const [form, setForm] = useState({
    organizationName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    description: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getVendorProfile();
      const data = res.data;

      setVendor(data);
      setLogoPreview(data.logo?.url || "");
      setForm({
        organizationName: data.organizationName || "",
        email: data.userId?.email || "",
        phone: data.userId?.phone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
        description: data.description || "",
      });
    } catch {
      toast.error("Failed to load vendor profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Canadian postal code (A1A 1A1) — same format used on Add/Edit Vendor.
  const handlePincodeChange = (e) => {
    let raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (raw.length > 6) raw = raw.slice(0, 6);
    const formatted = raw.length > 3 ? `${raw.slice(0, 3)} ${raw.slice(3)}` : raw;
    setForm((prev) => ({ ...prev, pincode: formatted }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!vendor?._id) return;

    if (!/^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/.test(form.pincode)) {
      toast.error("Enter a valid Canadian postal code (e.g. A1A 1A1).");
      return;
    }

    try {
      setSaving(true);

      let payload;
      if (logoFile) {
        payload = new FormData();
        Object.entries(form).forEach(([key, value]) => payload.append(key, value));
        payload.append("logo", logoFile);
      } else {
        payload = form;
      }

      await updateVendor(vendor._id, payload);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setLogoFile(null);
      await fetchProfile();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SectionLoader />;

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>

        <p className="text-gray-500 mt-1">
          Manage your vendor profile and business information
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Card */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Vendor logo"
                  className="w-28 h-28 rounded-full object-cover"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-red-50 flex items-center justify-center">
                  <FaStore size={45} className="text-[#E23747]" />
                </div>
              )}

              {isEditing && (
                <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#E23747] text-white flex items-center justify-center cursor-pointer">
                  <FaCamera />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </label>
              )}
            </div>

            <h2 className="text-2xl font-bold mt-5">{form.organizationName || "Vendor"}</h2>

            <span className="mt-2 px-3 py-1 rounded-full bg-red-50 text-[#E23747] text-sm">
              {vendor?.isActive ? "Active Vendor" : "Inactive Vendor"}
            </span>
          </div>

          <div className="border-t mt-6 pt-6 space-y-5">
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
                <FaEnvelope className="text-[#E23747]" />
              </div>

              <div>
                <p className="font-medium">{form.email || "-"}</p>
                <p className="text-sm text-gray-500">Email Address</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
                <FaPhone className="text-[#E23747]" />
              </div>

              <div>
                <p className="font-medium">{form.phone || "-"}</p>
                <p className="text-sm text-gray-500">Phone Number</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
                <FaMapMarkerAlt className="text-[#E23747]" />
              </div>

              <div>
                <p className="font-medium">{form.city ? `${form.city}, ${form.state}` : "-"}</p>
                <p className="text-sm text-gray-500">Location</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
                <FaCalendarAlt className="text-[#E23747]" />
              </div>

              <div>
                <p className="font-medium">
                  {vendor?.createdAt
                    ? new Date(vendor.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </p>
                <p className="text-sm text-gray-500">Member Since</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsChangePasswordOpen(true)}
            className="w-full mt-8 border border-[#E23747] text-[#E23747] rounded-xl py-3 font-medium flex justify-center items-center gap-2"
          >
            <FaLock />
            Change Password
          </button>

          <ChangePasswordModal
            isOpen={isChangePasswordOpen}
            onClose={() => setIsChangePasswordOpen(false)}
          />
        </div>

        {/* Right Form */}
        <div className="xl:col-span-2 bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Business Information</h2>

            <button
              type="button"
              onClick={() => {
                if (isEditing) {
                  setLogoFile(null);
                  setLogoPreview(vendor?.logo?.url || "");
                }
                setIsEditing((prev) => !prev);
              }}
              className="px-4 py-2 border border-[#E23747] text-[#E23747] rounded-xl flex items-center gap-2"
            >
              <FaEdit />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium">Business Name</label>

              <input
                type="text"
                name="organizationName"
                value={form.organizationName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full mt-2 border rounded-xl px-4 py-3 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Business Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full mt-2 border rounded-xl px-4 py-3 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone Number</label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full mt-2 border rounded-xl px-4 py-3 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium">Address</label>

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full mt-2 border rounded-xl px-4 py-3 disabled:bg-gray-50"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-5 mt-5">
            <div>
              <label className="text-sm font-medium">City</label>

              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full mt-2 border rounded-xl px-4 py-3 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium">State</label>

              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full mt-2 border rounded-xl px-4 py-3 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Pincode</label>

              <input
                type="text"
                name="pincode"
                maxLength={7}
                placeholder="e.g. A1A 1A1"
                value={form.pincode}
                onChange={handlePincodeChange}
                disabled={!isEditing}
                className="w-full mt-2 border rounded-xl px-4 py-3 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium">About Business</label>

            <textarea
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full mt-2 border rounded-xl p-4 disabled:bg-gray-50"
            />
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="mt-6 bg-[#E23747] text-white px-6 py-3 rounded-xl font-medium disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
