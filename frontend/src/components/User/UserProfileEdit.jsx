import React, { useState, useEffect } from "react";
import { User, Phone, Mail, MapPin, AlertCircle } from "lucide-react";
import { updateCustomerProfile } from "../../services/customer.service";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

export default function UserProfileEdit({ isOpen, onClose }) {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", pincode: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        pincode: user.pincode || localStorage.getItem("pincode") || "",
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePincodeChange = (e) => {
    let raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (raw.length > 6) raw = raw.slice(0, 6);
    const formatted = raw.length > 3 ? `${raw.slice(0, 3)} ${raw.slice(3)}` : raw;
    setFormData({ ...formData, pincode: formatted });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/.test(formData.pincode)) {
      setError("Please enter a valid Canadian postal code (e.g. A1A 1A1).");
      return;
    }

    setLoading(true);

    try {
      const res = await updateCustomerProfile(formData);
      if (res.success && res.customer) {
        setUser(res.customer);
        toast.success("Profile updated successfully!");
        onClose();
      } else {
        throw new Error(res.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <User size={26} />
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Edit Profile Details</h2>
              <p className="text-slate-400 text-xs font-semibold mt-1">Keep your delivery details up-to-date.</p>
            </div>

            {error && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-600 text-center flex items-center justify-center gap-1.5">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Delivery Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-slate-400" size={16} />
                  <textarea
                    name="address"
                    required
                    rows={3}
                    placeholder="Street, City..."
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Pincode
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={7}
                    placeholder="e.g. A1A 1A1"
                    value={formData.pincode}
                    onChange={handlePincodeChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
                  />
                </div>
              </div>

              <Button type="submit" size="lg" loading={loading} className="font-black tracking-widest uppercase mt-2">
                {loading ? "Updating..." : "Save Profile Changes"}
              </Button>
            </form>
    </Modal>
  );
}
