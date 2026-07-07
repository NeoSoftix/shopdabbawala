import React, { useState, useEffect } from "react";
import {
  getAllMeals,
  updateMeal,
  deleteMeal,
} from "../../services/meal.service";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { SectionLoader, ButtonSpinner } from "../shared/Loader";

const Meal = () => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

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
      toast.error(error?.response?.data?.message || "Failed to fetch meals.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-sm text-gray-800">Delete this meal?</p>
          <p className="text-xs text-gray-500">This action cannot be undone.</p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deleteMeal(id);
                  setMeals((prev) => prev.filter((meal) => meal._id !== id));
                  toast.success("Meal deleted successfully.");
                } catch (error) {
                  toast.error("Failed to delete meal.");
                }
              }}
              className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 8000 }
    );
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const formData = new FormData();

      formData.append("name", selectedMeal.name);

      if (selectedMeal.file) {
        formData.append("image", selectedMeal.file);
      }

      await updateMeal(selectedMeal._id, formData);

      fetchMeals();

      setIsEdit(false);
      setSelectedMeal(null);
      toast.success("Meal updated successfully.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update meal.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Meals</h1>
          <p className="text-gray-500 mt-1">Manage your meals items.</p>
        </div>

        <button
          onClick={() => navigate("/admin/meals/add")}
          className="inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-2.5 text-white transition hover:bg-red-600"
        >
          Create Meal
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-sm text-slate-600">
          <thead>
            <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-4">Image</th>
              <th className="px-4 py-4">Meal Name</th>
              <th className="px-4 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {meals.map((meal, index) => (
              <tr
                key={meal._id}
                className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
              >
                <td className="px-4 py-4 align-middle">
                  <img
                    src={meal.image?.url || "https://placehold.co/56x56?text=No+Img"}
                    alt={meal.name}
                    className="h-14 w-14 rounded-xl object-cover"
                    onError={(e) => { e.target.src = "https://placehold.co/56x56?text=No+Img"; e.target.onerror = null; }}
                  />
                </td>

                <td className="px-4 py-4 align-middle font-medium text-slate-900">
                  {meal.name}
                </td>

                <td className="px-4 py-4 align-middle">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedMeal(meal);
                        setIsEdit(true);
                      }}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                      aria-label="Edit meal"
                    >
                      <MdEdit size={20} />
                    </button>

                    <button
                      onClick={() => handleDelete(meal._id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                      aria-label="Delete meal"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td colSpan="3">
                  <SectionLoader text="Loading meals..." />
                </td>
              </tr>
            )}

            {!loading && meals.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No meals found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isEdit && selectedMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[600px] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Update Meal</h2>

            <div className="mb-3">
              <label className="block mb-2">Meal Name</label>
              <input
                type="text"
                value={selectedMeal.name}
                onChange={(e) =>
                  setSelectedMeal({
                    ...selectedMeal,
                    name: e.target.value,
                  })
                }
                className="w-full border p-3 rounded mb-3"
              />
            </div>

            <div className="mb-3">
              <label className="block mb-2">Image</label>

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
                className="w-full border p-3 rounded mb-3"
              />

              <div className="mb-3">
                <img
                  src={
                    (selectedMeal.file
                      ? selectedMeal.image
                      : selectedMeal.image?.url) || "https://placehold.co/96x96?text=No+Img"
                  }
                  alt="preview"
                  className="w-24 h-24 object-cover rounded"
                  onError={(e) => { e.target.src = "https://placehold.co/96x96?text=No+Img"; e.target.onerror = null; }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEdit(false);
                  setSelectedMeal(null);
                }}
                disabled={updating}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={updating}
                className="bg-red-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {updating && <ButtonSpinner />}
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meal;
