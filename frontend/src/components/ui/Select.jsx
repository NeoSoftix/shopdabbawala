import FormField from "./FormField";

export default function Select({ label, error, required, wrapperClassName, className = "", children, ...props }) {
  const field = (
    <select
      required={required}
      className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-800 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </select>
  );

  if (!label && !error) return field;

  return (
    <FormField label={label} error={error} required={required} className={wrapperClassName}>
      {field}
    </FormField>
  );
}
