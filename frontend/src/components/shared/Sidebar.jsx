import { NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { X } from "lucide-react";
import logoImg from "/logo.png";

export default function Sidebar({
  title = "TIFFIN SERVICE",
  subtitle = "ADMIN PANEL",
  menuItems = [],
  onLogout,
  isOpen,
  onClose,
  badges = {},
}) {
  return (
    <>
      {/* Backdrop overlay for small screens */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 w-55 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm transition-transform duration-300 ease-in-out shrink-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo Section */}
        <div className="bg-white border-b border-gray-100 p-4 lg:p-6 flex items-center justify-center relative shrink-0">
          <img src={logoImg} alt={title} className="h-16 lg:h-28 w-auto object-contain" />

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 lg:hidden p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Section */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const badgeCount = badges[item.path] || 0;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  onClick={onClose} // Link click hote hi responsive drawer auto-close ho jaye
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-medium relative text-sm
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
                        size={18}
                        className="flex-shrink-0"
                      />

                      <span className="truncate flex-1">{item.label}</span>

                      {badgeCount > 0 && (
                        <span
                          className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center
                          ${isActive ? "bg-white text-[#E23747]" : "bg-[#E23747] text-white"}`}
                        >
                          {badgeCount > 99 ? "99+" : badgeCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Logout Section */}
        <div className="border-t border-gray-200 p-3">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-[#E23747] hover:bg-[#cc2030] text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}