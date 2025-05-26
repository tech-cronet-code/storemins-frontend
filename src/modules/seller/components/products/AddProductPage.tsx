import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SidebarNavigation from "./SidebarNavigation";
import ProductForm from "./ProductForm";
import { ArrowLeft } from "lucide-react";

const AddProductPage = () => {
  const navigate = useNavigate();
  const formContainerRef = useRef<HTMLDivElement>(null!);

  // Lock page scroll only for this page
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#f9fafb] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[260px] flex-shrink-0 bg-white border-r border-gray-200">
        <div className="sticky top-0 h-screen p-4">
          <SidebarNavigation scrollContainerRef={formContainerRef} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          {/* Left - Back + Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Back"
              className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
            >
              <ArrowLeft size={26} strokeWidth={2} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 leading-none">
              Add new product
            </h1>
          </div>

          {/* Right - CTA Button */}
          <button
            disabled
            className="px-5 py-2.5 rounded-md bg-blue-600 text-white text-sm font-medium shadow-sm transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Product
          </button>
        </div>

        {/* Scrollable Form */}
        <div
          ref={formContainerRef}
          className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth"
        >
          <ProductForm />
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
