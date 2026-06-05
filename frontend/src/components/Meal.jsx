import React, { useState, useEffect } from "react";
import { getAllMeals, updateMeal, deleteMeal } from "../service/meal.service";
import { MdDelete } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Meal = () => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      setLoading(true);

      const res = await getAllMeals();

      setMeals(res.data || res.meals || []);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to fetch meals");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMeal(id);

      setMeals((prev) => prev.filter((meal) => meal._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("name", selectedMeal.name);

      if (selectedMeal.file) {
        formData.append("image", selectedMeal.file);
      }

      await updateMeal(selectedMeal._id, formData);

      fetchMeals();

      setIsEdit(false);
      setSelectedMeal(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Meals</h1>

          <p className="text-sm text-gray-500">Manage all meals</p>
        </div>

        <button
          onClick={() => navigate("/admin/meals/add")}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium"
        >
          + Add Meal
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-5 py-4 text-left">Image</th>

                <th className="px-5 py-4 text-left">Meal Name</th>

                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {meals.length > 0 ? (
                meals.map((meal) => (
                  <tr key={meal._id} className="border-b hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-14 h-14 rounded-lg object-cover border"
                      />
                    </td>

                    <td className="px-5 py-4 font-medium">{meal.name}</td>

                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => {
                            setSelectedMeal(meal);
                            setIsEdit(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit3 size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(meal._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-gray-500">
                    No Meals Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEdit && selectedMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Meal</h2>

            <div className="space-y-4">
              <input
                type="text"
                value={selectedMeal.name}
                onChange={(e) =>
                  setSelectedMeal({
                    ...selectedMeal,
                    name: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-3"
                placeholder="Meal Name"
              />

              <div>
                <label className="block mb-2 font-medium">Meal Image</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (file) {
                      setSelectedMeal({
                        ...selectedMeal,
                        image: URL.createObjectURL(file),
                        file,
                      });
                    }
                  }}
                  className="w-full border rounded-lg px-4 py-3"
                />

                {selectedMeal.image && (
                  <img
                    src={selectedMeal.image}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border mt-3"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsEdit(false);
                  setSelectedMeal(null);
                }}
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meal;
