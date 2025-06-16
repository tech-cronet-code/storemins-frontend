// StoreDisplaySettingsPage.tsx
import React, { useEffect, useRef, useState } from "react";
import { UserRoleName } from "../../../auth/constants/userRoles";
import Layout from "../../../dashboard/components/Layout";
import GeneralSettings from "../../components/store-appearance/GeneralSettings";
import HeaderSettings from "../../components/store-appearance/HeaderSettings";
import StorePreview from "../../components/store-appearance/StorePreview";

const StoreDisplaySettingsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("general");
  const formContainerRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [generalSettings, setGeneralSettings] = useState({
    font: "Cambria",
    themeColor: "#29A56C",
    borderRadius: "12px",
    addToCart: true,
    buyNow: false,
    showWhatsApp: true,
  });

  const [headerSettings, setHeaderSettings] = useState({
    showAnnouncement: true,
    message: "this is announced bar test it out",
    barColor: "#296fc2",
    fontColor: "#FFFFFF",
  });

  const handleSave = () => {
    console.log("Saved Data:", { generalSettings, headerSettings });
    // TODO: Send to backend
  };

  const handleCancel = () => {
    window.location.reload();
  };

  const renderTab = () => {
    switch (selectedTab) {
      case "general":
        return (
          <>
            <GeneralSettings
              generalSettings={generalSettings}
              onChange={setGeneralSettings}
            />
          </>
        );
      case "header":
        return (
          <HeaderSettings
            headerSettings={headerSettings}
            onChange={setHeaderSettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout role={UserRoleName.SELLER}>
      <div className="flex h-screen w-full bg-[#f9fafb] overflow-hidden">
        {/* Left Settings Panel */}
        <div className="w-[50%] flex flex-col p-6 bg-white border-r border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-300 mb-6 text-sm font-semibold text-gray-700">
            {[
              { label: "General", key: "general" },
              { label: "Header", key: "header" },
              { label: "Home Page", key: "home" },
              { label: "About Us", key: "about" },
              { label: "Terms Of Service", key: "terms" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`relative pb-3 transition-all duration-200 ${
                  selectedTab === tab.key
                    ? "text-blue-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable Form Section */}
          <div
            ref={formContainerRef}
            className="flex-1 overflow-y-auto pr-2 space-y-6 pb-16"
          >
            {renderTab()}

            {/* Action Buttons */}
            <div className="bottom-0 bg-white pt-4 pb-6 flex justify-end gap-4 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-md bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview Panel */}
        <div className="w-[50%] p-6 bg-gradient-to-b from-gray-50 to-white overflow-y-auto shadow-inner rounded-l-lg">
          <StorePreview
            generalSettings={generalSettings}
            headerSettings={headerSettings}
          />
        </div>
      </div>
    </Layout>
  );
};

export default StoreDisplaySettingsPage;
