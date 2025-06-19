// StorePreview.tsx
import React from "react";

interface StorePreviewProps {
  generalSettings: any;
  headerSettings: any;
}

const StorePreview: React.FC<StorePreviewProps> = ({
  generalSettings,
  headerSettings,
}) => {
  return (
    <div
      className="rounded shadow bg-white text-sm"
      style={{ fontFamily: generalSettings.font }}
    >
      {/* Announcement Bar */}
      {headerSettings.showAnnouncement && (
        <div
          className="text-center py-2 text-sm"
          style={{
            backgroundColor: headerSettings.barColor,
            color: headerSettings.fontColor,
          }}
        >
          {headerSettings.message}
        </div>
      )}

      {/* Product Preview */}
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
                className="px-4 py-2 bg-black text-white"
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
