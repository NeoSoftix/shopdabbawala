import { useState } from "react";
import { FiEye } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

const Users = () => {
  const [users] = useState([
    {
      _id: "1",
      name: "Rahul Sharma",
      phone: "9876543210",
    },
    {
      _id: "2",
      name: "Priya Verma",
      phone: "9876543211",
    },
    {
      _id: "3",
      name: "Amit Singh",
      phone: "9876543212",
    },
    {
      _id: "4",
      name: "Neha Gupta",
      phone: "9876543213",
    },
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-2xl font-semibold mb-5">Users</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-gray-500 text-sm">
                <th className="text-left py-3">Name</th>
                <th className="text-left py-3">Phone</th>
                <th className="text-center py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="py-4">{user.name}</td>

                  <td className="py-4">{user.phone}</td>

                  <td className="py-4">
                    <div className="flex justify-center gap-4">
                      <button>
                        <FiEye className="text-gray-500 text-lg" />
                      </button>

                      <button>
                        <MdDeleteOutline className="text-red-500 text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="text-center py-6 text-gray-500">No Users Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
