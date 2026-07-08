import { FaEdit, FaTrash } from "react-icons/fa";
import { SectionLoader } from "../../shared/Loader";
import PackageStatusBadge from "./PackageStatusBadge.jsx";

/**
 * "All Packages" table: lists packages with edit/delete row actions.
 */
const PackagesTable = ({
  packages,
  loadingPackages,
  deletingId,
  showForm,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={`${showForm ? "lg:col-span-2" : "lg:col-span-3"} bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300`}
    >
      <div className="p-4 sm:p-5 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-bold text-gray-800 text-base sm:text-lg">
          All Packages
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px] lg:min-w-0">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <th className="py-3 px-4 w-12">#</th>
              <th className="py-3 px-4">Package</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Meals</th>
              <th className="py-3 px-4">Validity</th>
              <th className="py-3 px-4">Max Items</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loadingPackages ? (
              <tr>
                <td colSpan="9" className="py-10">
                  <SectionLoader text="Loading packages..." />
                </td>
              </tr>
            ) : packages.map((p, i) => (
              <tr
                key={p._id || i}
                className="hover:bg-gray-50/40 transition-colors duration-150"
              >
                <td className="py-3.5 px-4 text-sm text-gray-400 font-medium">
                  {i + 1}
                </td>
                <td className="py-3.5 px-4 text-sm font-semibold text-gray-800 capitalize">
                  {p.name}
                </td>
                <td className="py-3.5 px-4 text-sm font-bold text-gray-900">
                  ${p.price}
                </td>
                <td className="py-3.5 px-4 text-sm text-gray-600 font-medium">
                  {p.totalMeals} Tiffins
                </td>
                <td className="py-3.5 px-4 text-sm text-gray-500">
                  {p.validityDays} Days
                </td>
                <td className="py-3.5 px-4 text-sm">{p.maxItemsPerMeal}</td>
                <td
                  className="py-3.5 px-4 text-sm text-gray-400 max-w-[180px] truncate"
                  title={p.description}
                >
                  {p.description || "—"}
                </td>
                <td className="py-3.5 px-4">
                  <PackageStatusBadge isActive={p.isActive} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(p)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                    >
                      <FaEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(p._id || i)}
                      disabled={deletingId === (p._id || i)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 disabled:opacity-40"
                    >
                      {deletingId === (p._id || i) ? (
                        <svg className="animate-spin w-3.5 h-3.5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      ) : (
                        <FaTrash className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {packages.length === 0 && (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-8 text-sm text-gray-400"
                >
                  No packages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackagesTable;
