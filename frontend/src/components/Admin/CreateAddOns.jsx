import React, { useState } from "react";
import { createAddOn } from "../../service/addOn.service.js";
import { useNavigate } from "react-router-dom";

const CreateAddOns = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    allergies: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);

      formData.allergies
        .split(",")
        .map((item) => item.trim())
        .forEach((item) => {
          if (item) {
            data.append("allergies", item);
          }
        });

      if (image) {
        data.append("image", image);
      }

      const response = await createAddOn(data);

      setSuccess(response.message);

      setFormData({
        name: "",
        description: "",
        price: "",
        allergies: "",
      });

      setImage(null);
    } catch (error) {
      let errMessage = error?.response?.data?.message;

      if (!errMessage && typeof error?.response?.data === "string" && error.response.data.includes("Only jpg, jpeg, png, webp files are allowed")) {
        errMessage = "Only jpg, jpeg, png, webp files are allowed";
      }

      setError(errMessage || "Failed to create Add On");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="max-w-6xl mx-auto p-6">
  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-4xl font-bold text-slate-900">
        Add Add On
      </h1>

      <p className="text-gray-500 mt-1">
        Create a new add-on for meals
      </p>
    </div>

    <button
      type="button"
      onClick={() => navigate("/admin/add-on")}
      className="px-5 py-3 border rounded-xl bg-white hover:bg-gray-50"
    >
      ← Back to Add Ons
    </button>
  </div>

  {/* Form Card */}
  <form
    onSubmit={handleSubmit}
    className="bg-white border rounded-2xl p-6 shadow-sm"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Name */}
      <div>
        <label className="block mb-2 font-medium">
          Add On Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter add on name"
          className="w-full border rounded-xl p-3"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block mb-2 font-medium">
          Price
        </label>

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price"
          className="w-full border rounded-xl p-3"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block mb-2 font-medium">
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          placeholder="Enter description"
          className="w-full border rounded-xl p-3"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block mb-2 font-medium">
          Add On Image
        </label>

        <label className="border-2 border-dashed rounded-xl h-40 flex items-center justify-center cursor-pointer">
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="h-full w-full object-cover rounded-xl"
            />
          ) : (
            <span className="text-gray-500">
              Click to upload image
            </span>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />
        </label>
      </div>

      {/* Allergies */}
      <div className="md:col-span-2">
        <label className="block mb-2 font-medium">
          Allergies
        </label>

        <input
          type="text"
          name="allergies"
          value={formData.allergies}
          onChange={handleChange}
          placeholder="Milk, Dairy, Nuts"
          className="w-full border rounded-xl p-3"
        />
      </div>
    </div>

    {/* Messages */}
    {error && (
      <p className="text-red-500 mt-4">{error}</p>
    )}

    {success && (
      <p className="text-green-500 mt-4">{success}</p>
    )}

    {/* Buttons */}
    <div className="flex justify-end gap-3 mt-6">
      <button
        type="button"
        onClick={() => navigate("/admin/add-on")}
        className="px-6 py-3 border rounded-xl"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={loading}
        className="bg-red-500 text-white px-8 py-3 rounded-xl"
      >
        {loading ? "Creating..." : "Save Add On"}
      </button>
    </div>
  </form>
</div>
  );
};

export default CreateAddOns;
