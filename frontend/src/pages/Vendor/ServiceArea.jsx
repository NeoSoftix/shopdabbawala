import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { getActiveCategory } from "../../service/category.service";


const ServiceArea = () => {
  const [serviceArea, setServiceArea] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([])
  const [formData, setForm] = useState({
    category:"",
    area:""
  })

  const fetchCategories = async () => {
    try {
      setSuccess("")
      setError("")
      const res = await getActiveCategory()

      setCategories(res.data || res.data.data || [])
    } catch (error) {
      console.log("Get Category error", error)
      setError("Failed to fetch Category")
    }
  }

  const handleChange = (e) => {

    const {name, value} = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   try {
  //     setError("")
  //     setSuccess("")

  //     const res = 
  //   } catch (error) {
      
  //   }
  // }


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Add Service Zone Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Add New Service Zone
        </h2>

        <p className="text-gray-500 mt-2 mb-6">
          Select category and area to add a service zone.
        </p>

        <form action="">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>

              <select className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500" name="category" value={formData.category} onChange={handleChange}>
                <option>Select Category</option>
                <option>Veg Meals</option>
                <option>Non Veg Meals</option>
                <option>Diet Meals</option>
              </select>
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                placeholder="Enter Area (e.g. Sector 22 Chandigarh)"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </form>

        <button className="mt-6 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-xl transition">
          Add Service Zone
        </button>
      </div>

      {/* Service Areas Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            Your Service Areas
          </h2>

          <p className="text-gray-500 mt-1">
            Manage all the service areas assigned to your categories.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                  #
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                  Category
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                  Area
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat, index) => (
                <tr
                  key={cat.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-4">{index + 1}</td>

                  <td className="p-4 font-medium text-gray-800">{cat.name}</td>

                  <td className="p-4 text-gray-600">{cat.area}</td>
                  <td className="p-4">
                    <button className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition">
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No service zones found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceArea;
