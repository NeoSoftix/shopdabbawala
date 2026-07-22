import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaTags } from "react-icons/fa";
import { getVendorProfile } from "../../services/vendor.service.js";
import { SectionLoader } from "../../components/shared/Loader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import toast from "react-hot-toast";
import { toTitleCase } from "../../utils/format.js";

// Read-only view of the pincode(s) and category the admin has assigned to
// this vendor. Vendors can request changes from the admin, but never edit
// this themselves - see AssignVendor.jsx (admin-side) for how it's set.
export default function VendorServiceZone() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVendorProfile()
      .then((res) => setVendor(res.data))
      .catch(() => toast.error("Failed to load service zone"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SectionLoader />;

  const servicePincodes = vendor?.servicePincodes || [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Your Service Zone</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          The category and pincodes admin has assigned you for delivery. Contact admin to request changes.
        </p>
      </div>

      <Card>
        <div className="flex gap-3 items-center">
          <div className="w-9 h-9 shrink-0 rounded-full bg-red-50 flex items-center justify-center">
            <FaTags size={14} className="text-[#E23747]" />
          </div>
          <div>
            <p className="text-sm font-medium">{toTitleCase(vendor?.category?.name) || "Not assigned"}</p>
            <p className="text-xs text-gray-500">Assigned Category</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 shrink-0 rounded-full bg-red-50 flex items-center justify-center">
            <FaMapMarkerAlt size={14} className="text-[#E23747]" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-2.5">Assigned Pincodes / Area</p>
            {servicePincodes.length === 0 ? (
              <p className="text-sm text-gray-400">No pincodes assigned yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {servicePincodes.map((pin) => (
                  <Badge key={pin} color="gray">
                    {pin}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
