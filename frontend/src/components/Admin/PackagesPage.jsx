import { FaPlus } from "react-icons/fa";
import usePackages from "./PackagesPage/usePackages.js";
import PackageStatsCards from "./PackagesPage/PackageStatsCards.jsx";
import PackagesTable from "./PackagesPage/PackagesTable.jsx";
import PackageFormPanel from "./PackagesPage/PackageFormPanel.jsx";

const PackagesPage = () => {
  const {
    showForm,
    packages,
    loadingPackages,
    savingPackage,
    deletingId,
    togglingId,
    editId,
    formData,
    toggleForm,
    closeForm,
    handleChange,
    handleSavePackage,
    handleDelete,
    handleToggleStatus,
    handleEditClick,
  } = usePackages();

  const editingPackage = editId ? packages.find((p) => p._id === editId) : null;

  return (
    <div className="min-h-screen bg-gray-50/50 p-3 sm:p-4 lg:p-5 font-sans antialiased text-gray-900">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-5">
        <div>
          <h1 className="text-xl sm:text-xl font-bold tracking-tight text-gray-900">
            Packages
          </h1>
          {/* <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            Dashboard / Packages
          </p> */}
        </div>
        <button
          onClick={toggleForm}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm shadow-sm transition-all duration-200 active:scale-95 ${
            showForm
              ? "bg-gray-800 text-white hover:bg-gray-900 shadow-gray-800/10"
              : "bg-red-600 text-white hover:bg-red-700 shadow-red-600/10"
          }`}
        >
          <FaPlus
            className={`w-2 h-2 transition-transform duration-200 ${showForm ? "rotate-45" : ""}`}
          />
          {showForm ? "Close Form" : "Add Package"}
        </button>
      </div>

      {/* STATS GRID */}
      <PackageStatsCards packages={packages} />

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 items-start">
        {/* TABLE SECTION */}
        <PackagesTable
          packages={packages}
          loadingPackages={loadingPackages}
          deletingId={deletingId}
          showForm={showForm}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />

        {/* RIGHT FORM SECTION */}
        {showForm && (
          <PackageFormPanel
            formData={formData}
            editId={editId}
            isActive={editingPackage?.isActive}
            savingPackage={savingPackage}
            togglingId={togglingId}
            onChange={handleChange}
            onSubmit={handleSavePackage}
            onCancel={closeForm}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>
    </div>
  );
};

export default PackagesPage;
