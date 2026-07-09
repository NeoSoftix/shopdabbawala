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
      className={`relative bg-white border rounded-2xl p-5 hover:shadow-md transition ${
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
          className="absolute top-3 right-3 p-1.5 rounded-full text-gray-300 hover:text-red-600 hover:bg-red-50 transition-colors"
          aria-label="Delete notification"
        >
          <Trash2 size={16} />
        </button>
      )}

      <div className="flex justify-between pr-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <Icon size={22} className="text-[#E23747]" />
          </div>

          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-gray-500 mt-1">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {time}
          </span>

          {unread && (
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          )}
        </div>
      </div>
    </div>
  );
}