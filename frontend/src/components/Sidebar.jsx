import { NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

export default function Sidebar({
  title = "TIFFIN SERVICE",
  subtitle = "ADMIN PANEL",
  menuItems = [],
}) {
  return (
    <aside className="w-[270px] min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="bg-[#E23747] text-white px-6 py-8">
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-sm mt-1 opacity-90">{subtitle}</p>
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive
                      ? "bg-[#E23747] text-white shadow-md"
                      : "text-gray-700 hover:bg-red-50 hover:text-[#E23747]"
                  }`
                }
              >
                <Icon size={22} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t">
        <button className="w-full bg-[#E23747] hover:bg-[#d52d3d] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all">
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}