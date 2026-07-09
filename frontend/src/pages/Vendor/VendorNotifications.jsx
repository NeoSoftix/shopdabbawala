import { useMemo, useState } from "react";
import NotificationCard from "../../components/vendor/NotificationCard";
import NotificationFilters from "../../components/vendor/NotificationFilters";
import NotificationSummary from "../../components/vendor/NotificationSummary";
import NotificationSettings from "../../components/vendor/NotificationSettings";
import { useNotifications } from "../../context/NotificationContext";

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
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-5">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Notifications</h1>

          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="text-[#E23747] font-medium disabled:text-gray-300 disabled:cursor-not-allowed"
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
          <div className="bg-white border rounded-2xl p-10 text-center text-gray-400">
            No notifications yet.
          </div>
        ) : (
          <>
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
              />
            ))}

            {/* Pagination */}
            {pagination?.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setPage((prev) => prev - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="text-sm font-medium">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="space-y-6">
        <NotificationSummary
          counts={counts}
          unreadCount={unreadCount}
        />
        <NotificationSettings />
      </div>
    </div>
  );
}