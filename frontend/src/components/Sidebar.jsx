import { NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

export default function Sidebar({
  title = "TIFFIN SERVICE",
  subtitle = "ADMIN PANEL",
  menuItems = [],
  onLogout,
}) {
  return (
    <aside className="w-[270px] h-screen sticky top-0 bg-white border-r border-gray-200 flex flex-col shadow-sm">

      {/* Logo */}
      <div className="bg-[#E23747] text-white px-6 py-7">
        <h2 className="text-2xl font-bold tracking-wide">
          {title}
        </h2>

        <p className="text-xs mt-1 uppercase tracking-widest text-red-100">
          {subtitle}
        </p>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-5">

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) =>
                  `group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium relative
                  
                  ${
                    isActive
                      ? "bg-[#E23747] text-white shadow-md"
                      : "text-gray-700 hover:bg-red-50 hover:text-[#E23747]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full" />
                    )}

                    <Icon
                      size={21}
                      className="flex-shrink-0"
                    />

                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-[#E23747] hover:bg-[#cc2030] text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-sm"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}