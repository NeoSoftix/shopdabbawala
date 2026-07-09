import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Login from "./pages/Login";

import AddCategory from "./components/Admin/AddCategory";
import Categories from "./components/Admin/Categories";
import AddMeal from "./components/Admin/AddMeal";
import Meal from "./components/Admin/Meal";
import UsersList from "./components/Admin/UserList";

import "./index.css";
import OrderList from "./components/shared/OrderList";
import Settings from "./components/Admin/Settings";
import AddItem from "./components/Admin/AddItem";
import Item from "./components/Admin/Item";
import VendorList from "./components/Admin/Vendor";
import AddVendor from "./components/Admin/AddVendor";
import CreateAddOns from "./components/Admin/CreateAddOns";
import AddOns from "./components/Admin/AddOns";
import PackagesPage from "./components/Admin/PackagesPage";

import VendorLayout from "./pages/Vendor/VendorLayout";
import VendorDashboard from "./pages/Vendor/VendorDashboard";
import VendorOrders from "./pages/Vendor/OrdersPage";
import VendorProfile from "./pages/Vendor/VendorProfilePage";
import VendorNotifications from "./pages/Vendor/VendorNotifications";

import UserLayout from "./pages/User/UserLayout";
import UserDashboard from "./pages/User/UserDashboard";
import "./react-calendar.css";
import ServiceArea from "./pages/Vendor/ServiceArea";
import CreatePackage from "./pages/User/CreatePackage";
import MealPlanner from "./pages/User/MealPlanner";

import ProtectedRoute from "./routes/ProtectedRoute";
import NotFoundPage from "./components/shared/NotFoundPage";

import PaymentSuccess from "./components/shared/PaymentSuccess";
import PaymentFailed from "./components/shared/PaymentFailed";
import SetDuration from "./components/Admin/SetDuration.jsx"
import MealTierManager from "./components/Admin/MealTierManager.jsx"
import AboutUsPage from "./pages/User/AboutUsPage.jsx";
import ContactUsPage from "./pages/User/ContactUsPage.jsx";

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "14px",
            fontWeight: "500",
            borderRadius: "14px",
            padding: "12px 20px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
            fontFamily: "'Outfit', 'Inter', sans-serif",
          },
          success: {
            icon: false,
            style: {
              background: "#ECFDF5",
              color: "#065F46",
              border: "1px solid #A7F3D0",
            },
          },
          error: {
            icon: false,
            style: {
              background: "#FEF2F2",
              color: "#991B1B",
              border: "1px solid #FEE2E2",
            },
          },
        }}
      />
      <Routes>
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
        <Route path="duration" element={<SetDuration />} />
        <Route path="meal-tiers" element={<MealTierManager />} />
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
        <Route path="dashboard" element={<MealPlanner />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-cancel" element={<PaymentFailed />} />

<Route path="/about" element={<AboutUsPage />} />

<Route path="/contact-us" element={<ContactUsPage />} />
    </Routes>
    </>
  );
}

export default App;
