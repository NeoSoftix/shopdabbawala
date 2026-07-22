import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import ChangePasswordModal from "../shared/ChangePasswordModal";
import Button from "../ui/Button";

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
                <Button variant="outline" size="sm" onClick={() => setIsChangePasswordOpen(true)}>
                  <FaLock size={13} />
                  Change Password
                </Button>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6">
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
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
