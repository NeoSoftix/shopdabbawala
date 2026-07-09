import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, CreditCard, Info, Megaphone, Bell, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const ICONS = {
  order: ShoppingBag,
  payment: CreditCard,
  system: Info,
  promotion: Megaphone,
};

const formatTimeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications = [],
  unreadCount = 0,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  pagination = {},
  onPageChange,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[1100]"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 h-full w-[320px] sm:w-[380px] bg-white shadow-[0_0_50px_rgba(0,0,0,0.15)] z-[1101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-lg font-black text-slate-900">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs font-semibold text-red-600 mt-0.5">{unreadCount} unread</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-full transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Mark all as read */}
            {notifications.length > 0 && (
              <div className="flex justify-end px-5 pt-3">
                <button
                  onClick={onMarkAllAsRead}
                  disabled={unreadCount === 0}
                  className="text-xs font-bold text-red-600 hover:text-red-700 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <Bell size={36} className="text-slate-200 mb-3" />
                  <p className="text-sm font-semibold text-slate-400">No notifications yet.</p>
                  <p className="text-xs text-slate-300 mt-1">We'll let you know when something happens.</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = ICONS[notification.type] || Bell;
                  const isUnread = !notification.read;

                  return (
                    <div
                      key={notification._id}
                      className={`relative w-full flex items-start gap-3 p-3.5 rounded-2xl transition-colors ${
                        isUnread ? "bg-red-50/60 hover:bg-red-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => isUnread && onMarkAsRead && onMarkAsRead(notification._id)}
                        className="flex-1 min-w-0 flex items-start gap-3 text-left pr-6"
                      >
                        <span className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 text-red-600">
                          <Icon size={16} />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-slate-900 truncate">{notification.title}</span>
                            {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />}
                          </span>
                          <span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">{notification.message}</span>
                          <span className="block text-[10px] font-semibold text-slate-300 mt-1 uppercase tracking-wide">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                        </span>
                      </button>

                      {onDelete && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(notification._id);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label="Delete notification"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {pagination?.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 shrink-0">
                <button
                  onClick={() => onPageChange && onPageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>

                <span className="text-xs font-semibold text-slate-500">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => onPageChange && onPageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                  className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
