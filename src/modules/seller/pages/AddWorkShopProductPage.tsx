// src/modules/seller/pages/AddProductPage.tsx
import { ArrowLeft } from "lucide-react";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserRoleName } from "../../auth/constants/userRoles";
import Layout from "../../dashboard/components/Layout";
import SidebarNavigation from "../components/products/SidebarNavigation";
import MeetingProductForm from "../components/products/MeetingProductForm";

const AddWorkShopProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const formContainerRef = useRef<HTMLDivElement>(null!);

  return (
    <Layout role={UserRoleName.SELLER} hideFooter>
      {" "}
      {/*  ONLY THIS PAGE */}
      <div className="flex min-h-screen w-full bg-[#f9fafb] overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[260px] flex-shrink-0 bg-white border-r border-gray-200">
          <div className="sticky top-0 h-screen p-4">
            <SidebarNavigation
              scrollContainerRef={formContainerRef}
              productType="MEETING"
            />
          </div>
        </aside>

        {/* Main */}
        <div className="flex flex-col flex-1 min-h-screen overflow-hidden">
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
                {id ? "Edit digital product" : "Add new digital product"}
              </h1>
            </div>
          </div>

          {/* Scrollable Form */}
          <div
            ref={formContainerRef}
            className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth"
          >
            <MeetingProductForm productId={id} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddWorkShopProductPage;
