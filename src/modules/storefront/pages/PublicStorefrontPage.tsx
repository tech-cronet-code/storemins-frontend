import { useParams } from "react-router-dom";
import {
  RenderLayout,
  StorefrontLayoutItemDto,
} from "../../../shared/blocks/registry";
import { useGetStorefrontBootstrapQuery } from "../../auth/services/storefrontPublicApi";

export default function PublicStorefrontPage() {
  // Keep slug optional in the params typing (router v6 friendly)
  const { slug = "" } = useParams<{ slug?: string }>();

  const { data, isLoading, isError } = useGetStorefrontBootstrapQuery(
    { slug },
    { skip: !slug }
  );

  if (!slug) return <div className="p-6">Missing slug.</div>;
  if (isLoading) return <div className="p-6">Loading store…</div>;
  if (isError)
    return <div className="p-6 text-red-600">Failed to load storefront.</div>;
  if (!data) return <div className="p-6">No data.</div>;

  const settings = data.settings || {};
  const layout: StorefrontLayoutItemDto[] = data.layout || [];

  return (
    <div className="min-h-dvh">
      <header className="p-4 flex items-center gap-3 border-b">
        {settings.logoUrl && (
          <img
            src={settings.logoUrl}
            alt="logo"
            className="h-10 w-10 object-contain"
          />
        )}
        <div className="font-semibold text-lg">
          {settings.storeName || slug}
        </div>
      </header>

      <main className="p-4">
        <RenderLayout layout={layout} />
      </main>
    </div>
  );
}
