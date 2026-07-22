// Shared order-status → Tailwind color classes, used by any table/calendar
// that renders an order's status as a pill (OrdersTable, OrdersCalendar).
export const ORDER_STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-600",
  Accepted: "bg-emerald-50 text-emerald-600",
  Rejected: "bg-red-50 text-red-600",
  Preparing: "bg-indigo-50 text-indigo-600",
  "On the way": "bg-blue-50 text-blue-600",
  Delivered: "bg-green-50 text-green-600",
  Cancelled: "bg-slate-100 text-slate-500",
};
