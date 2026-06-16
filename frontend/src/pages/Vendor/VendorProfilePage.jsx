import {
  FaStore,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCamera,
  FaEdit,
  FaLock,
} from "react-icons/fa";

export default function VendorProfilePage() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold">
          Profile
        </h1>

        <p className="text-gray-500 mt-1">
          Manage your vendor profile and
          business information
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Card */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-red-50 flex items-center justify-center">
                <FaStore
                  size={45}
                  className="text-[#E23747]"
                />
              </div>

              <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#E23747] text-white flex items-center justify-center">
                <FaCamera />
              </button>
            </div>

            <h2 className="text-2xl font-bold mt-5">
              Vendor Name
            </h2>

            <span className="mt-2 px-3 py-1 rounded-full bg-red-50 text-[#E23747] text-sm">
              Verified Vendor
            </span>
          </div>

          <div className="border-t mt-6 pt-6 space-y-5">
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
                <FaEnvelope className="text-[#E23747]" />
              </div>

              <div>
                <p className="font-medium">
                  vendor@email.com
                </p>
                <p className="text-sm text-gray-500">
                  Email Address
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
                <FaPhone className="text-[#E23747]" />
              </div>

              <div>
                <p className="font-medium">
                  +91 9876543210
                </p>
                <p className="text-sm text-gray-500">
                  Phone Number
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
                <FaMapMarkerAlt className="text-[#E23747]" />
              </div>

              <div>
                <p className="font-medium">
                  New Delhi, India
                </p>
                <p className="text-sm text-gray-500">
                  Location
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
                <FaCalendarAlt className="text-[#E23747]" />
              </div>

              <div>
                <p className="font-medium">
                  Joined Jan 2025
                </p>
                <p className="text-sm text-gray-500">
                  Member Since
                </p>
              </div>
            </div>
          </div>

          <button className="w-full mt-8 border border-[#E23747] text-[#E23747] rounded-xl py-3 font-medium flex justify-center items-center gap-2">
            <FaLock />
            Change Password
          </button>
        </div>

        {/* Right Form */}
        <div className="xl:col-span-2 bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">
              Business Information
            </h2>

            <button className="px-4 py-2 border border-[#E23747] text-[#E23747] rounded-xl flex items-center gap-2">
              <FaEdit />
              Edit Profile
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium">
                Business Name
              </label>

              <input
                type="text"
                defaultValue="Vendor Name"
                className="w-full mt-2 border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Business Email
              </label>

              <input
                type="email"
                defaultValue="vendor@email.com"
                className="w-full mt-2 border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Phone Number
              </label>

              <input
                type="text"
                defaultValue="+91 9876543210"
                className="w-full mt-2 border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Category
              </label>

              <select className="w-full mt-2 border rounded-xl px-4 py-3">
                <option>Food & Beverages</option>
                <option>Restaurant</option>
                <option>Bakery</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium">
              Address
            </label>

            <input
              type="text"
              defaultValue="123 Market Street, New Delhi"
              className="w-full mt-2 border rounded-xl px-4 py-3"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-5 mt-5">
            <div>
              <label className="text-sm font-medium">
                City
              </label>

              <input
                type="text"
                defaultValue="Delhi"
                className="w-full mt-2 border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                State
              </label>

              <input
                type="text"
                defaultValue="Delhi"
                className="w-full mt-2 border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Pincode
              </label>

              <input
                type="text"
                defaultValue="110001"
                className="w-full mt-2 border rounded-xl px-4 py-3"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium">
              About Business
            </label>

            <textarea
              rows={4}
              className="w-full mt-2 border rounded-xl p-4"
              defaultValue="We provide fresh and healthy meals with premium quality ingredients."
            />
          </div>

          <button className="mt-6 bg-[#E23747] text-white px-6 py-3 rounded-xl font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}