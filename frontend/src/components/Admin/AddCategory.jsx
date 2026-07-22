import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { createCategory } from "../../services/category.service.js";
import { toast } from "react-hot-toast";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

const AddCategory = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [foodType, setFoodType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Category name is required.";
    if (!foodType) newErrors.foodType = "Please select a food type.";
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

      await createCategory({ name, foodType });
      toast.success("Category added successfully!");
      setName("");
      setFoodType("");
      setErrors({});
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add category.");
    } finally {
      setLoading(false);
    }
  };

  const clearField = (field) => {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Category</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new food category</p>
        </div>
        <button
          onClick={() => navigate("/admin/categories")}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Categories</span>
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Category Name */}
            <Input
              label={<>Category Name <span className="text-red-500">*</span></>}
              type="text"
              value={name}
              placeholder="Enter category name"
              onChange={(e) => { setName(e.target.value); clearField("name"); }}
              error={errors.name}
            />

            {/* Food Type */}
            <Select
              label={<>Food Type <span className="text-red-500">*</span></>}
              value={foodType}
              onChange={(e) => { setFoodType(e.target.value); clearField("foodType"); }}
              error={errors.foodType}
            >
              <option value="">Select Food Type</option>
              <option value="veg">Veg</option>
              <option value="non-veg">Non Veg</option>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setName(""); setFoodType(""); setErrors({});
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {loading ? "Saving..." : "Save Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
