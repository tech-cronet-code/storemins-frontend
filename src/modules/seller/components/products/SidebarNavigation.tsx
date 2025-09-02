import React, { useEffect, useMemo, useRef, useState, memo } from "react";
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

type ProductType = "PHYSICAL" | "DIGITAL" | "MEETING" | "WORKSHOP";

interface Props {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  productType?: ProductType; // default: PHYSICAL
}

const ALL_ITEMS = [
  { label: "Product Media", id: "product-media", icon: Image },
  { label: "Product Information", id: "product-info", icon: Info },
  { label: "Digital Asset", id: "digital-asset", icon: Truck },
  { label: "Inventory", id: "inventory", icon: Package },
  { label: "Shipping & Tax", id: "shipping-tax", icon: Truck },
  { label: "Variants", id: "variants", icon: Layers },
  { label: "Product SEO", id: "seo", icon: Search },
  { label: "Product Flags", id: "product-flags", icon: Search },
  { label: "Customer Questions", id: "product-questions", icon: Search },
  {
    label: "Customer Post Purchase Note",
    id: "post-purchase-note",
    icon: Search,
  },
  {
    label: "Additional Product Fields",
    id: "additional-fields",
    icon: Settings,
  },
];

const HIDE_BY_TYPE: Record<ProductType, Set<string>> = {
  DIGITAL: new Set(["shipping-tax", "variants"]),
  PHYSICAL: new Set(["digital-asset"]),
  MEETING: new Set(["shipping-tax", "variants", "digital-asset"]),
  WORKSHOP: new Set(["shipping-tax", "variants", "digital-asset"]),
};

const SidebarNavigation: React.FC<Props> = ({
  scrollContainerRef,
  productType = "PHYSICAL",
}) => {
  const visibleItems = useMemo(
    () => ALL_ITEMS.filter((i) => !HIDE_BY_TYPE[productType].has(i.id)),
    [productType]
  );

  const [activeSection, setActiveSection] = useState<string>(
    visibleItems[0]?.id ?? "product-info"
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Resolve the container element (wait until it exists)
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    let raf = 0;
    const waitForContainer = () => {
      if (scrollContainerRef.current) {
        setContainerEl(scrollContainerRef.current);
      } else {
        raf = requestAnimationFrame(waitForContainer);
      }
    };
    waitForContainer();
    return () => cancelAnimationFrame(raf);
  }, [scrollContainerRef]);

  // Smooth scroll behaviour safeguard
  useEffect(() => {
    if (!containerEl) return;
    const prev = containerEl.style.scrollBehavior;
    containerEl.style.scrollBehavior = "smooth";
    return () => {
      containerEl.style.scrollBehavior = prev;
    };
  }, [containerEl]);

  // Robust scroll-to using scrollIntoView (respects scroll-margin-top)
  const scrollToSection = (id: string) => {
    if (id === "additional-fields") {
      setIsDrawerOpen(true);
      setActiveSection(id);
      return;
    }
    const container = containerEl ?? scrollContainerRef.current;
    const target = container?.querySelector<HTMLElement>(`#${id}`);
    if (!container || !target) return;

    const before = container.scrollTop;
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    // Fallback for older browsers
    setTimeout(() => {
      if (container.scrollTop === before) {
        const delta =
          target.getBoundingClientRect().top -
          container.getBoundingClientRect().top;
        container.scrollTo({
          top: container.scrollTop + delta - 8,
          behavior: "smooth",
        });
      }
    }, 0);

    setActiveSection(id);
  };

  // Reset active if visible list changes
  useEffect(() => {
    setActiveSection(visibleItems[0]?.id ?? "product-info");
  }, [visibleItems]);

  // Observe sections; re-attach whenever content appears/changes
  const ioRef = useRef<IntersectionObserver | null>(null);
  const moRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const root = containerEl;
    if (!root) return;

    const attachIO = () => {
      ioRef.current?.disconnect();
      const io = new IntersectionObserver(
        (entries) => {
          const e = entries.find((x) => x.isIntersecting);
          if (e?.target?.id && e.target.id !== "additional-fields") {
            setActiveSection(e.target.id);
          }
        },
        { root, rootMargin: "0px 0px -70% 0px", threshold: 0.1 }
      );
      ioRef.current = io;

      visibleItems
        .filter((i) => i.id !== "additional-fields")
        .forEach((i) => {
          const el = root.querySelector(`#${i.id}`);
          if (el) io.observe(el);
        });
    };

    attachIO();

    // MutationObserver to re-attach when sections mount later
    moRef.current?.disconnect();
    const mo = new MutationObserver(() => attachIO());
    mo.observe(root, { childList: true, subtree: true });
    moRef.current = mo;

    return () => {
      ioRef.current?.disconnect();
      moRef.current?.disconnect();
    };
  }, [containerEl, visibleItems]);

  return (
    <>
      <div className="hidden lg:block bg-white border border-gray-200 rounded-lg shadow p-4">
        <h2 className="text-sm font-semibold mb-3 text-gray-900">
          Quick Navigation
        </h2>
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md w-full text-left transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
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

export default memo(SidebarNavigation);
