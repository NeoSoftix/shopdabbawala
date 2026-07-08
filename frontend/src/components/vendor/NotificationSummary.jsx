export default function NotificationSummary({
  counts = { order: 0, payment: 0, system: 0 },
  unreadCount = 0,
}) {
  return (
    <div className="bg-white border rounded-2xl p-6">
      <h2 className="font-semibold text-xl mb-5">
        Notification Summary
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Orders</span>
          <span>{counts.order || 0}</span>
        </div>

        <div className="flex justify-between">
          <span>Payments</span>
          <span>{counts.payment || 0}</span>
        </div>

        <div className="flex justify-between">
          <span>System</span>
          <span>{counts.system || 0}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t">
        <p className="text-[#E23747] font-semibold">
          Total Unread : {unreadCount}
        </p>
      </div>
    </div>
  );
}
