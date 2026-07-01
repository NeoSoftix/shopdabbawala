import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Login from "./pages/Login";

import AddCategory from "../src/components/Admin/AddCategory";
import Categories from "../src/components/Admin/Categries";
import AddMeal from "../src/components/Admin/AddMeal";
import Meal from "../src/components/Admin/Meal";
import UsersList from "../src/components/Admin/UserList";

import "./index.css";
import OrderList from "../src/components/OrderList";
import Settings from "../src/components/Admin/Settings";
import AddItem from "../src/components/Admin/AddItem";
import Item from "../src/components/Admin/Item";
import VendorList from "../src/components/Admin/Vendor";
import AddVendor from "../src/components/Admin/AddVendor";
import CreateAddOns from "../src/components/Admin/CreateAddOns";
import AddOns from "../src/components/Admin/AddOns";
import PackagesPage from "../src/components/Admin/PackagesPage";

import VendorLayout from "../src/pages/Vendor/VendorLayout";
import VendorDashboard from "../src/pages/Vendor/VendorDashboard";
import VendorOrders from "../src/pages/Vendor/OrdersPage";
import VendorProfile from "../src/pages/Vendor/VendorProfilePage";
import VendorNotifications from "../src/pages/Vendor/VendorNotifications";

import UserLayout from "../src/pages/User/UserLayout";
import UserDashboard from "../src/pages/User/UserDashboard";
import "./react-calendar.css";
import ServiceArea from "./pages/Vendor/ServiceArea";
import CreatePackage from "./pages/User/CreatePackage";
import MealPlanner from "./pages/User/MealPlanner";

import ProtectedRoute from "./routes/ProtectedRoute";
import NotFoundPage from "./components/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/" />} />
      <Route path="/login" element={<Login />} />

      {/* admin route */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="categories" element={<Categories />} />
        <Route path="categories/add" element={<AddCategory />} />
        <Route path="meals" element={<Meal />} />
        <Route path="meals/add" element={<AddMeal />} />
        <Route path="items" element={<Item />} />
        <Route path="items/add" element={<AddItem />} />
        <Route path="users" element={<UsersList />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="settings" element={<Settings />} />
        <Route path="vendors" element={<VendorList />} />
        <Route path="vendors/add" element={<AddVendor />} />
        <Route path="packages" element={<PackagesPage />} />
        <Route path="add-on" element={<AddOns />} />
        <Route path="add-on/add" element={<CreateAddOns />} />
      </Route>

      {/* Vendor layout route */}
      <Route
        path="/vendor"
        element={
          <ProtectedRoute allowedRoles={["vendor"]}>
            <VendorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="orders" element={<VendorOrders />} />
        <Route path="service-area" element={<ServiceArea />} />
        <Route path="profile" element={<VendorProfile />} />
        <Route path="notifications" element={<VendorNotifications />} />
      </Route>

      {/* user route */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<UserDashboard />} />
        <Route path="create-package" element={<CreatePackage />} />

        <Route
          path="meal-planner"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MealPlanner />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
