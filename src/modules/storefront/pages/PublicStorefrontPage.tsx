import { useParams } from "react-router-dom";
import { RenderLayout } from "../../../shared/blocks/registry";
import { useGetStorefrontBootstrapQuery } from "../../auth/services/storefrontPublicApi";
import { StorefrontLayoutItemDto } from "../../auth/services/storeApi";
import { useAuth } from "../../auth/contexts/AuthContext";

export default function PublicStorefrontPage() {
  const { slug = "" } = useParams<{ slug?: string }>();
  const { userDetails } = useAuth();
  const businessIdFromAuth = userDetails?.storeLinks?.[0]?.businessId ?? "";

  const { data, isLoading, isError } = useGetStorefrontBootstrapQuery(
    { slug },
    { skip: !slug }
  );

  if (!slug) return <div className="p-6">Missing slug.</div>;
  if (isLoading) return <div className="p-6">Loading store…</div>;
  if (isError)
    return <div className="p-6 text-red-600">Failed to load storefront.</div>;
  if (!data) return <div className="p-6">No data.</div>;

  const layout: StorefrontLayoutItemDto[] = data.layout || [];

  // Prefer the id from auth; fall back to anything the bootstrap might expose.
  const businessId =
    businessIdFromAuth ||
    String(
      (data as any)?.businessStoreId ??
        (data as any)?.businessId ??
        (data as any)?.store?.businessStoreId ??
        ""
    );

  return (
    <div className="min-h-dvh">
      <main className="p-4">
        <RenderLayout layout={layout} businessId={businessId} />
      </main>
    </div>
  );
}
