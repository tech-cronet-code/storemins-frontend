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
// import AuthFormPage from "./modules/auth/pages/AuthFormPage";
import AuthOTPVerifyPage from "./modules/auth/pages/AuthOTPVerifyPage";
import SellerStoreDetailsPage from "./modules/auth/pages/SellerStoreDetailsPage";
import SellerUnlockStorePage from "./modules/auth/pages/SellerUnlockStorePage";
import AdminDashboard from "./modules/dashboard/pages/AdminDashboard";
import SellerDashboard from "./modules/dashboard/pages/SellerDashboard";
import AddCategoriesPage from "./modules/seller/pages/AddCategoriesPage";
import AddProductPage from "./modules/seller/pages/AddProductPage";
import SellerProductsCategoriesPage from "./modules/seller/pages/SellerProductsCategoriesPage";
import SellerProductsPage from "./modules/seller/pages/SellerProductsPage";
import UserSettingsPage from "./modules/seller/pages/UserSettingsPage";
import OtpRoute from "./routes/OtpRoute";
import SellerProductsInventoryPage from "./modules/seller/pages/SellerProductsInventoryPage";
import SellerProductsOrdersPage from "./modules/seller/pages/SellerProductsOrdersPage";
import ScrollToTop from "./modules/seller/common/components/ScrollToTop";
import LoginPage from "./modules/auth/pages/LoginPage";
import RegisterPage from "./modules/auth/pages/RegisterPage";
import AddStoreSettingPage from "./modules/seller/pages/store-appearance/AddStoreSettingPage";
import AddStoreDisplaySettingPage from "./modules/seller/pages/store-appearance/AddStoreDiplaySettingPage";
// import AuthFormPage from "./modules/auth/pages/AuthForm";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ✅ Public Routes */}
        <Route element={<PublicRoute />}>
          {/* <Route path="/home" element={<AuthFormPage />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
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
            <Route
              path="/seller/catalogue/products/create"
              element={<AddProductPage />}
            />
            <Route
              path="/seller/catalogue/products/edit/:id"
              element={<AddProductPage />}
            />

            <Route
              path="/seller/catalogue/categories"
              element={<SellerProductsCategoriesPage />}
            />
            <Route
              path="/seller/catalogue/categories/create"
              element={<AddCategoriesPage />}
            />
            <Route
              path="/seller/catalogue/categories/edit/:id"
              element={<AddCategoriesPage />}
            />

            <Route
              path="/seller/catalogue/inventory"
              element={<SellerProductsInventoryPage />}
            />
            <Route
              path="/seller/orders"
              element={<SellerProductsOrdersPage />}
            />
            {/* Store Appearance */}
            <Route
              path="/seller/appearance/store-Setting"
              element={<AddStoreSettingPage section="store-setting" />}
            />
            <Route
              path="/seller/appearance/store-setting/store-domain"
              element={<AddStoreSettingPage section="store-domain" />}
            />
            <Route
              path="/seller/appearance/store-setting/store-timings"
              element={<AddStoreSettingPage section="store-timings" />}
            />
            <Route
              path="/seller/appearance/display-setting"
              element={<AddStoreDisplaySettingPage section="display-setting" />}
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
