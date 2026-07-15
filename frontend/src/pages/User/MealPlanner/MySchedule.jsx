import { CalendarDays, Utensils } from "lucide-react";
import { longDate, weekdayLabel } from "./constants";

const STATUS_STYLES = {
  confirmed: "bg-green-100 text-green-700",
  delivered: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  pending: "bg-yellow-100 text-yellow-700",
};

const statusLabel = (dayStatus, isActive) => {
  if (!dayStatus) return "Scheduled";
  if (dayStatus.active === false) return "Paused";
  if (dayStatus.status) return dayStatus.status[0].toUpperCase() + dayStatus.status.slice(1);
  return isActive ? "Active" : "Scheduled";
};

// ================= COMPONENT: READ-ONLY SCHEDULE + STATUS LIST =================
// Every day the user has scheduled a meal for, with its items and delivery
// status - the "My Schedule" sidebar tab. Purely informational, no editing.
const MySchedule = ({ weeklyPlan, dayStatus }) => {
  const dateKeys = Object.keys(weeklyPlan || {}).sort();

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
        <span className="w-10 h-10 rounded-full bg-red-50 text-[#e61e2d] flex items-center justify-center shrink-0">
          <CalendarDays size={18} />
        </span>
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Schedule</h2>
          <p className="text-gray-500 text-sm">Every day you've scheduled a meal for, with its delivery status.</p>
        </div>
      </div>

      {dateKeys.length === 0 ? (
        <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Meals Scheduled Yet</h3>
          <p className="text-gray-500 text-sm">
            Schedule a day in "Build Custom Meal" and it'll show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {dateKeys.map((key) => {
            const items = weeklyPlan[key] || [];
            const [y, m, d] = key.split("-");
            const date = new Date(y, m - 1, d);
            const status = dayStatus[key];
            const badgeClass = STATUS_STYLES[status?.status] || "bg-gray-100 text-gray-600";

            return (
              <div
                key={key}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-red-50 text-red-500 p-2.5 rounded-lg mt-0.5 shrink-0">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {weekdayLabel(date)} · {longDate(date)}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {items.length === 0 ? (
                        <span className="text-xs text-gray-400 italic">No items</span>
                      ) : (
                        items.map((item, idx) => (
                          <span
                            key={item._id || idx}
                            className="text-[11px] font-semibold px-1.5 py-0.5 rounded border bg-gray-50 text-gray-600 border-gray-200"
                          >
                            {item.name || "Item"} x{item.quantity || 1}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap self-start md:self-center ${badgeClass}`}>
                  {statusLabel(status, status?.active)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MySchedule;
