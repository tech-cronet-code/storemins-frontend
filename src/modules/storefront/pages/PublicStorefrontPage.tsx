import { Navigate, Route, Routes, useParams } from "react-router-dom";
import AddToCart from "../../../shared/blocks/Addtocart";
import Payment from "../../../shared/blocks/Payment";
import ProductDetail from "../../../shared/blocks/ProductDetail";
import { RenderLayout, type Block } from "../../../shared/blocks/registry";
import { useGetStorefrontBootstrapQuery } from "../../auth/services/storefrontPublicApi";
import { useCustomerAuth } from "../../customer/context/CustomerAuthContext";
import CustomerAddressesPage from "../../customer/pages/CustomerAddressesPage";
import CustomerProfilePage from "../../customer/pages/CustomerProfilePage";

/** Public API bootstrap response (minimal shape used here) */
type StorefrontBootstrap = {
  layout?: Array<{
    id?: string;
    _id?: string;
    code: string;
    position?: number;
    order?: number;
    settings?: unknown;
    is_active?: number;
    isActive?: boolean;
    active?: boolean;
    enabled?: boolean;
  }>;
  businessStoreId?: string | number;
  businessId?: string | number;
  store?: { businessStoreId?: string | number } | null;
};

export default function PublicStorefrontPage() {
  const { storeSlug = "" } = useParams<{ storeSlug?: string }>();
  const { user: customerUser } = useCustomerAuth();
  // const { userDetails } = useSellerAuth();

  const isLoggedIn =
    !!customerUser?.id ||
    !!(
      (
        typeof window !== "undefined" &&
        (localStorage.getItem("customer_auth_token") || // ← your customer token
          localStorage.getItem("customer_auth_user"))
      ) // ← presence implies logged-in
    );

  const { data, isLoading, isError } = useGetStorefrontBootstrapQuery(
    { slug: storeSlug },
    { skip: !storeSlug }
  );

  console.log(storeSlug, "storeSlug");
  // console.log(data?.settings.bussinessId, "storeSlug - businessId");

  if (!storeSlug) return <div className="p-6">Missing slug.</div>;
  if (isLoading) return <div className="p-6">Loading store…</div>;
  if (isError)
    return <div className="p-6 text-red-600">Failed to load storefront.</div>;
  if (!data) return <div className="p-6">No data.</div>;

  const api = data as StorefrontBootstrap;

  // Normalize to the Block[] shape expected by RenderLayout
  const layout: Block[] = (api.layout ?? []).map((b) => ({
    id: b.id ?? b._id ?? undefined,
    code: b.code,
    position: typeof b.position === "number" ? b.position : b.order ?? 0,
    settings: b.settings ?? {},
    is_active:
      b.is_active ??
      (typeof b.isActive === "boolean" ? (b.isActive ? 1 : 0) : undefined) ??
      (typeof b.active === "boolean" ? (b.active ? 1 : 0) : undefined) ??
      (typeof b.enabled === "boolean" ? (b.enabled ? 1 : 0) : undefined) ??
      1,
  }));

  // const businessIdFromAuth: string =
  //   userDetails?.storeLinks?.[0]?.businessId ?? "";

  // const businessId: string =
  //   businessIdFromAuth ||
  //   String(
  //     api.businessStoreId ?? api.businessId ?? api.store?.businessStoreId ?? ""
  //   );

  const businessId: string = data?.settings.bussinessId;
  console.log(businessId, "storeSlug - businessId");

  return (
    <div className="min-h-dvh">
      <main className="p-4">
        <Routes>
          {/* storefront home: /{storeSlug} */}
          <Route
            index
            element={<RenderLayout layout={layout} businessId={businessId} />}
          />

          {/* product details: /{storeSlug}/p/:productSlug */}
          <Route path="p/:productSlug" element={<ProductDetail />} />

          {/* Cart/Checkout/Payment within the slug */}
          <Route path="cart" element={<AddToCart />} />
          <Route path="checkout" element={<AddToCart />} />
          <Route path="payment" element={<Payment />} />

          {/* Profile within the slug (auth-guarded here) */}
          <Route
            path="profile"
            element={
              isLoggedIn ? (
                <CustomerProfilePage />
              ) : (
                <Navigate to="/home" replace />
              )
            }
          />
          <Route
            path="profile/addresses"
            element={
              isLoggedIn ? (
                <CustomerAddressesPage />
              ) : (
                <Navigate to="/home" replace />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}
