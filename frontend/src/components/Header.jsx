import { Bell, Menu, ChevronDown, User } from "lucide-react";

const Header = ({ title = "Dashboard" }) => {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button className="text-gray-700 hover:text-red-600 transition">
          <Menu size={24} />
        </button>

        <h1 className="text-xl md:text-3xl font-semibold text-gray-900">
          {title}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Notification */}
        <div className="relative cursor-pointer">
          <Bell
            size={22}
            className="text-gray-600 hover:text-red-600 transition"
          />

          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
            3
          </span>
        </div>

        {/* User */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <User size={20} className="text-gray-600" />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">Admin</p>

            <p className="text-xs text-gray-500">Super Admin</p>
          </div>

          <ChevronDown size={16} className="text-gray-500 hidden sm:block" />
        </div>
      </div>
    </header>
  );
};

export default Header;
