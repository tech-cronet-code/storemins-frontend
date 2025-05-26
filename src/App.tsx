// src/App.tsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "./index.css";

// Routes
import AdminRoute from "./routes/AdminRoute";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import SellerRoute from "./routes/SellerRoute";

// Pages
import { UserRoleName } from "./modules/auth/constants/userRoles";
import AuthFormPage from "./modules/auth/pages/AuthFormPage";
import AuthOTPVerifyPage from "./modules/auth/pages/AuthOTPVerifyPage";
import SellerStoreDetailsPage from "./modules/auth/pages/SellerStoreDetailsPage";
import SellerUnlockStorePage from "./modules/auth/pages/SellerUnlockStorePage";
import Layout from "./modules/dashboard/components/Layout";
import AdminDashboard from "./modules/dashboard/pages/AdminDashboard";
import SellerDashboard from "./modules/dashboard/pages/SellerDashboard";
import AddProductPage from "./modules/seller/components/products/AddProductPage";
import SellerProductsPage from "./modules/seller/pages/SellerProductsPage";
import UserSettingsPage from "./modules/seller/pages/UserSettingsPage";
import OtpRoute from "./routes/OtpRoute";
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
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<SellerRoute />}>
            <Route path="/seller/" element={<SellerDashboard />} />
            <Route
              path="/seller/store-details"
              element={<SellerStoreDetailsPage />}
            />
            <Route
              path="/seller/store-unlock"
              element={<SellerUnlockStorePage />}
            />
            <Route
              path="/seller/user-settings"
              element={<UserSettingsPage />}
            />
            <Route
              path="/seller/catalogue/products"
              element={<SellerProductsPage />}
            />
            <Route element={<Layout role={UserRoleName.SELLER} />}>
              <Route
                path="/seller/catalogue/products/create"
                element={<AddProductPage />}
              />
            </Route>
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
