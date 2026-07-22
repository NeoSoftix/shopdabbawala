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
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";

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

  // 6-character alphanumeric pincode.
  const handlePincodeChange = (e) => {
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    setForm((prev) => ({ ...prev, pincode: raw }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!vendor?._id) return;

    if (!/^[A-Za-z0-9]{6}$/.test(form.pincode)) {
      toast.error("Enter a valid 6-character pincode.");
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
    <div className="space-y-4">
      {/* Heading */}
      <div>
        <h1 className="text-xl font-bold">Profile</h1>

        <p className="text-sm text-gray-500 mt-0.5">
          Manage your vendor profile and business information
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left Card */}
        <div className="bg-white rounded-2xl border shadow-sm p-4">
          <div className="flex flex-col items-center">
            <div className="relative">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Vendor logo"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                  <FaStore size={32} className="text-[#E23747]" />
                </div>
              )}

              {isEditing && (
                <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#E23747] text-white flex items-center justify-center cursor-pointer">
                  <FaCamera size={13} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </label>
              )}
            </div>

            <h2 className="text-lg font-bold mt-3">{form.organizationName || "Vendor"}</h2>

            <span className="mt-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#E23747] text-xs">
              {vendor?.isActive ? "Active Vendor" : "Inactive Vendor"}
            </span>
          </div>

          <div className="border-t mt-4 pt-4 space-y-3">
            <div className="flex gap-3">
              <div className="w-9 h-9 shrink-0 rounded-full bg-red-50 flex items-center justify-center">
                <FaEnvelope size={14} className="text-[#E23747]" />
              </div>

              <div>
                <p className="text-sm font-medium">{form.email || "-"}</p>
                <p className="text-xs text-gray-500">Email Address</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-9 h-9 shrink-0 rounded-full bg-red-50 flex items-center justify-center">
                <FaPhone size={14} className="text-[#E23747]" />
              </div>

              <div>
                <p className="text-sm font-medium">{form.phone || "-"}</p>
                <p className="text-xs text-gray-500">Phone Number</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-9 h-9 shrink-0 rounded-full bg-red-50 flex items-center justify-center">
                <FaMapMarkerAlt size={14} className="text-[#E23747]" />
              </div>

              <div>
                <p className="text-sm font-medium">{form.city ? `${form.city}, ${form.state}` : "-"}</p>
                <p className="text-xs text-gray-500">Location</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-9 h-9 shrink-0 rounded-full bg-red-50 flex items-center justify-center">
                <FaCalendarAlt size={14} className="text-[#E23747]" />
              </div>

              <div>
                <p className="text-sm font-medium">
                  {vendor?.createdAt
                    ? new Date(vendor.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </p>
                <p className="text-xs text-gray-500">Member Since</p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setIsChangePasswordOpen(true)}
            className="w-full mt-5 !border-[#E23747] !text-[#E23747]"
          >
            <FaLock size={13} />
            Change Password
          </Button>

          <ChangePasswordModal
            isOpen={isChangePasswordOpen}
            onClose={() => setIsChangePasswordOpen(false)}
          />
        </div>

        {/* Right Form */}
        <div className="xl:col-span-2 bg-white rounded-2xl border shadow-sm p-4">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold">Business Information</h2>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (isEditing) {
                  setLogoFile(null);
                  setLogoPreview(vendor?.logo?.url || "");
                }
                setIsEditing((prev) => !prev);
              }}
              className="!border-[#E23747] !text-[#E23747]"
            >
              <FaEdit size={13} />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Business Name"
              type="text"
              name="organizationName"
              value={form.organizationName}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Input
              label="Business Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Input
              label="Phone Number"
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <Input
            wrapperClassName="mt-4"
            label="Address"
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <Input
              label="City"
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Input
              label="State"
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Input
              label="Pincode"
              type="text"
              name="pincode"
              maxLength={7}
              placeholder="e.g. A1A 1A1"
              value={form.pincode}
              onChange={handlePincodeChange}
              disabled={!isEditing}
            />
          </div>

          <Textarea
            wrapperClassName="mt-4"
            label="About Business"
            rows={3}
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={!isEditing}
          />

          {isEditing && (
            <Button onClick={handleSave} loading={saving} className="mt-4">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
