import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { getAllCategories } from "../../services/category.service";
import { createItem } from "../../services/items.service";
import { toast } from "react-hot-toast";
import { ButtonSpinner } from "../shared/Loader";

const DEFAULT_IMG = "https://placehold.co/128x128?text=No+Image";

const AddItem = () => {
  const navigate = useNavigate();
  const [itemData, setItemData] = useState({
    name: "",
    description: "",
    category: "",
    allergies: "",
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data || []);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    setItemData({ ...itemData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error("Image must be 1MB or smaller.");
        e.target.value = "";
        return;
      }
      setItemData({ ...itemData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
      if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!itemData.name.trim()) newErrors.name = "Item name is required.";
    if (!itemData.description.trim()) newErrors.description = "Description is required.";
    if (!itemData.category) newErrors.category = "Please select a category.";
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
      const formData = new FormData();
      formData.append("name", itemData.name);
      formData.append("description", itemData.description);
      formData.append("category", itemData.category);
      formData.append(
        "allergies",
        itemData.allergies.split(",").map((item) => item.trim()).filter(Boolean)
      );
      if (itemData.image) formData.append("image", itemData.image);

      if (itemData.image) {
        formData.append("image", itemData.image);
      }

      await createItem(formData);

      toast.success("Item created successfully!");
      navigate("/admin/items");
    } catch (error) {
      console.log("Create item error", error);

      toast.error(error?.response?.data?.message || "Failed to create item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Add Item</h1>
          <p className="text-gray-500 mt-1">Create a new menu item</p>
        </div>
        <button
          onClick={() => navigate("/admin/items")}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Items
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side */}
            <div className="space-y-5">
              {/* Item Name */}
              <div>
                <label className="block mb-1.5 font-medium text-gray-700">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={itemData.name}
                  onChange={handleChange}
                  placeholder="Enter Item Name"
                  className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 ${errors.name ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-red-200"
                    }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1.5 font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="5"
                  name="description"
                  value={itemData.description}
                  onChange={handleChange}
                  placeholder="Enter Description"
                  className={`w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 ${errors.description ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-red-200"
                    }`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.description}</p>}
              </div>

              {/* Allergies */}
              <div>
                <label className="block mb-1.5 font-medium text-gray-700">Allergies</label>
                <input
                  type="text"
                  name="allergies"
                  value={itemData.allergies}
                  onChange={handleChange}
                  placeholder="Milk, Nuts, Gluten"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-200"
                />
                <p className="text-sm text-gray-400 mt-1">Separate allergies with commas.</p>
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-5">
              {/* Category */}
              <div>
                <label className="block mb-1.5 font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={itemData.category}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-3 bg-white focus:outline-none focus:ring-2 ${errors.category ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-red-200"
                    }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.category}</p>}
              </div>

              {/* Item Image */}
              <div>
                <label className="block mb-2 font-medium">Item Image</label>

                <label
                  htmlFor="itemImage"
                  className="border-2 border-dashed rounded-lg p-10 min-h-[220px] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                >
                  <input
                    id="itemImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {itemData.image ? (
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(itemData.image)}
                        alt="Preview"
                        className="w-40 h-40 object-cover rounded-lg border mx-auto"
                      />

                      <p className="text-sm text-gray-500 mt-3">
                        Click anywhere to change image
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg
                        className="w-12 h-12 mx-auto text-gray-400 mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M12 3v12m0-12l-4 4m4-4l4 4"
                        />
                      </svg>

                      <p className="font-medium text-gray-700">
                        Click anywhere to upload image
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        PNG, JPG, JPEG
                      </p>
                    </div>
                  )}
                </label>
              </div >
            </div >
          </div >

          {/* Buttons */}
          < div className="flex justify-end gap-4 mt-8" >
            <button
              type="button"
              onClick={() => navigate("/admin/items")}
              className="border border-gray-300 px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-xl text-white ${loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
                }`}
            >
              {loading ? "Saving..." : "Save Item"}
            </button>
          </div >
        </form >
      </div >
    </div >
  );
};

export default AddItem;
