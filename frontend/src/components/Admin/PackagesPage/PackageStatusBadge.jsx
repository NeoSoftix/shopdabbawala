/**
 * Active/Inactive pill for a package row.
 *
 * Note: intentionally not using the shared `StatusBadge` component here —
 * its color scheme (emerald-100/rose-100, no ring) doesn't match this
 * page's existing styling (emerald-50/gray-100 with a ring), and this is a
 * pure refactor that must preserve the exact current look.
 */
const PackageStatusBadge = ({ isActive }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
      isActive
        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10"
        : "bg-gray-100 text-gray-600 ring-1 ring-gray-500/10"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

export default PackageStatusBadge;
