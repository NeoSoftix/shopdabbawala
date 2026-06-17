import { useState, useEffect } from "react";
import {
  FaBoxOpen,
  FaClock,
  FaDollarSign,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch
} from "react-icons/fa";

const PackagesPage = () => {
  const [showForm, setShowForm] = useState(false);
  
  const [packages, setpackages] = useState([])
  const [error, setError] = useState()
  
  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

 

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 font-sans antialiased text-gray-900">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Packages</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Dashboard / Packages</p>
        </div>
        <button
          onClick={toggleForm}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm shadow-sm transition-all duration-200 active:scale-95 ${
            showForm 
              ? "bg-gray-800 text-white hover:bg-gray-900 shadow-gray-800/10" 
              : "bg-red-600 text-white hover:bg-red-700 shadow-red-600/10"
          }`}
        >
          <FaPlus className={`w-3 h-3 transition-transform duration-200 ${showForm ? "rotate-45" : ""}`} />
          {showForm ? "Close Form" : "Add Package"}
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.title}</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{s.value}</h3>
              {s.sub && <p className="text-[10px] text-purple-600 font-medium mt-0.5">{s.sub}</p>}
            </div>
            <div className={`p-2.5 sm:p-3 rounded-xl ${s.bgColor} ${s.textColor} text-lg sm:text-xl`}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        
        {/* TABLE SECTION */}
        <div className={`${showForm ? "lg:col-span-2" : "lg:col-span-3"} bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300`}>
          <div className="p-4 sm:p-5 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-bold text-gray-800 text-base sm:text-lg">All Packages</h2>
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FaSearch className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Search packages..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* TABLE WRAPPER FOR SMALL DEVICES (SCROLL ENABLED) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px] lg:min-w-0">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="py-3 px-4 w-12">#</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Meals</th>
                  <th className="py-3 px-4">Validity</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {packages.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50/40 transition-colors duration-150">
                    <td className="py-3.5 px-4 text-sm text-gray-400 font-medium">{i + 1}</td>
                    <td className="py-3.5 px-4 text-sm font-semibold text-gray-800">{p.name}</td>
                    <td className="py-3.5 px-4 text-sm font-bold text-gray-900">{p.price}</td>
                    <td className="py-3.5 px-4 text-sm text-gray-600 font-medium">{p.meals}</td>
                    <td className="py-3.5 px-4 text-sm text-gray-500">{p.validity}</td>
                    <td className="py-3.5 px-4 text-sm text-gray-400 max-w-[180px] truncate" title={p.desc}>
                      {p.desc}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
                          p.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10"
                            : "bg-gray-100 text-gray-600 ring-1 ring-gray-500/10"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150">
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150">
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 sticky top-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-50 mb-5">
              <h2 className="font-bold text-gray-800 text-base sm:text-lg">Add / Edit Package</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-xs font-semibold text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Package Name</label>
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" 
                  placeholder="Package Name" 
                />
              </div>

              {/* Form Input Grid for small screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Price ($)</label>
                  <input 
                    type="text" 
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" 
                    placeholder="Price" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Total Meals</label>
                  <input 
                    type="text" 
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" 
                    placeholder="Total Meals" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Validity (Days)</label>
                  <input 
                    type="text" 
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" 
                    placeholder="Validity (Days)" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Description</label>
                <textarea 
                  rows="3"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none" 
                  placeholder="Description"
                ></textarea>
              </div>

              <div className="pt-2">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-3 rounded-xl shadow-sm shadow-red-600/10 transition-all duration-150 active:scale-[0.99]">
                  Save Package
                </button>
                <p className="text-[11px] text-gray-400 text-center mt-2.5">
                  Packages will be visible after saving.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;