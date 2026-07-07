import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../../services/category.service";
import { createItem } from "../../services/items.service";

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();

      setCategories(res.data);
    } catch (error) {
      console.log("Fetch categories error", error);
    }
  };

  const handleChange = (e) => {
    setItemData({
      ...itemData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setItemData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("name", itemData.name);
      formData.append("description", itemData.description);
      formData.append("category", itemData.category);

      formData.append(
        "allergies",
        JSON.stringify(
          itemData.allergies
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        ),
      );

      if (itemData.image) {
        formData.append("image", itemData.image);
      }

      const res = await createItem(formData);

      setSuccess(res.message || "Item created successfully");

      navigate("/admin/items");
    } catch (error) {
      console.log("Create item error", error);

      setError(
        error?.response?.data?.message || "Failed to create item",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {success && (
        <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 text-sm font-medium text-emerald-800 shadow-sm animate-fade-in">
          <svg
            className="h-4 w-4 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-rose-100 bg-rose-50/50 p-3 text-sm font-medium text-rose-800 shadow-sm animate-fade-in">
          <svg
            className="h-4 w-4 text-rose-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Add Item</h1>

          <p className="text-gray-500">Create a new item</p>
        </div>

        <button
          onClick={() => navigate("/admin/items")}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-medium"
        >
          Back to Items
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side */}
            <div className="space-y-5">
              <div>
                <label className="block mb-2 font-medium">Item Name</label>

                <input
                  type="text"
                  name="name"
                  value={itemData.name}
                  onChange={handleChange}
                  placeholder="Enter Item Name"
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Description</label>

                <textarea
                  rows="5"
                  name="description"
                  value={itemData.description}
                  onChange={handleChange}
                  placeholder="Enter Description"
                  className="w-full border rounded-lg p-3 resize-none"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Allergies</label>

                <input
                  type="text"
                  name="allergies"
                  value={itemData.allergies}
                  onChange={handleChange}
                  placeholder="Milk, Nuts, Gluten"
                  className="w-full border rounded-lg p-3"
                />

                <p className="text-sm text-gray-500 mt-1">
                  Separate allergies with commas.
                </p>
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-5">
              <div>
                <label className="block mb-2 font-medium">Category</label>

                <select
                  name="category"
                  value={itemData.category}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

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
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/admin/items")}
              className="border px-6 py-3 rounded-xl"
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
