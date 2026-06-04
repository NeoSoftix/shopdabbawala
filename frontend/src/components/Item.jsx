import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiEditAlt } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";

const Item = () => {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [items] = useState([
    {
      _id: "1",
      name: "Paneer Curry",
      description: "Rich Paneer Curry",
      category: {
        name: "Indian",
        mealType: "Dinner",
      },
      allergies: ["Milk"],
      image: {
        url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      },
    },
    {
      _id: "2",
      name: "Poha",
      description: "Healthy Breakfast",
      category: {
        name: "Indian",
        mealType: "Breakfast",
      },
      allergies: ["Gluten"],
      image: {
        url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400",
      },
    },
    {
      _id: "3",
      name: "Noodles",
      description: "Chinese Noodles",
      category: {
        name: "Chinese",
        mealType: "Lunch",
      },
      allergies: ["Soy", "Gluten"],
      image: {
        url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
      },
    },
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Items</h1>

          <p className="text-gray-500">Manage all items</p>
        </div>

        <button
          onClick={() => navigate("/admin/items/add")}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-medium"
        >
          + Add Item
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Meal Type</th>
                <th className="p-4">Allergies</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <img
                        src={item.image.url}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    </td>

                    <td className="p-4 font-medium">{item.name}</td>

                    <td className="p-4">{item.category.name}</td>

                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                        {item.category.mealType}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {item.allergies.map((allergy, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-red-100 text-red-600 rounded-md text-xs"
                          >
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsEdit(true);
                          }}
                          className="px-3 py-1 border border-red-500 text-red-500 rounded-lg"
                        >
                          <BiEditAlt />
                        </button>

                        <button className="px-3 py-1 bg-red-500 text-white rounded-lg">
                          <MdDeleteOutline />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    No Items Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6">Edit Item</h2>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block mb-2">Item Name</label>

                <input
                  type="text"
                  defaultValue={selectedItem?.name}
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2">Category</label>

                <select
                  defaultValue={selectedItem?.category?.name}
                  className="w-full border p-3 rounded-lg"
                >
                  <option>Indian</option>
                  <option>Chinese</option>
                  <option>South Indian</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block mb-2">Description</label>

                <textarea
                  rows="4"
                  defaultValue={selectedItem?.description}
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2">Allergies</label>

                <input
                  type="text"
                  defaultValue={selectedItem?.allergies?.join(", ")}
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2">Image</label>

                <input type="file" className="w-full border p-3 rounded-lg" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEdit(false)}
                className="border px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button className="bg-red-500 text-white px-5 py-2 rounded-lg">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;
