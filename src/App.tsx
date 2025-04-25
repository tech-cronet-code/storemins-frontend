// src/App.tsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";

// Routes
import SellerRoute from "./routes/SellerRoute";
import AdminRoute from "./routes/AdminRoute";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

// Pages
import Login from "./modules/user/auth/pages/Login";
import RegisterPage from "./modules/user/auth/pages/Register";
import AuthFormPage from "./modules/user/auth/pages/AuthForm";
import AuthOTPVerifyPage from "./modules/user/auth/pages/AuthOTPVerifyPage";
import SellerDashboard from "./modules/dashboard/pages/SellerDashboard";
import AdminDashboard from "./modules/dashboard/pages/AdminDashboard";
import OtpRoute from "./routes/OtpRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/register" element={<RegisterPage onSwitch={function (): void {
            throw new Error("Function not implemented.");
          }} />} />
          <Route path="/home" element={<AuthFormPage />} /> */}
        </Route>

        <Route path="/otp-verify" element={<OtpRoute />}>
          <Route index element={<AuthOTPVerifyPage />} />
        </Route>
        {/* ✅ Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<SellerRoute />}>
            <Route path="/seller/*" element={<SellerDashboard />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* 🔁 Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
