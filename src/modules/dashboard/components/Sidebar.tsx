import {
  BarChart2,
  Box,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  CreditCard,
  FileText,
  Gem,
  Grid,
  Home,
  Layout,
  Percent,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserRoleName } from "../../auth/constants/userRoles";
import { BiPurchaseTag } from "react-icons/bi";

interface SidebarProps {
  role: UserRoleName;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const menuItems = [
  { label: "Dashboard", icon: <Home />, path: "/seller", active: true },
  {
    label: "Orders",
    icon: <ShoppingCart />,
    path: "/seller/orders",
    active: false,
    hasChildren: true,
    children: [
      {
        label: "All Orders",
        path: "/seller/orders",
        icon: <Box size={16} />,
      },
      {
        label: "Purchase",
        path: "/seller/purchases",
        icon: <BiPurchaseTag size={16} />,
      },
      {
        label: "Estimates",
        path: "/seller/estimates",
        icon: <Truck size={16} />,
      },
      {
        label: "Abandoned Orders",
        path: "/seller/abandoned-orders-cart",
        icon: <BiPurchaseTag size={16} />,
      },
    ],
  },
  {
    label: "Catelogs",
    icon: <Box />,
    path: "/products",
    whiteDot: false,
    active: false,
    hasChildren: true,
    children: [
      {
        label: "Physical Products",
        path: "/seller/catalogue/products/physical",
        icon: <Box size={16} />,
      },
      {
        label: "Digital Products",
        path: "/seller/catalogue/products/digital",

        icon: <Box size={16} />,
      },
      {
        label: "Meeting Products",
        path: "/seller/catalogue/products/meeting",
        icon: <Box size={16} />,
      },
      {
        label: "Workshop Products",
        path: "/seller/catalogue/products/workshop",
        icon: <Box size={16} />,
      },
      {
        label: "Categories",
        path: "/seller/catalogue/categories",
        icon: <Grid size={16} />,
      },
      {
        label: "Inventory",
        path: "/seller/catalogue/inventory",
        icon: <Truck size={16} />,
      },
    ],
  },
  {
    label: "Analytics & Reports",
    icon: <BarChart2 />,
    path: "/analytics",
    whiteDot: false,
    active: false,
  },
  { label: "Invoices", icon: <FileText />, path: "/invoices", active: false },
  {
    label: "Reviews",
    icon: <FileText />,
    path: "/reviews",
    redDot: 1,
    active: false,
  },
  {
    label: "Store Appearance",
    icon: <Layout />,
    path: "/seller/appearance/store-setting/media", // default or first child route
    whiteDot: false,
    hasChildren: true,
    active: false,
    children: [
      { label: "Store Setting", path: "/seller/appearance/store-setting" },
      { label: "Dispaly Setting", path: "/seller/appearance/display-setting" },
      { label: "Themes", path: "/seller/appearance/themes" },
      { label: "Store Blog", path: "/seller/appearance/store-blog" },
      { label: "Store Pages", path: "/seller/appearance/store-page" },
    ],
  },
  { label: "Delivery", icon: <Truck />, path: "/delivery", active: false },
  { label: "Customers", icon: <Users />, path: "/customers", active: false },
  {
    label: "App Store",
    icon: <Grid />,
    path: "/apps",
    redDot: 1,
    whiteDot: false,
    hasChildren: true,
    active: false,
    children: [
      { label: "Integrations", path: "/apps/integrations" },
      { label: "Plugins", path: "/apps/plugins" },
    ],
  },
  {
    label: "Promotions",
    icon: <Percent />,
    path: "/promotions",
    active: false,
  },
  {
    label: "Payments",
    icon: <CreditCard />,
    path: "/payments",
    redDot: 1,
    active: false,
  },
  {
    label: "Settings",
    icon: <Settings />,
    path: "/settings",
    redDot: 1,
    whiteDot: false,
    hasChildren: true,
    active: false,
    children: [
      { label: "Profile", path: "/settings/profile" },
      {
        label: "Security",
        path: "/settings/security",
        hasChildren: true,
        children: [
          {
            label: "Change Password",
            path: "/settings/security/change-password",
          },
          { label: "2FA", path: "/settings/security/2fa" },
        ],
      },
    ],
  },
];

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [hasMounted, setHasMounted] = useState(false);

