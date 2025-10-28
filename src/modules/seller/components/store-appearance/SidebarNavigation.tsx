import { Image, LinkIcon, TimerIcon } from "lucide-react";
import { memo } from "react";
import { Link, useLocation } from "react-router-dom";

interface Props {
  storeId?: string;
}

const navItems = [
  { label: "Store Details", path: "store-setting", icon: Image },
  { label: "Store Domain", path: "store-domain", icon: LinkIcon },
  { label: "Store timings", path: "store-timings", icon: TimerIcon },
  { label: "Product Settings", path: "project-settings", icon: LinkIcon },
  { label: "Payment Settings", path: "payment-settings", icon: LinkIcon },
  { label: "Delivery Settings", path: "delivery-settings", icon: LinkIcon },
  {
    label: "Notification Settings",
    path: "notification-settings",
    icon: LinkIcon,
  },
];

const SidebarNavigation: React.FC<Props> = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="hidden lg:block bg-white border border-gray-200 rounded-lg shadow p-4">
      <h2 className="text-sm font-semibold mb-3 text-gray-900">
        Quick Navigation
      </h2>
      <ul className="space-y-1">
        {navItems.map(({ label, path, icon: Icon }) => {
          //  Conditionally define the full path
          const fullPath =
            path === "store-setting"
              ? "/seller/appearance/store-setting"
              : `/seller/appearance/store-setting/${path}`;

          const isActive = currentPath === fullPath;

          return (
            <li key={path}>
              <Link
                to={fullPath}
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
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default memo(SidebarNavigation);
