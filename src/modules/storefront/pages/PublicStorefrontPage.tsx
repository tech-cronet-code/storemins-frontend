// modules/storefront/pages/PublicStorefrontPage.tsx
import { Route, Routes, useParams } from "react-router-dom";
import { RenderLayout, type Block } from "../../../shared/blocks/registry";
import { useAuth } from "../../auth/contexts/AuthContext";
import { useGetStorefrontBootstrapQuery } from "../../auth/services/storefrontPublicApi";
import ProductDetail from "../../../shared/blocks/ProductDetail";
import AddToCart from "../../../shared/blocks/Addtocart";

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
  const { userDetails } = useAuth();

  const businessIdFromAuth: string =
    userDetails?.storeLinks?.[0]?.businessId ?? "";

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

  const businessId: string =
    businessIdFromAuth ||
    String(
      api.businessStoreId ?? api.businessId ?? api.store?.businessStoreId ?? ""
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

          {/* NEW: add-to-cart style page routes */}
          {/* /{storeSlug}/cart */}
          <Route path="cart" element={<AddToCart />} />
          {/* /{storeSlug}/checkout */}
          <Route path="checkout" element={<AddToCart />} />
        </Routes>
      </main>
    </div>
  );
}
