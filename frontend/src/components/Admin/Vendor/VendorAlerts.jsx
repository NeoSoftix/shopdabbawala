import { CheckCircle2, AlertCircle } from "lucide-react";

const VendorAlerts = ({ success, error }) => {
  return (
    <>
      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-4 border border-green-200 text-sm font-medium text-green-800">
          <CheckCircle2 size={16} className="shrink-0" /> {success}
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 border border-red-200 text-sm font-medium text-red-800">
          <AlertCircle size={16} className="shrink-0" /> Error: {error}
        </div>
      )}
    </>
  );
};

export default VendorAlerts;