  // Only collapse once on first mount if screen is small
  useEffect(() => {
    const handleResize = () => {
      if (!hasMounted) {
        setCollapsed(window.innerWidth < 768);
        setHasMounted(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [hasMounted, setCollapsed]);

  // Expand menu based on active route
  useEffect(() => {
    const newExpanded: Record<string, boolean> = {};

    menuItems.forEach((item) => {
      if (item.hasChildren) {
        const isChildActive = item.children?.some(
          (child: any) =>
            location.pathname === child.path ||
            location.pathname.startsWith(child.path)
        );
        if (isChildActive) {
          newExpanded[item.label] = true;
        }

        item.children?.forEach((sub: any) => {
          if (sub.hasChildren) {
            const isNestedChildActive = sub.children?.some(
              (nested: any) =>
                location.pathname === nested.path ||
                location.pathname.startsWith(nested.path)
            );
            if (isNestedChildActive) {
              newExpanded[item.label] = true;
              newExpanded[`${item.label}-${sub.label}`] = true;
            }
          }
        });
      }
    });

    setExpanded((prev) => ({ ...prev, ...newExpanded }));
  }, [location.pathname]);

  const toggleExpand = (label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleSidebarToggle = () => {
    setCollapsed(!collapsed);
  };

  const renderChildren = (children: any[], parentLabel: string) => (
    <ul className={`${collapsed ? "hidden" : "pl-8"} mt-1 space-y-1`}>
      {children.map((sub) => (
        <li key={sub.path || sub.label}>
          {sub.hasChildren ? (
            <>
              <div
                onClick={() => toggleExpand(`${parentLabel}-${sub.label}`)}
                className="flex items-center justify-between cursor-pointer text-white/80 hover:text-white text-sm py-1"
              >
                <div className="flex items-center gap-2">
                  {sub.icon}
                  <span>{sub.label}</span>
                </div>
                <ChevronDown size={14} />
              </div>
              {expanded[`${parentLabel}-${sub.label}`] &&
                renderChildren(sub.children, `${parentLabel}-${sub.label}`)}
            </>
          ) : (
            <Link
              to={sub.path}
              className={`flex items-center gap-2 py-1 text-sm ${
                location.pathname === sub.path
                  ? "text-white font-semibold"
                  : "text-white/80 hover:text-white"
              } pl-3`}
              title={collapsed ? sub.label : ""}
            >
              {sub.icon}
              {!collapsed && sub.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  const sidebarClasses = `
    bg-[#1e293b] text-white fixed top-0 left-0 h-screen
    flex flex-col z-50 transition-all duration-300 ease-in-out
    ${collapsed ? "w-[72px]" : "w-64"}
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="flex items-center justify-between mb-4 px-2 pt-2">
        <div className="flex items-center gap-2">
          <img
            src="/logo-icon.png"
            alt="StoreMins"
            className="w-8 h-8 rounded-full bg-white"
          />
          {!collapsed && (
            <h2 className="text-xl font-bold tracking-wide">StoreMins</h2>
          )}
        </div>
        <button
          onClick={handleSidebarToggle}
          className="text-white p-1 hover:bg-[#334155] rounded"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto px-1"
        style={{ scrollbarWidth: "none" }}
      >
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              item.children?.some((child: any) =>
                location.pathname.startsWith(child.path)
              );

            return (
              <li key={item.path}>
                <div
                  onClick={() => {
                    if (item.hasChildren) {
                      toggleExpand(item.label);
                      const firstChild = item.children?.[0];
                      if (firstChild?.path) {
                        navigate(firstChild.path);
                      }
                    } else if (item.path) {
                      navigate(item.path);
                    }
                  }}
                  className={`flex items-center justify-between ${
                    collapsed ? "p-2" : "px-3 py-2"
                  } rounded-lg transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "mt-1 bg-[#1E40AF] bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white font-semibold shadow-[0_4px_10px_rgba(139,92,246,0.3)] rounded-xl ring-1 ring-white/20 border border-indigo-500"
                      : "hover:bg-[#334155] text-white/80"
                  }`}
                  title={collapsed ? item.label : ""}
                >
                  <div
                    className={`flex items-center ${
                      collapsed ? "justify-center w-full" : "gap-3"
                    }`}
                  >
                    <div
                      className={`${isActive ? "text-white" : "text-white/70"}`}
                    >
                      {React.cloneElement(item.icon, {
                        size: collapsed ? 22 : 18,
                      })}
                    </div>
                    {!collapsed && (
                      <span className="text-sm tracking-wide">
                        {item.label}
                      </span>
                    )}
                  </div>

                  {!collapsed && (
                    <div className="flex gap-1 items-center">
                      {item.redDot && (
                        <span className="bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                          {item.redDot}
                        </span>
                      )}
                      {item.whiteDot && (
                        <Circle size={8} className="text-white" fill="white" />
                      )}
                      {item.hasChildren &&
                        (expanded[item.label] ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        ))}
                    </div>
                  )}
                </div>

                {item.hasChildren &&
                  expanded[item.label] &&
                  renderChildren(item.children, item.label)}
              </li>
            );
          })}
        </ul>
      </div>

      {!collapsed && (
        <div className="mx-auto mt-4 mb-4 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] px-3 py-3 text-white shadow-md rounded-t-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Gem size={18} className="text-pink-400 drop-shadow-sm" />
                <div>
                  <p className="text-sm font-bold text-white">Upgrade plan</p>
                  <p className="text-xs text-white/60">Get extra benefits</p>
                </div>
              </div>
              <button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-medium px-3 py-1 rounded-md shadow-md hover:brightness-110 transition">
                Upgrade
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#1f2937] to-[#374151] px-3 py-2 flex items-center gap-3 rounded-b-xl">
            <Wallet size={16} className="text-teal-300" />
            <div>
              <p className="text-xs text-white/70 leading-tight">
                Storemins Credits
              </p>
              <p className="text-base font-extrabold text-white">10</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
