import Badge from "../ui/Badge";

export default function StatusBadge({ active, activeLabel = "Active", inactiveLabel = "Inactive" }) {
  return (
    <Badge color={active ? "green" : "red"}>
      {active ? activeLabel : inactiveLabel}
    </Badge>
  );
}
