import { Search, Plus } from "lucide-react";

const VendorHeader = ({ count, searchTerm, onSearchChange, onAddClick }) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Vendor Management
        </h1>
        <p className="text-sm font-medium text-gray-400 mt-1">
          Manage all vendors{" "}
          <span className="text-red-500 font-semibold">({count})</span>
        </p>
      </div>

      {/* Search and Add Controls */}
      <div className="flex flex-1 max-w-xl gap-3 sm:justify-end w-full">
        <div className="relative w-full max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none shadow-sm transition-all focus:border-red-500"
          />
        </div>
        <button
          onClick={onAddClick}
          className="rounded-xl bg-[#e61e2d] px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-red-700 transition-all flex items-center gap-1 shrink-0"
        >
          <Plus size={16} /> Add Vendor
        </button>
      </div>
    </div>
  );
};

export default VendorHeader;
