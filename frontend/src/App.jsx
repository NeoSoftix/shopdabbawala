import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import "./index.css";

function App() {
  return (
      <Routes>

        <Route path="/" element={<Navigate to="/admin/dashboard" />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Future Pages */}
           {/* <Route path="users" element={<Users />} /> 
           <Route path="vendors" element={<Vendors />} />
          <Route path="meals" element={<Meals />} /> 
          <Route path="items" element={<Items />} />
           <Route path="orders" element={<Orders />} /> */}
        </Route>

      </Routes>
  );
}

export default App;