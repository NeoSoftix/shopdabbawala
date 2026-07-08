const VendorAlerts = ({ success, error }) => {
  return (
    <>
      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 border border-green-200 text-sm font-medium text-green-800">
          ✨ {success}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 border border-red-200 text-sm font-medium text-red-800">
          ⚠️ Error: {error}
        </div>
      )}
    </>
  );
};

export default VendorAlerts;
