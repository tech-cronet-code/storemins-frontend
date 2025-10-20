import { HelpCircle, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdNotificationsNone } from "react-icons/md";
import { RiSettings3Fill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import UserProfileMenu from "./UserProfileMenu";
import { convertPath } from "../../auth/utils/useImagePath";
import { useSellerAuth } from "../../auth/contexts/SellerAuthContext";

interface HeaderProps {
  collapsed?: boolean;
  setCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line no-empty-pattern
const Header = ({}: HeaderProps) => {
  const [isOnline, setIsOnline] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [imageError, setImageError] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { userDetails } = useSellerAuth(); // ⬅️ from context (has top-level imageId: "<fileId>.webp")

  const location = useLocation();
  const navigate = useNavigate();

  const [titleInfo, setTitleInfo] = useState({
    label: "Dashboard",
    hasChildren: false,
    path: "/seller",
  });

  // Update title info based on route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/appearance")) {
      setTitleInfo({
        label: "Store Appearance",
        hasChildren: true,
        path: "/appearance",
      });
    } else if (path.includes("/apps")) {
      setTitleInfo({ label: "App Store", hasChildren: true, path: "/apps" });
    } else if (path.includes("/user-settings")) {
      setTitleInfo({
        label: "User Settings",
        hasChildren: false,
        path: "/seller/user-settings",
      });
    } else if (path.includes("/products")) {
      setTitleInfo({
        label: "Products",
        hasChildren: false,
        path: "/products",
      });
    } else if (path.includes("/catalogue/categories")) {
      setTitleInfo({
        label: "Categories",
        hasChildren: false,
        path: "/categories",
      });
    } else if (path.includes("/catalogue/inventory")) {
      setTitleInfo({
        label: "Inventory",
        hasChildren: false,
        path: "/inventory",
      });
    } else if (path.includes("/orders")) {
      setTitleInfo({ label: "Orders", hasChildren: false, path: "/orders" });
    } else {
      setTitleInfo({ label: "Dashboard", hasChildren: false, path: "/seller" });
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  //  Build image URLs from top-level imageId ("<fileId>.webp")
  // const serverDiskName = userDetails?.image ?? undefined; // already includes .webp
  // const fullImageUrls = serverDiskName
  //   ? getImageUrlsById(serverDiskName)
  //   : null;
  // const avatarSrc = !imageError
  //   ? fullImageUrls?.original ||
  //     "https://randomuser.me/api/portraits/men/32.jpg"
  //   : undefined;

  const serverImageDiskName = userDetails?.image ?? undefined; // already has .webp
  const serverThumbUrl = serverImageDiskName
    ? convertPath(serverImageDiskName, "original/auth")
    : undefined;

  const avatarSrc =
    serverThumbUrl || "https://randomuser.me/api/portraits/men/32.jpg"; // fallback handled by onError UI

  return (
    <header className="bg-white px-4 py-2 shadow top-0 z-[999] w-full relative">
      <div className="flex items-center justify-between gap-4 w-full overflow-visible">
        {/* Dynamic Title - Clickable only if it doesn't have children */}
        <div
          className={`text-base md:text-lg lg:text-xl font-semibold text-[#1F2B6C] whitespace-nowrap ${
            titleInfo.hasChildren ? "cursor-default" : "cursor-pointer"
          }`}
          onClick={() => {
            if (!titleInfo.hasChildren && titleInfo.path)
              navigate(titleInfo.path);
          }}
        >
          {titleInfo.label}
        </div>

        {/* Search */}
        <div className="relative flex-grow min-w-0 max-w-[400px] hidden sm:block">
          <input
            type="text"
            placeholder="Search for something"
            className="pl-10 pr-4 py-2 w-full rounded-full bg-[#F6F8FC] text-sm placeholder-gray-500 text-gray-700 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className="flex items-center gap-2 px-3 py-[6px] border border-gray-200 rounded-full bg-white shadow-sm transition hover:shadow-md"
          >
            <span className="text-sm font-medium text-black">
              {isOnline ? "Online" : "Offline"}
            </span>
            <span
              className={`w-5 h-5 rounded-full ${
                isOnline ? "bg-green-600" : "bg-red-500"
              }`}
            />
          </button>

          <div className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer hover:text-black">
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Help</span>
          </div>

          <div className="h-5 w-px bg-gray-300" />

          <RiSettings3Fill className="w-6 h-6 text-gray-500 cursor-pointer hover:text-indigo-600" />

          <div className="relative cursor-pointer">
            <MdNotificationsNone className="w-6 h-6 text-pink-500 hover:text-pink-600" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white animate-ping" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
          </div>

          <div className="relative" ref={profileRef}>
            {!imageError && avatarSrc ? (
              <img
                src={avatarSrc}
                alt="User"
                className="w-9 h-9 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-400"
                onClick={() => setShowProfile((prev) => !prev)}
                onError={() => setImageError(true)}
              />
            ) : (
              <FaUserCircle
                className="w-9 h-9 text-gray-400 hover:text-blue-500 cursor-pointer"
                onClick={() => setShowProfile((prev) => !prev)}
              />
            )}
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 z-[9999]">
                <UserProfileMenu onClose={() => setShowProfile(false)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
