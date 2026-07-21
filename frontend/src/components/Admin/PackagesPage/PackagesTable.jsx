import { FaEdit, FaTrash } from "react-icons/fa";
import { SectionLoader } from "../../shared/Loader";
import PackageStatusBadge from "./PackageStatusBadge.jsx";
import Pagination from "../../shared/Pagination";

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
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <div
      className={`${showForm ? "lg:col-span-2" : "lg:col-span-3"} bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300`}
    >
      <div className="p-1 sm:p-2 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">
          All Packages
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <th className="py-2.5 px-3 w-12"></th>
              <th className="py-2.5 px-3">Package</th>
              <th className="py-2.5 px-3">Price</th>
              <th className="py-2.5 px-3">Meals</th>
              <th className="py-2.5 px-3">Validity</th>
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loadingPackages ? (
              <tr>
                <td colSpan="8" className="py-10">
                  <SectionLoader text="Loading packages..." />
                </td>
              </tr>
            ) : packages.map((p, i) => (
              <tr
                key={p._id || i}
                className="hover:bg-gray-50/40 transition-colors duration-150"
              >
                <td className="py-2.5 px-3 text-sm text-gray-400 font-medium">
                  {i + 1}
                </td>
                <td className="py-2.5 px-2 text-xs font-semibold text-gray-800 capitalize">
                  {p.name}
                </td>
                <td className="py-2.5 px-3 text-sm font-bold text-gray-900">
                  {p.discountedPrice != null && p.discountedPrice < p.price ? (
                    <span className="flex items-center gap-1.5">
                      <span className="text-gray-400 line-through font-medium">
                        ${p.price}
                      </span>
                      <span className="text-red-600">${p.discountedPrice}</span>
                    </span>
                  ) : (
                    <>${p.price}</>
                  )}
                </td>
                <td className="py-2.5 px-3 text-sm text-gray-600 font-medium">
                  {p.totalMeals} Tiffins
                </td>
                <td className="py-2.5 px-3 text-sm text-gray-500">
                  {p.validityDays} Days
                </td>
                <td
                  className="py-2.5 px-3 text-sm text-gray-400 max-w-[180px] truncate"
                  title={p.description}
                >
                  {p.description || "—"}
                </td>
                <td className="py-2.5 px-3">
                  <PackageStatusBadge isActive={p.isActive} />
                </td>
                <td className="py-2.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(p)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                    >
                      <FaEdit size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(p._id || i)}
                      disabled={deletingId === (p._id || i)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:opacity-40"
                    >
                      {deletingId === (p._id || i) ? (
                        <svg className="animate-spin w-[15px] h-[15px] text-rose-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      ) : (
                        <FaTrash size={15} />
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

      <div className="px-3 pb-2">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default PackagesTable;
