import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold mb-5">
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

            <tr>
              <td className="py-4 font-medium text-gray-600">
                Phone
              </td>
              <td className="py-4">
                {user?.phone || "-"}
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
    </div>
  );
};

export default Settings;
