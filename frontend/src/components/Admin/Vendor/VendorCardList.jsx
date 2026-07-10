import VendorCard from "./VendorCard";

const VendorCardList = ({ vendors, error, onEdit, onDelete }) => {
  if (vendors.length === 0 && !error) {
    return (
      <div className="text-center py-16 text-gray-400 bg-white border rounded-2xl shadow-sm font-medium">
        No vendors found matching your search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {vendors.map((vendor) => (
        <VendorCard
          key={vendor._id}
          vendor={vendor}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default VendorCardList;
