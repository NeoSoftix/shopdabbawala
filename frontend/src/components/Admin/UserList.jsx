import { useEffect, useState } from "react";
import { FiEye, FiSearch } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { getAllCustomers, deleteCustomer } from "../../services/customer.service";
import { toast } from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = async (searchVal = "") => {
    try {
      setLoading(true);
      const res = await getAllCustomers(searchVal);
      if (res.success) {
        setUsers(res.customers || []);
      }
    } catch (error) {
      console.error("Fetch Customers Error:", error);
      toast.error("Failed to load customers list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(search);
  }, [search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete customer "${name}"?`)) {
      return;
    }

    try {
      const res = await deleteCustomer(id);
      if (res.success) {
        toast.success(res.message || "Customer deleted successfully");
        // Reload customers list
        fetchCustomers(search);
      }
    } catch (error) {
      console.error("Delete Customer Error:", error);
      toast.error(error.response?.data?.message || "Failed to delete customer");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Customers</h2>
          
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
              <p className="mt-4 text-gray-500 text-sm">Loading customers...</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-sm font-medium">
                    <th className="text-left py-3 font-semibold">Name</th>
                    <th className="text-left py-3 font-semibold">Email</th>
                    <th className="text-left py-3 font-semibold">Phone</th>
                    <th className="text-center py-3 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 text-sm font-medium text-gray-800">
                        {user.name || <span className="text-gray-400 italic">Not set</span>}
                      </td>

                      <td className="py-4 text-sm text-gray-600">
                        {user.email || <span className="text-gray-400 italic">Not set</span>}
                      </td>

                      <td className="py-4 text-sm text-gray-600">
                        {user.phone || <span className="text-gray-400 italic">Not set</span>}
                      </td>

                      <td className="py-4">
                        <div className="flex justify-center gap-4">
                          <button 
                            title="View Customer"
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <FiEye className="text-gray-500 text-lg" />
                          </button>

                          <button
                            title="Delete Customer"
                            onClick={() => handleDelete(user._id, user.name || user.phone)}
                            className="p-1 hover:bg-red-50 rounded transition-colors"
                          >
                            <MdDeleteOutline className="text-red-500 text-xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-base">No Customers Found</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
