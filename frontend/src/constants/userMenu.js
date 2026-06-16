import {
  FiHome,
  FiPackage,
  FiCalendar,
  FiClipboard,
  FiMapPin,
  FiCreditCard,
  FiUser,
  FiHelpCircle,
} from "react-icons/fi";

export const userMenuItems = [
  {
    label: "Dashboard",
    path: "/user/dashboard",
    icon: FiHome,
  },
  {
    label: "My Package",
    path: "/user/package",
    icon: FiPackage,
  },
  {
    label: "Schedule Meals",
    path: "/user/schedule-meals",
    icon: FiCalendar,
  },
  {
    label: "My Schedule",
    path: "/user/my-schedule",
    icon: FiClipboard,
  },
  {
    label: "My Orders",
    path: "/user/orders",
    icon: FiClipboard,
  },
  {
    label: "Addresses",
    path: "/user/addresses",
    icon: FiMapPin,
  },
  {
    label: "Payments",
    path: "/user/payments",
    icon: FiCreditCard,
  },
  {
    label: "Profile",
    path: "/user/profile",
    icon: FiUser,
  },
  {
    label: "Support",
    path: "/user/support",
    icon: FiHelpCircle,
  },
];