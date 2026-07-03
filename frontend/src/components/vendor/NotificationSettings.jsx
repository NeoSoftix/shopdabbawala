export default function NotificationSettings() {
  return (
    <div className="bg-white border rounded-2xl p-6">
      <h2 className="font-semibold text-xl mb-6">
        Notification Settings
      </h2>

      <div className="space-y-5">
        {[
          "Order Notifications",
          "Payment Notifications",
          "System Notifications",
        ].map((item) => (
          <div
            key={item}
            className="flex justify-between items-center"
          >
            <span>{item}</span>

            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 accent-[#E23747]"
            />
          </div>
        ))}
      </div>

      <button className="mt-8 w-full bg-[#E23747] text-white py-3 rounded-xl">
        Save Preferences
      </button>
    </div>
  );
}