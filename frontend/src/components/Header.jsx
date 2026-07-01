import { useState } from "react";
import { Bell, Menu, ChevronDown, User, X, Camera } from "lucide-react";

const Header = ({
  title = "Dashboard",
  userName = "Admin",
  userRole = "Super Admin",
}) => {
  // Dropdown & Modal states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "profile" aur "password" ke liye

  // Edit Profile Form States
  const [profileData, setProfileData] = useState({
    name: userName,
    email: "admin@example.com",
    phone: "+1 234 567 890",
    photo: null // Isme image ka URL save hoga preview ke liye
  });

  // Photo change handle karne ke liye
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        photo: URL.createObjectURL(file) // temporary URL for preview
      });
    }
  };

  const handleOptionClick = (type) => {
    setIsDropdownOpen(false); // Option click hote hi dropdown close
    if (type === "logout") {
      alert("Logging out...");
    } else {
      setModalType(type);
      setIsModalOpen(true); // Modal open
    }
  };

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 relative">
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button className="text-gray-700 hover:text-red-600 transition">
          <Menu size={24} />
        </button>
        <h1 className="text-xl md:text-3xl font-semibold text-gray-900">
          {title}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Notification Bell */}
        <div className="relative cursor-pointer">
          <Bell size={22} className="text-gray-600 hover:text-red-600 transition" />
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
            3
          </span>
        </div>

        {/* User Profile Container */}
        {/* Hover issue solve karne ke liye click toggle use kiya hai */}
        <div className="relative">
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
              {profileData.photo ? (
                <img src={profileData.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={20} className="text-gray-600" />
              )}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{profileData.name}</p>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>

            <ChevronDown size={16} className={`text-gray-500 hidden sm:block transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Yeh invisible overlay dropdown se bahar click karne par use close kar degi */}
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                <button 
                  onClick={() => handleOptionClick("profile")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={() => handleOptionClick("password")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  Reset Your Password
                </button>
                <hr className="border-gray-100 my-1" />
                <button 
                  onClick={() => handleOptionClick("logout")}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* POPUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative m-4 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>

            {/* MODAL CONTENT */}
            {modalType === "profile" ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h3>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                  
                  {/* Photo Upload Section */}
                  <div className="flex flex-col items-center mb-4">
                    <div className="relative w-20 h-20 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden group">
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
                    <span className="text-xs text-gray-500 mt-1">Change Avatar</span>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.name} 
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" 
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email} 
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" 
                    />
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={profileData.phone} 
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" 
                    />
                  </div>

                  <button type="submit" className="w-full bg-red-600 text-white rounded py-2 text-sm font-medium hover:bg-red-700 transition mt-2">
                    Save Profile
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reset Password</h3>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Current Password</label>
                    <input type="password" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
                  </div>
                  <button type="submit" className="w-full bg-red-600 text-white rounded py-2 text-sm font-medium hover:bg-red-700 transition mt-2">
                    Update Password
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;