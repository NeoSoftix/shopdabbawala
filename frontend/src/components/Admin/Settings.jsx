import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import ChangePasswordModal from "../shared/ChangePasswordModal";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          Settings
        </h2>

        <table className="w-full">
          <tbody>
            <tr className="border-b">
              <td className="py-4 font-medium text-gray-600">
                Name
              </td>
              <td className="py-4">
                {user?.name || "-"}
              </td>
            </tr>

            <tr className="border-b">
              <td className="py-4 font-medium text-gray-600">
                Email
              </td>
              <td className="py-4">
                {user?.email || "-"}
              </td>
            </tr>

            <tr className="border-b">
              <td className="py-4 font-medium text-gray-600">
                Phone
              </td>
              <td className="py-4">
                {user?.phone || "-"}
              </td>
            </tr>

            <tr>
              <td className="py-4 font-medium text-gray-600">
                Password
              </td>
              <td className="py-4">
                <button
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  <FaLock size={13} />
                  Change Password
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};

export default Settings;
