export default function RoleSelector({
  role,
  setRole,
}) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <button
        type="button"
        onClick={() => setRole("admin")}
        className={`h-14 rounded-xl border font-medium transition-all duration-200
          ${
            role === "admin"
              ? "bg-[#E23747] text-white border-[#E23747]"
              : "bg-white text-gray-700 border-gray-300 hover:border-[#E23747]"
          }`}
      >
        Admin
      </button>

      <button
        type="button"
        onClick={() => setRole("vendor")}
        className={`h-14 rounded-xl border font-medium transition-all duration-200
          ${
            role === "vendor"
              ? "bg-[#E23747] text-white border-[#E23747]"
              : "bg-white text-gray-700 border-gray-300 hover:border-[#E23747]"
          }`}
      >
        Vendor
      </button>
    </div>
  );
}