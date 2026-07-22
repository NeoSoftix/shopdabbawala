import { ButtonSpinner } from "../shared/Loader";

const VARIANT_CLASSES = {
  primary: "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100",
  outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  ghost: "text-slate-600 hover:bg-slate-100",
};

const SIZE_CLASSES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "w-full py-3.5 text-sm",
};

// Generic button primitive used app-wide. Wraps the existing brand styles
// (red/orange fill, gray outline) so call sites stop hand-rolling classNames.
export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {loading && <ButtonSpinner />}
      {children}
    </button>
  );
}
