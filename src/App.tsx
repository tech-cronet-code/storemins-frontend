// src/App.tsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";

// Routes
import AdminRoute from "./routes/AdminRoute";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import SellerRoute from "./routes/SellerRoute";

// Pages
import AuthFormPage from "./modules/auth/pages/AuthFormPage";
import AuthOTPVerifyPage from "./modules/auth/pages/AuthOTPVerifyPage";
import AdminDashboard from "./modules/dashboard/pages/AdminDashboard";
import SellerDashboard from "./modules/dashboard/pages/SellerDashboard";
import OtpRoute from "./routes/OtpRoute";
import SellerStoreDetailsPage from "./modules/auth/pages/SellerStoreDetailsPage";
// import AuthFormPage from "./modules/auth/pages/AuthForm";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/home" element={<AuthFormPage />} />
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> */}
          {/* <Route path="/register" element={<RegisterPage onSwitch={function (): void {
            throw new Error("Function not implemented.");
          }} />} />
           */}
        </Route>
        {/* <Route path="/home" element={<AuthFormPage />} /> */}

        <Route path="/otp-verify" element={<OtpRoute />}>
          <Route index element={<AuthOTPVerifyPage />} />
        </Route>
        {/* ✅ Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<SellerRoute />}>
            <Route path="/seller/" element={<SellerDashboard />} />
            <Route
              path="/seller/store-details"
              element={<SellerStoreDetailsPage />}
            />
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
