import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AddCategory from "./components/AddCategory";
import Categories from "./components/Categries";
import AddMeal from "./components/AddMeal";
import Meal from "./components/Meal";
import UsersList from "./components/UserList";

import "./index.css";
import OrderList from "./components/OrderList";
import Settings from "./components/Settings";
import AddItem from "./components/AddItem";
import Item from "./components/Item";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />

        <Route path="categories" element={<Categories />} />

        <Route path="categories/add" element={<AddCategory />} />

        <Route path="meals" element={<Meal />} />

        <Route path="meals/add" element={<AddMeal />} />

        <Route path="items" element={< Item/>} />

        <Route path="items/add" element={<AddItem />} />

        <Route path="users" element={<UsersList />} />

        <Route path="orders" element={< OrderList />}/>
        

        <Route path="settings" element={< Settings/>} />


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
