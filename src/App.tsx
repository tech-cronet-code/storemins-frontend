import { BrowserRouter, Route, Routes } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "./index.css";

// Routes
import { UserRoleName } from "./modules/auth/constants/userRoles";
import AdminRoute from "./routes/AdminRoute";
import CustomerRoute from "./routes/CustomerRoute";
import OtpRoute from "./routes/OtpRoute";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import RoleHomeRedirect from "./routes/RoleHomeRedirect";
import SellerRoute from "./routes/SellerRoute";

// Pages
import AuthFormPage from "./modules/auth/pages/AuthFormPage";
import AuthOTPVerifyPage from "./modules/auth/pages/AuthOTPVerifyPage";
import SellerStoreDetailsPage from "./modules/auth/pages/SellerStoreDetailsPage";
import SellerUnlockStorePage from "./modules/auth/pages/SellerUnlockStorePage";
import AdminDashboard from "./modules/dashboard/pages/AdminDashboard";
import SellerDashboard from "./modules/dashboard/pages/SellerDashboard";
import ScrollToTop from "./modules/seller/common/components/ScrollToTop";
import AddCategoriesPage from "./modules/seller/pages/AddCategoriesPage";
import AddDigitalProductPage from "./modules/seller/pages/AddDigitalProductPage";
import AddMeetingProductPage from "./modules/seller/pages/AddMeetingProductPage";
import AddProductPage from "./modules/seller/pages/AddProductPage";
import AddWorkShopProductPage from "./modules/seller/pages/AddWorkShopProductPage";
import SellerDigitalProductsPage from "./modules/seller/pages/SellerDigitalProductsPage";
import SellerMeetingProductsPage from "./modules/seller/pages/SellerMeetingProductsPage";
import SellerProductsCategoriesPage from "./modules/seller/pages/SellerProductsCategoriesPage";
import SellerProductsInventoryPage from "./modules/seller/pages/SellerProductsInventoryPage";
import SellerProductsOrdersPage from "./modules/seller/pages/SellerProductsOrdersPage";
import SellerProductsPage from "./modules/seller/pages/SellerProductsPage";
import SellerWorkShopProductsPage from "./modules/seller/pages/SellerWorkShopProductsPage";
import AddStoreDisplaySettingPage from "./modules/seller/pages/store-appearance/AddStoreDiplaySettingPage";
import AddStoreSettingPage from "./modules/seller/pages/store-appearance/AddStoreSettingPage";
import UserSettingsPage from "./modules/seller/pages/UserSettingsPage";
import PublicStorefrontPage from "./modules/storefront/pages/PublicStorefrontPage";
import OrderDetailsPage from "./modules/seller/components/orders/OrderDetailsPage";

const App = () => {
  const basename = import.meta.env.DEV ? "/" : "/storemins-frontend";

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <Routes>
        {/* Public storefront (e.g. /tech-cronet/*) */}
        <Route path=":storeSlug/*" element={<PublicStorefrontPage />} />

        {/* Public auth */}
        <Route element={<PublicRoute />}>
          <Route path="/home" element={<AuthFormPage />} />
        </Route>

        {/* OTP verify */}
        <Route path="/otp-verify" element={<OtpRoute />}>
          <Route index element={<AuthOTPVerifyPage />} />
        </Route>

        {/* CUSTOMER area (must be CUSTOMER) */}
        <Route
          element={
            <PrivateRoute
              allowed={[UserRoleName.CUSTOMER]}
              redirectTo="/home"
            />
          }
        >
          {/* <Route path="/profile" element={<CustomerProfilePage />} />
            <Route
              path="/profile/addresses"
              element={<CustomerAddressesPage />}
            /> */}
          {/* Your existing grouped customer section */}
          <Route path="/customer/*" element={<CustomerRoute />} />
        </Route>

        {/* SELLER area (must be SELLER) */}
        <Route
          element={
            <PrivateRoute allowed={[UserRoleName.SELLER]} redirectTo="/home" />
          }
        >
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

            {/* Catalogue - physical */}
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

            {/* Catalogue - digital */}
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

            {/* Catalogue - meeting */}
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

            {/* Catalogue - workshop */}
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

            {/* Categories */}
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

            {/* Inventory & Orders */}
            <Route
              path="/seller/catalogue/inventory"
              element={<SellerProductsInventoryPage />}
            />
            <Route
              path="/seller/orders"
              element={<SellerProductsOrdersPage />}
            />

            {/* 👇 New detailed order view */}
            <Route
              path="/seller/orders/:orderId"
              element={<OrderDetailsPage />}
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
        </Route>

        {/* ADMIN area (must be ADMIN) */}
        <Route
          element={
            <PrivateRoute allowed={[UserRoleName.ADMIN]} redirectTo="/home" />
          }
        >
          <Route element={<AdminRoute />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* Fallback: 404 or any unknown → go to the right dashboard by role */}
        <Route path="*" element={<RoleHomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
