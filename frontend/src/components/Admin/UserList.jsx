import { useEffect, useState } from "react";
import { FiEye, FiSearch, FiX } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { getAllCustomers, deleteCustomer, getOneCustomer } from "../../services/customer.service";
import { toast } from "react-hot-toast";
import { SectionLoader } from "../shared/Loader";
import Pagination from "../shared/Pagination";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchCustomers = async (searchVal = "", pageNum = 1) => {
    try {
      setLoading(true);
      const res = await getAllCustomers(searchVal, pageNum);
      if (res.success) {
        setUsers(res.customers || []);
        setTotalPages(res.totalPages || 1);
      }
    } catch (error) {
      console.error("Fetch Customers Error:", error);
      toast.error("Failed to load customers list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    fetchCustomers(search, page);
  }, [search, page]);

  const handleView = async (id) => {
    setDetailsLoading(true);
    try {
      const res = await getOneCustomer(id);
      if (res.success) {
        setSelectedUser(res.customer);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load customer details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDelete = (id, name) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-sm text-gray-800">Delete customer "{name}"?</p>
          <p className="text-xs text-gray-500">This action cannot be undone.</p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const res = await deleteCustomer(id);
                  if (res.success) {
                    toast.success(res.message || "Customer deleted successfully.");
                    fetchCustomers(search, page);
                  }
                } catch (error) {
                  toast.error(error.response?.data?.message || "Failed to delete customer.");
                }
              }}
              className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 8000 }
    );
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
            <SectionLoader text="Loading customers..." />
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
                            onClick={() => handleView(user._id)}
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

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>

      {(selectedUser || detailsLoading) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded transition-colors"
              title="Close"
            >
              <FiX className="text-gray-500 text-lg" />
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Details</h3>

            {detailsLoading ? (
              <SectionLoader text="Loading details..." />
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400">Name</span>
                  <span className="text-gray-800 font-medium">
                    {selectedUser.name || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400">Email</span>
                  <span className="text-gray-800 font-medium">
                    {selectedUser.email || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400">Phone</span>
                  <span className="text-gray-800 font-medium">
                    {selectedUser.phone || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400">Address</span>
                  <span className="text-gray-800 font-medium text-right">
                    {selectedUser.address || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400">Pincode</span>
                  <span className="text-gray-800 font-medium">
                    {selectedUser.pincode || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Joined On</span>
                  <span className="text-gray-800 font-medium">
                    {selectedUser.createdAt
                      ? new Date(selectedUser.createdAt).toLocaleDateString()
                      : "Not set"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
