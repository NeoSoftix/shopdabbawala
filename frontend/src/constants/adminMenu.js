import {
  MdDashboard,
  MdRestaurantMenu,
  MdFastfood,
  MdPeople,
  MdShoppingCart,
  MdSettings,
} from "react-icons/md";
import { MdTune } from "react-icons/md";
import {
  FaStore,
  FaClipboardList,
  FaHeart,
  FaImage,
} from "react-icons/fa";

import { BiCategoryAlt } from "react-icons/bi";

export const adminMenu = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: MdDashboard,
  },
  {
  label: "Meals",
  path: "/admin/meals",
  icon: MdRestaurantMenu,
},
 {
  label: "Categories",
  path: "/admin/categories",
  icon: BiCategoryAlt,
},

{
  label: "Items",
  path: "/admin/items",
  icon: MdFastfood,
},
 {
  label: "Item Variations",
  path: "/admin/variations",
  icon: MdTune,
},
  {
    label: "Vendors",
    path: "/admin/vendors",
    icon: FaStore,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: MdPeople,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: MdShoppingCart,
  },
  {
    label: "Suggestions",
    path: "/admin/suggestions",
    icon: FaClipboardList,
  },
  {
    label: "Feedback & Likes",
    path: "/admin/feedback",
    icon: FaHeart,
  },
  {
    label: "Banners",
    path: "/admin/banners",
    icon: FaImage,
  },
  {
    label: "Reports",
    path: "/admin/reports",
    icon: FaClipboardList,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: MdSettings,
  },
];