import React, { useMemo } from "react";
import { mergeAnnBarFromUI } from "../../../../shared/blocks/announcementBar";
import { RenderLayout } from "../../../../shared/blocks/registry";

interface StorePreviewProps {
  generalSettings: any;
  headerSettings: any; // your UI state for the editor
  runtimeLayout?: any[]; // storefront?.layout from API
}

/** Editor preview that renders the SAME block components as public storefront,
 *  but overlays the current form (headerSettings) on top of runtime layout. */
const StorePreview: React.FC<StorePreviewProps> = ({
  generalSettings,
  headerSettings,
  runtimeLayout = [],
}) => {
  // Overlay the announcement bar block settings with UI state while editing
  const previewLayout = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (runtimeLayout || []).map((b: any) => {
      if (b?.code !== "announcement_bar") return b;
      return {
        ...b,
        settings: mergeAnnBarFromUI(b.settings, headerSettings),
      };
    });
  }, [runtimeLayout, headerSettings]);

  return (
    <div
      className="rounded shadow bg-white text-sm"
      style={{ fontFamily: generalSettings.font }}
    >
      {/* same renderer used by public site */}
      <RenderLayout layout={previewLayout} />

      {/* You can keep your product demo below if you like */}
      <div className="p-4 space-y-4">
        <div className="p-4 border rounded">
          <div className="text-md font-semibold mb-2">Product Name</div>
          <div className="text-gray-600 mb-2">₹999</div>
          <div className="flex gap-2 flex-wrap">
            {generalSettings.addToCart && (
              <button
                className="px-4 py-2 text-white"
                style={{
                  backgroundColor: generalSettings.themeColor,
                  borderRadius: generalSettings.borderRadius,
                }}
              >
                Add to Cart
              </button>
            )}
            {generalSettings.buyNow && (
              <button
                className="px-4 py-2 text-white"
                style={{
                  backgroundColor: generalSettings.themeColor,
                  borderRadius: generalSettings.borderRadius,
                }}
              >
                Buy Now
              </button>
            )}
            {generalSettings.showWhatsApp && (
              <button
                className="p-2 bg-green-500 text-white"
                style={{ borderRadius: generalSettings.borderRadius }}
              >
                WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePreview;
