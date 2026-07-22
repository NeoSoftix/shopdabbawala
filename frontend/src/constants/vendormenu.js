import {
  MdDashboard,
  MdShoppingCart,
  MdNotifications,
  MdSettings,
} from "react-icons/md";

import {
  FaUserEdit,
  FaMapMarkedAlt,
} from "react-icons/fa";

export const vendorMenu = [
  {
    label: "Dashboard",
    path: "/vendor/dashboard",
    icon: MdDashboard,
  },
  {
    label: "Orders",
    path: "/vendor/orders",
    icon: MdShoppingCart,
  },
  {
    label: "Notifications",
    path: "/vendor/notifications",
    icon: MdNotifications,
  },
  {
    label: "Profile",
    path: "/vendor/profile",
    icon: FaUserEdit,
  },
  {
    label: "Service Zone",
    path: "/vendor/service-zone",
    icon: FaMapMarkedAlt,
  },
];