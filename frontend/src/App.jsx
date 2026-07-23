import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/shared/ScrollToTop";
import BackToTopButton from "./components/shared/BackToTopButton";
import AppLoader from "./components/shared/AppLoader";
import WhatsAppWidget from "./components/shared/WhatsAppWidget";
import { useAuth } from "./context/AuthContext";

import "./index.css";
import "./react-calendar.css";

import ProtectedRoute from "./routes/ProtectedRoute";

// Every page below is route-level, so it's fine to split each into its own
// chunk - the browser only ever needs to download the page(s) for whichever
// section (admin/vendor/customer) the visitor actually lands on, instead of
// bundling admin + vendor + customer code into a single upfront download.
const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const AddCategory = lazy(() => import("./components/Admin/AddCategory"));
const Categories = lazy(() => import("./components/Admin/Categories"));
const UsersList = lazy(() => import("./components/Admin/UserList"));

const AdminOrdersPage = lazy(() => import("./pages/Admin/OrdersPage"));
const Settings = lazy(() => import("./components/Admin/Settings"));
const AddItem = lazy(() => import("./components/Admin/AddItem"));
const Item = lazy(() => import("./components/Admin/Item"));
const VendorList = lazy(() => import("./components/Admin/Vendor"));
const AddVendor = lazy(() => import("./components/Admin/AddVendor"));
const AssignVendor = lazy(() => import("./pages/Admin/AssignVendor"));
const DeliveryCharges = lazy(() => import("./pages/Admin/DeliveryCharges"));
const CreateAddOns = lazy(() => import("./components/Admin/CreateAddOns"));
const AddOns = lazy(() => import("./components/Admin/AddOns"));
const PackagesPage = lazy(() => import("./components/Admin/PackagesPage"));
const WeeklyMenuManager = lazy(() => import("./pages/Admin/WeeklyMenuManager"));
const CampaignDashboard = lazy(() => import("./pages/Admin/Campaigns/CampaignDashboard"));
const CreateCampaign = lazy(() => import("./pages/Admin/Campaigns/CreateCampaign"));
const TemplateList = lazy(() => import("./pages/Admin/Campaigns/TemplateList"));
const TemplateBuilder = lazy(() => import("./pages/Admin/Campaigns/TemplateBuilder"));

const VendorLayout = lazy(() => import("./pages/Vendor/VendorLayout"));
const VendorDashboard = lazy(() => import("./pages/Vendor/VendorDashboard"));
const VendorOrders = lazy(() => import("./pages/Vendor/OrdersPage"));
const VendorProfile = lazy(() => import("./pages/Vendor/VendorProfilePage"));
const VendorNotifications = lazy(() => import("./pages/Vendor/VendorNotifications"));
const VendorServiceZone = lazy(() => import("./pages/Vendor/VendorServiceZone"));

const UserLayout = lazy(() => import("./pages/User/UserLayout"));
const UserDashboard = lazy(() => import("./pages/User/UserDashboard"));
const CreatePackage = lazy(() => import("./pages/User/CreatePackage"));
const MealPlanner = lazy(() => import("./pages/User/MealPlanner"));

const NotFoundPage = lazy(() => import("./components/shared/NotFoundPage"));

const PaymentSuccess = lazy(() => import("./components/shared/PaymentSuccess"));
const PaymentFailed = lazy(() => import("./components/shared/PaymentFailed"));
const SetDuration = lazy(() => import("./components/Admin/SetDuration.jsx"));
const MealTierManager = lazy(() => import("./components/Admin/MealTierManager.jsx"));
const AboutUsPage = lazy(() => import("./pages/User/AboutUsPage.jsx"));
const ContactUsPage = lazy(() => import("./pages/User/ContactUsPage.jsx"));
const ThankYouPage = lazy(() => import("./pages/User/ThankYouPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/User/PrivacyPolicyPage.jsx"));
const TermsAndConditionsPage = lazy(() => import("./pages/User/TermsAndConditionsPage.jsx"));

function App() {
  const { loading } = useAuth();
  const location = useLocation();
  const isCustomerRoute = !location.pathname.startsWith("/admin") && !location.pathname.startsWith("/vendor");

  if (loading) {
    return <AppLoader />;
  }

  return (
    <>
      <ScrollToTop />
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


      <Suspense fallback={<AppLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

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
        <Route path="items" element={<Item />} />
        <Route path="items/add" element={<AddItem />} />
        <Route path="users" element={<UsersList />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="settings" element={<Settings />} />
        <Route path="vendors" element={<VendorList />} />
        <Route path="vendors/add" element={<AddVendor />} />
        <Route path="vendor-assignment" element={<AssignVendor />} />
        <Route path="delivery-charges" element={<DeliveryCharges />} />
        <Route path="packages" element={<PackagesPage />} />
        <Route path="add-on" element={<AddOns />} />
        <Route path="add-on/add" element={<CreateAddOns />} />
        <Route path="duration" element={<SetDuration />} />
        <Route path="meal-tiers" element={<MealTierManager />} />
        <Route path="weekly-menu" element={<WeeklyMenuManager />} />
        
        {/* Campaign Routes */}
        <Route path="campaigns" element={<CampaignDashboard />} />
        <Route path="campaigns/new" element={<CreateCampaign />} />
        <Route path="campaigns/:id/edit" element={<CreateCampaign />} />
        <Route path="campaigns/templates" element={<TemplateList />} />
        <Route path="campaigns/templates/new" element={<TemplateBuilder />} />
        <Route path="campaigns/templates/:id" element={<TemplateBuilder />} />
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
        <Route path="profile" element={<VendorProfile />} />
        <Route path="notifications" element={<VendorNotifications />} />
        <Route path="service-zone" element={<VendorServiceZone />} />
      </Route>

      {/* user route */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<UserDashboard />} />
        <Route path="plans" element={<UserDashboard />} />
        <Route path="create-package" element={<CreatePackage />} />
        <Route path="dashboard" element={<MealPlanner />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-cancel" element={<PaymentFailed />} />

<Route path="/about" element={<AboutUsPage />} />

<Route path="/contact-us" element={<ContactUsPage />} />

<Route path="/thank-you" element={<ThankYouPage />} />

<Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

<Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
    </Routes>
      </Suspense>
      {isCustomerRoute && <WhatsAppWidget />}
      <BackToTopButton />
    </>
  );
}

export default App;
