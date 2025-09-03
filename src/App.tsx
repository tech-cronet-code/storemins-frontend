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
import AuthFormPage from "./modules/auth/pages/AuthFormPage";
import AuthOTPVerifyPage from "./modules/auth/pages/AuthOTPVerifyPage";
import SellerStoreDetailsPage from "./modules/auth/pages/SellerStoreDetailsPage";
import SellerUnlockStorePage from "./modules/auth/pages/SellerUnlockStorePage";
import AdminDashboard from "./modules/dashboard/pages/AdminDashboard";
import SellerDashboard from "./modules/dashboard/pages/SellerDashboard";
import ScrollToTop from "./modules/seller/common/components/ScrollToTop";
import AddCategoriesPage from "./modules/seller/pages/AddCategoriesPage";
import AddProductPage from "./modules/seller/pages/AddProductPage";
import SellerProductsCategoriesPage from "./modules/seller/pages/SellerProductsCategoriesPage";
import SellerProductsInventoryPage from "./modules/seller/pages/SellerProductsInventoryPage";
import SellerProductsOrdersPage from "./modules/seller/pages/SellerProductsOrdersPage";
import SellerProductsPage from "./modules/seller/pages/SellerProductsPage";
import AddStoreDisplaySettingPage from "./modules/seller/pages/store-appearance/AddStoreDiplaySettingPage";
import AddStoreSettingPage from "./modules/seller/pages/store-appearance/AddStoreSettingPage";
import UserSettingsPage from "./modules/seller/pages/UserSettingsPage";
import OtpRoute from "./routes/OtpRoute";
import CustomerRoute from "./routes/CustomerRoute";
import CustomerHome from "./modules/customer/pages/CustomerHome";
import CustomerAccount from "./modules/customer/components/CustomerAccount";
import CustomerContactUs from "./modules/customer/components/CustomerContactUs";
import ProductDetail from "./modules/customer/components/ProductDetail";
import CartEmptyDetail from "./modules/customer/components/CartEmptyDetail";
import CartDetail from "./modules/customer/components/CartDetail";
import CustomerAddress from "./modules/customer/components/CustomerAddress";
import OrderSuccess from "./modules/customer/components/OrderSuccess";
import CategoryPage from "./modules/customer/pages/CategoryPage";
import SellerDigitalProductsPage from "./modules/seller/pages/SellerDigitalProductsPage";
import AddDigitalProductPage from "./modules/seller/pages/AddDigitalProductPage";
import SellerMeetingProductsPage from "./modules/seller/pages/SellerMeetingProductsPage";
import AddMeetingProductPage from "./modules/seller/pages/AddMeetingProductPage";
import SellerWorkShopProductsPage from "./modules/seller/pages/SellerWorkShopProductsPage";
import AddWorkShopProductPage from "./modules/seller/pages/AddWorkShopProductPage";
// import AuthFormPage from "./modules/auth/pages/AuthForm";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
              path="/seller/catalogue/products/physical"
              element={<SellerProductsPage />}
            />
            <Route
              path="/seller/catalogue/products/physical/create"
              element={<AddProductPage />}
            />
            <Route
              path="/seller/catalogue/products/physical/edit/:id"
              element={<AddProductPage />}
            />

            <Route
              path="/seller/catalogue/products/digital"
              element={<SellerDigitalProductsPage />}
            />
            <Route
              path="/seller/catalogue/products/digital/create"
              element={<AddDigitalProductPage />}
            />
            <Route
              path="/seller/catalogue/products/digital/edit/:id"
              element={<AddDigitalProductPage />}
            />

            <Route
              path="/seller/catalogue/products/meeting"
              element={<SellerMeetingProductsPage />}
            />
            <Route
              path="/seller/catalogue/products/meeting/create"
              element={<AddMeetingProductPage />}
            />
            <Route
              path="/seller/catalogue/products/meeting/edit/:id"
              element={<AddMeetingProductPage />}
            />

              <Route
              path="/seller/catalogue/products/workshop"
              element={<SellerWorkShopProductsPage />}
            />
            <Route
              path="/seller/catalogue/products/workshop/create"
              element={<AddWorkShopProductPage />}
            />
            <Route
              path="/seller/catalogue/products/workshop/edit/:id"
              element={<AddWorkShopProductPage />}
            />

            <Route
              path="/seller/catalogue/products/workshop"
              element={<SellerProductsPage />}
            />
            <Route
              path="/seller/catalogue/products/workshop/create"
              element={<AddProductPage />}
            />
            <Route
              path="/seller/catalogue/products/workshop/edit/:id"
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

        {/* everything under /customer will use the CustomerRoute guard */}
        <Route path="customer" element={<CustomerRoute />}>
          {/* GET  /customer/ */}
          <Route index element={<CustomerHome />} />

          {/* GET  /customer/cart-detail-empty */}
          <Route path="cart-detail-empty" element={<CartEmptyDetail />} />

          {/* GET  /customer/account */}
          <Route path="account" element={<CustomerAccount />} />

          {/* GET  /customer/contact-us */}
          <Route path="contact-us" element={<CustomerContactUs />} />

          {/* GET  /customer/product-details/:id */}
          <Route path="product-details/:id" element={<ProductDetail />} />

          {/* GET  /customer/cart-detail */}
          <Route path="cart-detail" element={<CartDetail />} />

          <Route path="address" element={<CustomerAddress />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="categories" element={<CategoryPage />} />

          {/* <Route path="payment" element={<CustomerPayment />} /> */}

          {/* fallback for any other /customer/... */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Route>

        {/* 🔁 Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
