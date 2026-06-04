import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const AddItem = () => {
  const navigate = useNavigate()

  const [itemData, setItemData] = useState({
    name: "",
    description: "",
    category: "",
    allergies: "",
    image: null,
  });

  const categories = [
    {
      _id: "1",
      name: "Indian",
      mealType: "Breakfast",
    },
    {
      _id: "2",
      name: "Chinese",
      mealType: "Lunch",
    },
    {
      _id: "3",
      name: "South Indian",
      mealType: "Dinner",
    },
  ];

  const handleChange = (e) => {
    setItemData({
      ...itemData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setItemData({
      ...itemData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...itemData,
      allergies: itemData.allergies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

  };

  return (
  <div className="p-6 bg-gray-50 min-h-screen">

    {/* Header */}
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          Add Item
        </h1>

        <p className="text-gray-500">
          Create a new item
        </p>
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
        <label className="block mb-2 font-medium">
          Item Name
        </label>

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
        <label className="block mb-2 font-medium">
          Description
        </label>

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
        <label className="block mb-2 font-medium">
          Allergies
        </label>

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
        <label className="block mb-2 font-medium">
          Category
        </label>

        <select
          name="category"
          value={itemData.category}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        >
          <option value="">
            Select Category
          </option>

          {categories.map((category) => (
            <option
              key={category._id}
              value={category._id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Item Image
        </label>

        <div className="border-2 border-dashed rounded-lg p-10 min-h-[220px] flex items-center justify-center">
          <div className="text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {itemData.image && (
              <img
                src={URL.createObjectURL(
                  itemData.image
                )}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border mt-4 mx-auto"
              />
            )}
          </div>
        </div>
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
      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl"
    >
      Save Item
    </button>
  </div>
</form>
    </div>
  </div>
);
};

export default AddItem;