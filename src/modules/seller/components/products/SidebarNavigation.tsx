import React, { useEffect, useState, memo } from "react"; // <-- memo imported
import {
  Info,
  Image,
  Package,
  Truck,
  Layers,
  Search,
  Settings,
} from "lucide-react";
import ProductSettingsDrawer from "../ProductSettingsDrawer";
import UpgradeToBusinessPlanModal from "../UpgradeToBusinessPlanModal";

interface Props {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

const navItems = [
  { label: "Product Information", id: "product-info", icon: Info },
  { label: "Product Media", id: "product-media", icon: Image },
  { label: "Inventory", id: "inventory", icon: Package },
  { label: "Shipping & Tax", id: "shipping-tax", icon: Truck },
  { label: "Variants", id: "variants", icon: Layers },
  { label: "Product SEO", id: "seo", icon: Search },
  {
    label: "Additional Product Fields",
    id: "additional-fields",
    icon: Settings,
  },
];

const SidebarNavigation: React.FC<Props> = ({ scrollContainerRef }) => {
  const [activeSection, setActiveSection] = useState<string>("product-info");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const scrollToSection = (id: string) => {
    if (id === "additional-fields") {
      setIsDrawerOpen(true);
      setActiveSection(id);
      return;
    }

    const container = scrollContainerRef.current;
    const target = container?.querySelector(`#${id}`);
    if (container && target) {
      const containerTop = container.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      const scrollOffset = targetTop - containerTop + container.scrollTop - 20;
      container.scrollTo({ top: scrollOffset, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target?.id && visible.target.id !== "additional-fields") {
          setActiveSection(visible.target.id);
        }
      },
      {
        root: container,
        rootMargin: "0px 0px -70% 0px",
        threshold: 0.1,
      }
    );

    const validSections = navItems
      .filter((item) => item.id !== "additional-fields")
      .map((item) => container.querySelector(`#${item.id}`))
      .filter(Boolean) as Element[];

    validSections.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []); // <-- IMPORTANT: EMPTY dependency array

  return (
    <>
      <div className="hidden lg:block bg-white border border-gray-200 rounded-lg shadow p-4">
        <h2 className="text-sm font-semibold mb-3 text-gray-900">
          Quick Navigation
        </h2>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md w-full text-left transition-all
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Drawer */}
      <ProductSettingsDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onCheckoutFieldSelect={() => setShowUpgradeModal(true)}
      />

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30">
          <UpgradeToBusinessPlanModal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            onViewPlans={() => {
              setShowUpgradeModal(false);
              alert("Redirecting to business plans...");
            }}
          />
        </div>
      )}
    </>
  );
};

export default memo(SidebarNavigation); // ✅ MEMO WRAP
