export default function NotificationSummary({
  counts = { order: 0, payment: 0, system: 0 },
  unreadCount = 0,
}) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <h2 className="font-semibold text-sm mb-3">
        Notification Summary
      </h2>

      <div className="space-y-2 text-sm">
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

      <div className="mt-3 pt-3 border-t">
        <p className="text-sm text-[#E23747] font-semibold">
          Total Unread : {unreadCount}
        </p>
      </div>
    </div>
  );
}
