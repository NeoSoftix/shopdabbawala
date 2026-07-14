import {
  MdDashboard,
  MdRestaurantMenu,
  MdFastfood,
  MdPeople,
  MdShoppingCart,
  MdSettings,
  MdAddShoppingCart,
    MdLocalOffer

} from "react-icons/md";
import { MdTune } from "react-icons/md";
import { FaStore, FaClipboardList, FaHeart, FaImage } from "react-icons/fa";

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
    label: "Add On",
    path: "/admin/add-on",
    icon: MdAddShoppingCart,
  },
  {
    label: "Vendors",
    path: "/admin/vendors",
    icon: FaStore,
  },
  {
    label: "Assign Vendor",
    path: "/admin/vendor-assignment",
    icon: MdTune,
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
  // ✅ NEW ADDED
  {
    label: "Packages",
    path: "/admin/packages",
    icon: MdLocalOffer,
  },
  {
    label:"Delivery Charges",
    path:"/admin/delivery-charges",
    icon:MdAddShoppingCart
  },
{
    label: "Set Duration",
    path: "/admin/duration",
    icon: MdLocalOffer,
  },

  {
    label: "Custom Meal Tiers",
    path: "/admin/meal-tiers",
    icon: MdTune,
  },

  {
    label: "Weekly Menu",
    path: "/admin/weekly-menu",
    icon: MdRestaurantMenu,
  },


  {
    label: "Settings",
    path: "/admin/settings",
    icon: MdSettings,
  },


];
