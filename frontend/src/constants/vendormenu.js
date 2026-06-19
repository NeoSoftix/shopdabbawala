import {
  MdDashboard,
  MdShoppingCart,
  MdNotifications,
  MdSettings,
} from "react-icons/md"; 

import { IoLocationOutline } from "react-icons/io5"; 

import {
  FaUserEdit,
  FaStore,
} from "react-icons/fa";

export const vendorMenu = [
  {
    label: "Dashboard",
    path: "/vendor/dashboard",
    icon: MdDashboard,
  },
  {
    label: "Service Area",
    path: "/vendor/service-area",
    icon: IoLocationOutline,
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
    label: "Store Status",
    path: "/vendor/store-status",
    icon: FaStore,
  },
  {
    label: "Settings",
    path: "/vendor/settings",
    icon: MdSettings,
  },
];