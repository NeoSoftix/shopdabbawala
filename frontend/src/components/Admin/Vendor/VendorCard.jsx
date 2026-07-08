const VendorCard = ({ vendor, onEdit, onDelete }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-5">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        {/* Profile Info */}
        <div className="flex items-center gap-4 min-w-[220px]">
          <img
            src={vendor.logo?.url || "https://placehold.co/80x80?text=Vendor"}
            alt={vendor.organizationName}
            className="h-20 w-20 rounded-2xl border-2 border-red-50 object-cover shadow-sm shrink-0"
            onError={(e) => {
              e.target.src = "https://placehold.co/80x80?text=Vendor";
              e.target.onerror = null;
            }}
          />
          <div className="min-w-0">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              {vendor.organizationName}
            </h2>
            <p className="text-sm font-medium text-gray-500 mt-0.5">
              Owner:{" "}
              <span className="text-gray-800 font-semibold">
                {vendor.userId?.name || "N/A"}
              </span>
            </p>
            <span
              className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${vendor.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${vendor.isActive ? "bg-green-600" : "bg-red-600"}`}
              ></span>
              {vendor.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Middle Section Contacts */}
        <div className="flex-1 space-y-2.5 md:border-l md:pl-8 border-gray-100">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="p-2 rounded-xl bg-red-50 text-[#e61e2d] font-bold text-xs">
              ✉️
            </span>
            <span className="font-medium truncate">
              {vendor.userId?.email || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="p-2 rounded-xl bg-red-50 text-[#e61e2d] font-bold text-xs">
              📞
            </span>
            <span className="font-semibold">
              {vendor.userId?.phone || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="p-2 rounded-xl bg-red-50 text-[#e61e2d] font-bold text-xs">
              📍
            </span>
            <span className="font-medium truncate">{vendor.address}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 self-end md:self-start">
          <button
            onClick={() => onEdit(vendor)}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition shadow-sm text-sm"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(vendor._id)}
            className="p-2.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition shadow-sm text-sm"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Bottom Meta Badges */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 border-t pt-4 border-gray-50">
        <div className="flex items-center gap-3.5 bg-red-50/30 rounded-2xl p-3 border border-red-50/50">
          <span className="p-2.5 rounded-xl bg-white shadow-sm text-lg">
            🏢
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
              City
            </p>
            <p className="text-sm font-extrabold text-gray-800 mt-0.5">
              {vendor.city}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 bg-purple-50/30 rounded-2xl p-3 border border-purple-50/50">
          <span className="p-2.5 rounded-xl bg-white shadow-sm text-lg">
            🗺️
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
              State
            </p>
            <p className="text-sm font-extrabold text-gray-800 mt-0.5">
              {vendor.state}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 bg-green-50/30 rounded-2xl p-3 border border-green-50/50">
          <span className="p-2.5 rounded-xl bg-white shadow-sm text-lg">
            📍
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
              Pincode
            </p>
            <p className="text-sm font-extrabold text-gray-800 mt-0.5">
              {vendor.pincode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
