// src/App.tsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import SellerRoute from "./routes/SellerRoute";
import AdminDashboard from "./modules/dashboard/pages/AdminDashboard";
import SellerDashboard from "./modules/dashboard/pages/SellerDashboard";
import AuthFormPage from "./modules/user/auth/pages/AuthForm";
import AuthOTPVerifyPage from "./modules/user/auth/pages/AuthOTPVerifyPage";
import Login from "./modules/user/auth/pages/Login";
import RegisterPage from "./modules/user/auth/pages/Register";
import AdminRoute from "./routes/AdminRoute";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage onSwitch={function (): void {
            throw new Error("Function not implemented.");
          }} />} />

          <Route path="/home" element={<AuthFormPage />} />
        </Route>

        {/* ✅ Protected Routes */}
        <Route element={<PrivateRoute />}>
          {/* <Route
          path="/profile"
          element={
            <div>
              <h1>Profile Page</h1>
              <UserProfile />
            </div>
          }
        />
        {/* <Route path="/products" element={<ProductList />} /> */}
          <Route path="/otp-verify" element={<AuthOTPVerifyPage />} />
          <Route element={<SellerRoute />}>
            <Route path="/seller/*" element={<SellerDashboard />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>
        </Route>


        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
