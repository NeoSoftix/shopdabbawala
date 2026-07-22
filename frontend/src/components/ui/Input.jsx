import FormField from "./FormField";

// Generic text input. Pass label/error/required to get the FormField wrapper,
// or omit them and use just the styled <input/> inline.
export default function Input({ label, error, required, wrapperClassName, className = "", ...props }) {
  const field = (
    <input
      required={required}
      className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );

  if (!label && !error) return field;

  return (
    <FormField label={label} error={error} required={required} className={wrapperClassName}>
      {field}
    </FormField>
  );
}
