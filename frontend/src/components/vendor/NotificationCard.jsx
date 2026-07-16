import {
  Bell,
  ShoppingBag,
  CheckCircle,
  Info,
  Megaphone,
  Trash2,
} from "lucide-react";

const icons = {
  order: ShoppingBag,
  payment: CheckCircle,
  system: Info,
  promotion: Megaphone,
};

export default function NotificationCard({
  title,
  message,
  time,
  type = "order",
  unread = false,
  onClick,
  onDelete,
}) {
  const Icon = icons[type] || Bell;

  return (
    <div
      onClick={onClick}
      className={`relative bg-white border rounded-xl p-3.5 hover:shadow-md transition ${
        unread ? "border-l-4 border-l-[#E23747] cursor-pointer" : ""
      }`}
    >
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full text-gray-300 hover:text-red-600 hover:bg-red-50 transition-colors"
          aria-label="Delete notification"
        >
          <Trash2 size={14} />
        </button>
      )}

      <div className="flex justify-between pr-6">
        <div className="flex gap-3">
          <div className="w-9 h-9 shrink-0 rounded-full bg-red-50 flex items-center justify-center">
            <Icon size={18} className="text-[#E23747]" />
          </div>

          <div>
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-xs text-gray-400">
            {time}
          </span>

          {unread && (
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </div>
      </div>
    </div>
  );
}