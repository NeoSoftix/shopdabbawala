import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getAllCategories } from "../../services/category.service";
import { createItem } from "../../services/items.service";
import { toast } from "react-hot-toast";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import { toTitleCase } from "../../utils/format";

const DEFAULT_PREVIEW =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#FEE2E2"/><circle cx="50" cy="50" r="30" fill="#ffffff" stroke="#E31A1A" stroke-width="2"/><g fill="#E31A1A"><rect x="28" y="30" width="2.5" height="18"/><rect x="33" y="30" width="2.5" height="18"/><rect x="38" y="30" width="2.5" height="18"/><rect x="27" y="48" width="15" height="3" rx="1.5"/><rect x="33" y="48" width="3" height="22"/><ellipse cx="68" cy="38" rx="6" ry="9"/><rect x="66.5" y="46" width="3" height="24"/></g></svg>'
  );

const AddItem = () => {
  const navigate = useNavigate();
  // Pre-select the category when arriving from a "+ Add Item" shortcut
  // elsewhere (e.g. the Weekly Menu page, when a category has no items yet).
  const [searchParams] = useSearchParams();
  const preselectedCategory = searchParams.get("category") || "";
  // If we arrived from the Weekly Menu page's "+ Add Item" shortcut, send
  // the admin back there after saving instead of the generic Items list.
  const returnTo = searchParams.get("from") === "weekly-menu" ? "/admin/weekly-menu" : "/admin/items";

  const [itemData, setItemData] = useState({
    name: "",
    description: "",
    category: preselectedCategory,
    allergies: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(DEFAULT_PREVIEW);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

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

      const data = new FormData();
      data.append("name", itemData.name);
      data.append("description", itemData.description);
      data.append("category", itemData.category);
      data.append(
        "allergies",
        JSON.stringify(itemData.allergies.split(",").map((item) => item.trim()).filter(Boolean))
      );
      if (image) data.append("image", image);

      await createItem(data);

      toast.success("Item created successfully!");
      navigate(returnTo);
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
          <h1 className="text-2xl font-bold text-gray-900">Add Item</h1>
          <p className="text-gray-500 mt-1">Create a new menu item</p>
        </div>
        <button
          onClick={() => navigate(returnTo)}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Items
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="mb-6 flex flex-col items-center justify-center text-center">
            <img
              src={preview}
              alt="Item"
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
            {/* Left Side */}
            <div className="space-y-5">
              {/* Item Name */}
              <Input
                label={<>Item Name <span className="text-red-500">*</span></>}
                type="text"
                name="name"
                value={itemData.name}
                onChange={handleChange}
                placeholder="Enter Item Name"
                error={errors.name}
              />

              {/* Description */}
              <Textarea
                label={<>Description <span className="text-red-500">*</span></>}
                rows="3"
                name="description"
                value={itemData.description}
                onChange={handleChange}
                placeholder="Enter Description"
                className="resize-none"
                error={errors.description}
              />
            </div>

            {/* Right Side */}
            <div className="space-y-5">
              {/* Category */}
              <Select
                label={<>Category <span className="text-red-500">*</span></>}
                name="category"
                value={itemData.category}
                onChange={handleChange}
                error={errors.category}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {toTitleCase(category.name)}
                  </option>
                ))}
              </Select>

              {/* Allergies */}
              <div>
                <Input
                  label="Allergies"
                  type="text"
                  name="allergies"
                  value={itemData.allergies}
                  onChange={handleChange}
                  placeholder="Milk, Nuts, Gluten"
                />
                <p className="text-sm text-gray-400 mt-1">Separate allergies with commas.</p>
              </div>
            </div >
          </div >

          {/* Buttons */}
          < div className="flex justify-end gap-4 mt-8" >
            <Button type="button" variant="outline" onClick={() => navigate("/admin/items")}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {loading ? "Saving..." : "Save Item"}
            </Button>
          </div >
        </form >
      </div >
    </div >
  );
};

export default AddItem;
