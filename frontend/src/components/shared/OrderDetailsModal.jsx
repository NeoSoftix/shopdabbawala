import ModalShell from "./CheckoutFlowModal/ModalShell";

const statusStyles = {
  Pending: "bg-amber-50 text-amber-600",
  Accepted: "bg-emerald-50 text-emerald-600",
  Rejected: "bg-red-50 text-red-600",
  Preparing: "bg-indigo-50 text-indigo-600",
  "On the way": "bg-blue-50 text-blue-600",
  Delivered: "bg-green-50 text-green-600",
  Cancelled: "bg-slate-100 text-slate-500",
};

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const Section = ({ label, children }) => (
  <div>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
      {label}
    </p>
    <div className="text-sm text-gray-800">{children}</div>
  </div>
);

export default function OrderDetailsModal({ order, onClose, onAccept, onReject }) {
  if (!order) return null;

  const hasAddons = order.addons?.length > 0;

  return (
    <ModalShell
      isOpen={Boolean(order)}
      onClose={onClose}
      maxWidthClass="max-w-md"
      showCloseButton
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">Order #{order._id.slice(-6).toUpperCase()}</h2>
            <p className="text-xs text-gray-400 mt-1">{order._id}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                statusStyles[order.status] || "bg-slate-100 text-slate-500"
              }`}
            >
              {order.status}
            </span>
            {order.active === false && (
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-red-600 text-white uppercase tracking-wide whitespace-nowrap">
                Inactive by user
              </span>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <Section label="Customer">
            <p className="font-medium">{order.user?.name || "Not set"}</p>
            <p className="text-gray-500">{order.user?.email || "—"}</p>
            <p className="text-gray-500">{order.user?.phone || "—"}</p>
          </Section>

          <Section label="Delivery Address">
            {order.deliveryAddress || "—"}
          </Section>

          <Section label="Order Date">{formatDate(order.orderDate)}</Section>

          <Section label="Delivery">
            <p>{order.deliveryMethod}</p>
            <p className="text-gray-500">
              {order.day ? `${order.day}, ` : ""}
              {order.deliveryTimeSlot}
            </p>
          </Section>
        </div>

        <Section label="Items">
          {order.items?.length ? (
            <ul className="divide-y border rounded-xl overflow-hidden">
              {order.items.map((it, idx) => (
                <li
                  key={idx}
                  className="flex justify-between px-4 py-2 bg-white"
                >
                  <span>{it.name}</span>
                  <span className="text-gray-500">x{it.qty}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-400 italic">No items</span>
          )}
        </Section>

        {hasAddons && (
          <Section label="Add-ons">
            <ul className="divide-y border rounded-xl overflow-hidden">
              {order.addons.map((ad, idx) => (
                <li
                  key={idx}
                  className="flex justify-between px-4 py-2 bg-white"
                >
                  <span>{ad.name}</span>
                  <span className="text-gray-500">
                    x{ad.qty} {ad.price ? `· ₹${ad.price}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {order.status === "Pending" && (onAccept || onReject) && (
          <div className="flex gap-3 pt-2">
            {order.active !== false && (
              <button
                type="button"
                onClick={() => {
                  onAccept?.(order._id);
                  onClose?.();
                }}
                className="flex-1 text-sm font-bold px-4 py-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Accept
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onReject?.(order._id);
                onClose?.();
              }}
              className="flex-1 text-sm font-bold px-4 py-2.5 rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </ModalShell>
  );
}
