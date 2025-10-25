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
  settings?: { bussinessId?: string | number };
};

function toSettingsObject(v: unknown): Record<string, unknown> {
  if (v && typeof v === "object") return v as Record<string, unknown>;
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

export default function PublicStorefrontPage() {
  const { storeSlug = "" } = useParams<{ storeSlug?: string }>();
  const { user: customerUser } = useCustomerAuth();

  const isLoggedIn =
    !!customerUser?.id ||
    !!(
      typeof window !== "undefined" &&
      (localStorage.getItem("customer_auth_token") ||
        localStorage.getItem("customer_auth_user"))
    );

  const { data, isLoading, isError } = useGetStorefrontBootstrapQuery(
    { slug: storeSlug },
    { skip: !storeSlug }
  );

  if (!storeSlug) return <div className="p-6">Missing slug.</div>;
  if (isLoading) return <div className="p-6">Loading store…</div>;
  if (isError)
    return <div className="p-6 text-red-600">Failed to load storefront.</div>;
  if (!data) return <div className="p-6">No data.</div>;

  const api = data as StorefrontBootstrap;

  // Normalize to the Block[] shape expected by RenderLayout
  const layout: Block[] = (api.layout ?? [])
    .map((b) => {
      const settings = toSettingsObject(b.settings);
      const isActive =
        b.is_active ??
        (typeof b.isActive === "boolean" ? (b.isActive ? 1 : 0) : undefined) ??
        (typeof b.active === "boolean" ? (b.active ? 1 : 0) : undefined) ??
        (typeof b.enabled === "boolean" ? (b.enabled ? 1 : 0) : undefined) ??
        1;

      return {
        id: b.id ?? b._id ?? undefined,
        code: b.code,
        position:
          typeof b.position === "number"
            ? b.position
            : typeof b.order === "number"
            ? b.order
            : 0,
        settings,
        is_active: isActive,
      };
    })
    .sort((a, b) => a.position - b.position);

  // businessId used by RenderLayout
  const businessId: string = String(
    (data as any)?.settings?.bussinessId ??
      api.businessStoreId ??
      api.businessId ??
      api.store?.businessStoreId ??
      ""
  );

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
