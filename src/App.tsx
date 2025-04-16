// src/App.tsx
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import PrivateRoute from "./routes/PrivateRoute";
import Login from "./modules/user/auth/pages/Login";
import SellerRoute from "./routes/SellerRoute";
// import Register from "./modules/user/auth/pages/Register";
import AuthForm from "./modules/user/auth/pages/AuthForm";
import UserProfile from "./modules/user/auth/components/ui/UserProfile";
import AdminRoute from "./routes/AdminRoute";
import SellerDashboard from "./modules/dashboard/pages/SellerDashboard";
import AdminDashboard from "./modules/dashboard/pages/AdminDashboard";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<AuthForm />} />

        {/* Protected Routes */}
        {/* <Route element={<PrivateRoute />}> */}
        <Route
          path="/profile"
          element={
            <div>
              <h1>Profile Page</h1>
              <UserProfile />
            </div>
          }
        />
        {/* <Route path="/products" element={<ProductList />} /> */}
        <Route element={<SellerRoute />}>
          <Route path="/seller/*" element={<SellerDashboard />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>
        {/* </Route> */}

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
