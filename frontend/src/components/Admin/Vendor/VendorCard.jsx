import { Mail, Phone, MapPin, Pencil, Trash2, Building2, Map, Package } from "lucide-react";

const VendorCard = ({ vendor, onEdit, onDelete }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 h-full">
      <div className="flex items-start justify-between gap-2">
        {/* Profile Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={vendor.logo?.url || "https://placehold.co/80x80?text=Vendor"}
            alt={vendor.organizationName}
            className="h-12 w-12 rounded-xl border-2 border-red-50 object-cover shadow-sm shrink-0"
            onError={(e) => {
              e.target.src = "https://placehold.co/80x80?text=Vendor";
              e.target.onerror = null;
            }}
          />
          <div className="min-w-0">
            <h2 className="text-sm font-black text-gray-900 tracking-tight truncate">
              {vendor.organizationName}
            </h2>
            <p className="text-xs font-medium text-gray-500 mt-0.5 truncate">
              Owner:{" "}
              <span className="text-gray-800 font-semibold">
                {vendor.userId?.name || "N/A"}
              </span>
            </p>
            <span
              className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${vendor.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${vendor.isActive ? "bg-green-600" : "bg-red-600"}`}
              ></span>
              {vendor.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={() => onEdit(vendor)}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(vendor._id)}
            className="p-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition shadow-sm"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Contacts */}
      <div className="space-y-1.5 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2.5 text-xs text-gray-600 min-w-0">
          <span className="p-1.5 rounded-lg bg-red-50 text-[#e61e2d] shrink-0">
            <Mail size={12} />
          </span>
          <span className="font-medium truncate">
            {vendor.userId?.email || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-gray-600">
          <span className="p-1.5 rounded-lg bg-red-50 text-[#e61e2d] shrink-0">
            <Phone size={12} />
          </span>
          <span className="font-semibold">
            {vendor.userId?.phone || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-gray-600 min-w-0">
          <span className="p-1.5 rounded-lg bg-red-50 text-[#e61e2d] shrink-0">
            <MapPin size={12} />
          </span>
          <span className="font-medium truncate">{vendor.address}</span>
        </div>
      </div>

      {/* Bottom Meta Badges */}
      <div className="grid grid-cols-3 gap-1.5 border-t pt-3 border-gray-50 mt-auto">
        <div className="flex flex-col items-center text-center gap-1 bg-red-50/30 rounded-xl p-1.5 border border-red-50/50">
          <span className="p-1.5 rounded-lg bg-white shadow-sm text-gray-600">
            <Building2 size={13} />
          </span>
          <p className="text-[8px] font-bold uppercase text-gray-400 tracking-wider">
            City
          </p>
          <p className="text-[10px] font-extrabold text-gray-800 truncate w-full">
            {vendor.city}
          </p>
        </div>

        <div className="flex flex-col items-center text-center gap-1 bg-purple-50/30 rounded-xl p-1.5 border border-purple-50/50">
          <span className="p-1.5 rounded-lg bg-white shadow-sm text-gray-600">
            <Map size={13} />
          </span>
          <p className="text-[8px] font-bold uppercase text-gray-400 tracking-wider">
            State
          </p>
          <p className="text-[10px] font-extrabold text-gray-800 truncate w-full">
            {vendor.state}
          </p>
        </div>

        <div className="flex flex-col items-center text-center gap-1 bg-green-50/30 rounded-xl p-1.5 border border-green-50/50">
          <span className="p-1.5 rounded-lg bg-white shadow-sm text-gray-600">
            <MapPin size={13} />
          </span>
          <p className="text-[8px] font-bold uppercase text-gray-400 tracking-wider">
            Pincode
          </p>
          <p className="text-[10px] font-extrabold text-gray-800 truncate w-full">
            {vendor.pincode}
          </p>
        </div>
      </div>

      {/* Category + Delivery Pincodes */}
      <div className="border-t border-gray-50 pt-3 space-y-1.5">
        <div className="flex items-center gap-2 text-xs">
          <span className="p-1.5 rounded-lg bg-red-50 text-[#e61e2d] shrink-0">
            <Package size={12} />
          </span>
          <span className="font-semibold text-gray-800 truncate">
            {vendor.category?.name || "No category assigned"}
          </span>
        </div>
        {vendor.servicePincodes?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pl-1">
            {vendor.servicePincodes.map((p) => (
              <span
                key={p}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-bold text-gray-600"
              >
                {p}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorCard;
