export default function NotificationSummary() {
  return (
    <div className="bg-white border rounded-2xl p-6">
      <h2 className="font-semibold text-xl mb-5">
        Notification Summary
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Orders</span>
          <span>7</span>
        </div>

        <div className="flex justify-between">
          <span>Payments</span>
          <span>2</span>
        </div>

        <div className="flex justify-between">
          <span>System</span>
          <span>3</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t">
        <p className="text-[#E23747] font-semibold">
          Total Unread : 3
        </p>
      </div>
    </div>
  );
}