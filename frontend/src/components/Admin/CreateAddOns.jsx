import React, { useState } from "react";
import { createAddOn } from "../../services/addOn.service.js";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

const DEFAULT_PREVIEW =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#FEE2E2"/><circle cx="50" cy="50" r="30" fill="#ffffff" stroke="#E31A1A" stroke-width="2"/><g fill="#E31A1A"><rect x="28" y="30" width="2.5" height="18"/><rect x="33" y="30" width="2.5" height="18"/><rect x="38" y="30" width="2.5" height="18"/><rect x="27" y="48" width="15" height="3" rx="1.5"/><rect x="33" y="48" width="3" height="22"/><ellipse cx="68" cy="38" rx="6" ry="9"/><rect x="66.5" y="46" width="3" height="24"/></g></svg>'
  );

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
  const [preview, setPreview] = useState(DEFAULT_PREVIEW);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
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

      const allergies = formData.allergies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("allergies", JSON.stringify(allergies));
      if (image) data.append("image", image);

      const response = await createAddOn(data);
      toast.success(response.message || "Add-on created successfully!");

      setFormData({ name: "", description: "", price: "", allergies: "" });
      setImage(null);
      setPreview(DEFAULT_PREVIEW);
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
          <h1 className="text-2xl font-bold text-gray-900">Add Add-On</h1>
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
        {/* Image Upload */}
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <img
            src={preview}
            alt="Add-on"
            className="h-28 w-28 rounded-2xl border-4 border-red-100 object-cover shadow-sm"
            onError={(e) => {
              e.target.src = DEFAULT_PREVIEW;
              e.target.onerror = null;
            }}
          />
          <label className="mt-3 cursor-pointer rounded-lg bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors shadow-sm">
            Upload Image
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <Input
            label={<>Add-On Name <span className="text-red-500">*</span></>}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter add-on name"
            error={errors.name}
          />

          {/* Price */}
          <Input
            label={<>Price <span className="text-red-500">*</span></>}
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            error={errors.price}
          />

          {/* Description */}
          <Textarea
            label={<>Description <span className="text-red-500">*</span></>}
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Enter description"
            error={errors.description}
          />

          {/* Allergies */}
          <Input
            wrapperClassName="md:col-span-2"
            label="Allergies"
            type="text"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="Milk, Dairy, Nuts (comma separated)"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/add-on")}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {loading ? "Creating..." : "Save Add-On"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAddOns;
