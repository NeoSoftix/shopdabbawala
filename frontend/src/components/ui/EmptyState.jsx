import Button from "./Button";

// Generic empty-list placeholder: icon + title + subtitle + optional action.
export default function EmptyState({ icon, title, description, actionLabel, onAction, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-4 ${className}`}>
      {icon && (
        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
      {description && <p className="mt-1.5 text-sm text-gray-500 max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
