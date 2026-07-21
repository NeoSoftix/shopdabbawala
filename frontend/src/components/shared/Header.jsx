import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, ChevronDown, User, X, Camera, UserPen } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import ChangePasswordModal from "./ChangePasswordModal";

const Header = ({
  title = "Dashboard",
  userName = "Admin",
  userRole = "Super Admin",
  onMenuClick,
  notificationCount = 0,
  onNotificationClick,
  profilePath,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); 

  const [profileData, setProfileData] = useState({
    name: userName,
    email: "admin@example.com",
    phone: "+1 234 567 890",
    photo: null 
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        photo: URL.createObjectURL(file)
      });
    }
  };

  const handleOptionClick = (type) => {
    setIsDropdownOpen(false);
    if (type === "logout") {
      toast.success("Logging out...");
      logout();
    } else if (type === "profile" && profilePath) {
      navigate(profilePath);
    } else {
      setModalType(type);
      setIsModalOpen(true);
    }
  };

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 relative z-30">
      
      {/* Left Section (Hamburger + Page Title) */}
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={onMenuClick} // Triggering state from AdminLayout
          className="text-gray-700 hover:text-red-600 transition lg:hidden p-1.5 rounded-lg hover:bg-gray-100 flex items-center justify-center"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 truncate max-w-[180px] sm:max-w-none">
          {title}
        </h1>
      </div>

      {/* Right Section (Notifications + User Profile) */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Notification Bell */}
        <button
          onClick={onNotificationClick}
          className="relative cursor-pointer p-1 rounded-full hover:bg-gray-50"
          aria-label="Notifications"
        >
          <Bell size={22} className="text-gray-600 hover:text-red-600 transition" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        {/* User Profile Dropdown container */}
        <div className="relative">
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer select-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
              {profileData.photo ? (
                <img src={profileData.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={18} className="text-gray-600" />
              )}
            </div>

            <div className="hidden sm:block max-w-[120px]">
              <p className="text-sm font-semibold text-gray-800 truncate">{profileData.name}</p>
              <p className="text-xs text-gray-500 truncate">{userRole}</p>
            </div>

            <ChevronDown size={16} className={`text-gray-500 hidden sm:block transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Popup */}
          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-50">
                <button 
                  onClick={() => handleOptionClick("profile")}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={() => handleOptionClick("password")}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  Reset Password
                </button>
                <hr className="border-gray-100 my-1" />
                <button 
                  onClick={() => handleOptionClick("logout")}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && modalType === "profile" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto transform transition-all">

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Profile</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>

                <div className="flex flex-col items-center mb-4">
                  <div className="relative w-20 h-20 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden group shadow-inner">
                    {profileData.photo ? (
                      <img src={profileData.photo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User size={36} className="text-gray-400" />
                    )}
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={18} className="text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    </label>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 font-medium">Change Avatar</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <button type="submit" className="w-full bg-red-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-red-700 transition mt-2 shadow-md shadow-red-100">
                  Save Profile
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      <ChangePasswordModal
        isOpen={isModalOpen && modalType === "password"}
        onClose={() => setIsModalOpen(false)}
      />
    </header>
  );
};

export default Header;