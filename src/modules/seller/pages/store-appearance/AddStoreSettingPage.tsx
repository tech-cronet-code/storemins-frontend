import { ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { UserRoleName } from "../../../auth/constants/userRoles";
import Layout from "../../../dashboard/components/Layout";
import SidebarNavigation from "../../components/store-appearance/SidebarNavigation";

// Section Components
import StoreSettingDomainForm from "../../components/store-appearance/StoreSettingDomainForm";
import StoreSettingForm from "../../components/store-appearance/StoreSettingForm";
import StoreTimingsSection from "../../components/store-appearance/StoreTimingsSection";

interface AddStoreSettingPageProps {
  section: string;
}

const AddStoreSettingPage: React.FC<AddStoreSettingPageProps> = ({
  section,
}) => {
  const navigate = useNavigate();
  const formContainerRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const getTitle = () => {
    switch (section) {
      case "store-setting":
        return "Store Details";
      case "store-domain":
        return "Store Domain";
      case "store-timings":
        return "Store Timings";
      case "seo":
        return "Store SEO";
      case "social-links":
        return "Social Media Links";
      default:
        return "Store Settings";
    }
  };

  return (
    <Layout role={UserRoleName.SELLER}>
      <div className="flex h-screen w-full bg-[#f9fafb] overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[260px] flex-shrink-0 bg-white border-r border-gray-200">
          <div className="sticky top-0 h-screen p-4">
            <SidebarNavigation />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex flex-col flex-1 h-screen overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                aria-label="Back"
                className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
              >
                <ArrowLeft size={24} strokeWidth={2} />
              </button>
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 leading-none">
                {getTitle()}
              </h1>
            </div>
          </div>

          {/* Scrollable Section Content */}
          <div
            ref={formContainerRef}
            className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth"
          >
            {section === "store-setting" && <StoreSettingForm />}
            {section === "store-domain" && <StoreSettingDomainForm />}
            {section === "store-timings" && <StoreTimingsSection />}
            {/* {section === "social-links" && <SocialLinksSection />} */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddStoreSettingPage;
