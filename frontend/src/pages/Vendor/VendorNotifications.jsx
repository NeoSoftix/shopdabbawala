import NotificationCard from "../../components/vendor/NotificationCard";
import NotificationFilters from "../../components/vendor/NotificationFilters";
import NotificationSummary from "../../components/vendor/NotificationSummary";
import NotificationSettings from "../../components/vendor/NotificationSettings";

export default function VendorNotifications() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-5">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Notifications</h1>

          <button className="text-[#E23747] font-medium">
            Mark all as read
          </button>
        </div>

        <NotificationFilters />

        <NotificationCard
          title="New Order Received"
          message="Order #1001 received from Rahul."
          time="2 min ago"
          unread
          type="order"
        />

        <NotificationCard
          title="Payment Received"
          message="₹250 payment received."
          time="1 hour ago"
          type="payment"
        />

        <NotificationCard
          title="System Update"
          message="Maintenance scheduled tonight."
          time="3 hours ago"
          type="system"
        />
      </div>

      <div className="space-y-6">
        <NotificationSummary />
        <NotificationSettings />
      </div>
    </div>
  );
}
