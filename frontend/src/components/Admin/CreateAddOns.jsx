import React, { useState } from "react";
import { createAddOn } from "../../services/addOn.service.js";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { ButtonSpinner } from "../shared/Loader";

const DEFAULT_IMG = "https://placehold.co/160x160?text=No+Image";

const CreateAddOns = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    allergies: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Add-on name is required.";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0)
      newErrors.price = "Please enter a valid price greater than 0.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);

      formData.allergies
        .split(",")
        .map((item) => item.trim())
        .forEach((item) => { if (item) data.append("allergies", item); });

      if (image) data.append("image", image);

      const response = await createAddOn(data);
      toast.success(response.message || "Add-on created successfully!");

      setFormData({ name: "", description: "", price: "", allergies: "" });
      setImage(null);
      setPreviewUrl(null);
      setErrors({});
    } catch (error) {
      let errMessage = error?.response?.data?.message;
      if (
        !errMessage &&
        typeof error?.response?.data === "string" &&
        error.response.data.includes("Only jpg, jpeg, png, webp files are allowed")
      ) {
        errMessage = "Only jpg, jpeg, png, webp files are allowed.";
      }
      toast.error(errMessage || "Failed to create Add-On.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Add Add-On</h1>
          <p className="text-gray-500 mt-1">Create a new add-on for meals</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin/add-on")}
          className="px-5 py-3 border rounded-xl bg-white hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Add-Ons
        </button>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block mb-1.5 font-medium text-gray-700">
              Add-On Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter add-on name"
              className={`w-full border rounded-xl p-3 focus:outline-none focus:ring-2 ${
                errors.name ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-red-200"
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.name}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1.5 font-medium text-gray-700">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              className={`w-full border rounded-xl p-3 focus:outline-none focus:ring-2 ${
                errors.price ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-red-200"
              }`}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.price}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1.5 font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter description"
              className={`w-full border rounded-xl p-3 focus:outline-none focus:ring-2 ${
                errors.description ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-red-200"
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.description}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-1.5 font-medium text-gray-700">Add-On Image</label>
            <label className="border-2 border-dashed rounded-xl h-40 flex items-center justify-center cursor-pointer hover:border-red-400 transition-colors overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="h-full w-full object-cover rounded-xl"
                  onError={(e) => { e.target.src = DEFAULT_IMG; e.target.onerror = null; }}
                />
              ) : (
                <span className="text-gray-400 text-sm">Click to upload image</span>
              )}
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>

          {/* Allergies */}
          <div className="md:col-span-2">
            <label className="block mb-1.5 font-medium text-gray-700">Allergies</label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="Milk, Dairy, Nuts (comma separated)"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/add-on")}
            className="px-6 py-3 border rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
          >
            {loading && <ButtonSpinner />}
            {loading ? "Creating..." : "Save Add-On"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAddOns;
