import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import NotificationCard from "../../components/vendor/NotificationCard";
import NotificationFilters from "../../components/vendor/NotificationFilters";
import NotificationSummary from "../../components/vendor/NotificationSummary";
// import NotificationSettings from "../../components/vendor/NotificationSettings";
import { useNotifications } from "../../context/NotificationContext";
import Pagination from "../../components/shared/Pagination";

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

export default function VendorNotifications() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    page,
    setPage,
    pagination,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState("all");

  const counts = useMemo(() => {
    return {
      all: notifications.length,
      order: notifications.filter((n) => n.type === "order").length,
      payment: notifications.filter((n) => n.type === "payment").length,
      system: notifications.filter((n) => n.type === "system").length,
    };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-red-50 text-[#E23747] flex items-center justify-center shrink-0">
              <Bell size={16} />
            </span>
            <h1 className="text-xl font-bold">Notifications</h1>
          </div>

          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="text-sm text-[#E23747] font-medium disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            Mark all as read
          </button>
        </div>

        <NotificationFilters
          counts={counts}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {filteredNotifications.length === 0 ? (
          <div className="bg-white border rounded-2xl p-8 text-center text-gray-400">
            No notifications yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                title={notification.title}
                message={notification.message}
                time={formatTimeAgo(notification.createdAt)}
                type={notification.type}
                unread={!notification.read}
                onClick={() =>
                  !notification.read && markAsRead(notification._id)
                }
                onDelete={() => deleteNotification(notification._id)}
              />
            ))}

            {/* Pagination */}
            {pagination?.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <NotificationSummary
          counts={counts}
          unreadCount={unreadCount}
        />
        {/* <NotificationSettings /> */}
      </div>
    </div>
  );
}