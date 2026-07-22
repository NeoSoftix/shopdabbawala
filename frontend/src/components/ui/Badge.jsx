const COLOR_CLASSES = {
  green: "bg-emerald-100 text-emerald-700",
  red: "bg-rose-100 text-rose-700",
  yellow: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
  gray: "bg-gray-100 text-gray-600",
  orange: "bg-orange-100 text-orange-700",
  purple: "bg-purple-100 text-purple-700",
};

// Generic status pill. Pass a `color` key (see COLOR_CLASSES) or map your
// own status string to a color before rendering, e.g.
// <Badge color={STATUS_COLORS[order.status]}>{order.status}</Badge>
export default function Badge({ color = "gray", className = "", children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${COLOR_CLASSES[color] || COLOR_CLASSES.gray} ${className}`}
    >
      {children}
    </span>
  );
}
