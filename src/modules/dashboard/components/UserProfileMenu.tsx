import React, { useEffect, useRef, useState } from "react";
import {
  FaUser,
  FaSignOutAlt,
  FaBell,
  FaCog,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/contexts/AuthContext"; // ✅ adjust path as needed

interface UserProfileMenuProps {
  onClose?: () => void;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ from context

  const [showNotificationOptions, setShowNotificationOptions] = useState(false);
  const [notificationSetting, setNotificationSetting] = useState<
    "allow" | "mute"
  >("allow");
  const notificationRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotificationOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(); // ✅ clears token/user
    navigate("/home"); // ✅ redirect to home/login
    onClose?.(); // ✅ close the dropdown
  };

  return (
    <div className="w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 relative">
      {/* Profile Info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-sm text-gray-800">Noman Mansuri</p>
          <p className="text-xs text-gray-500">noman@storemins.com</p>
        </div>
      </div>

      {/* Menu */}
      <ul className="space-y-2 text-sm">
        {/* My Profile */}
        <li
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
          onClick={() => {
            navigate("/seller/user-settings");
            onClose?.(); // ✅ close menu after navigation
          }}
        >
          <FaUser className="w-4 h-4 text-gray-500" />
          My Profile
        </li>

        {/* Settings */}
        <li className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded-md">
          <div className="flex items-center gap-2">
            <FaCog className="w-4 h-4 text-gray-500" />
            Settings
          </div>
        </li>

        {/* Notifications */}
        <li className="relative" ref={notificationRef}>
          <div
            className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded-md"
            onClick={() => setShowNotificationOptions((prev) => !prev)}
          >
            <div className="flex items-center gap-2">
              <FaBell className="w-4 h-4 text-gray-500" />
              Notification
            </div>
            <FaChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          {showNotificationOptions && (
            <div className="absolute top-2 left-[180px] bg-white border border-gray-200 rounded-xl shadow-md py-1 w-24 z-50">
              <button
                onClick={() => setNotificationSetting("allow")}
                className={`block w-full text-left px-4 py-1 text-sm rounded hover:bg-gray-100 ${
                  notificationSetting === "allow"
                    ? "text-green-600 font-semibold"
                    : "text-gray-700"
                }`}
              >
                Allow
              </button>
              <button
                onClick={() => setNotificationSetting("mute")}
                className={`block w-full text-left px-4 py-1 text-sm rounded hover:bg-gray-100 ${
                  notificationSetting === "mute"
                    ? "text-red-500 font-semibold"
                    : "text-gray-700"
                }`}
              >
                Mute
              </button>
            </div>
          )}
        </li>

        {/* Logout */}
        <li
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="w-4 h-4 text-gray-500" />
          Log Out
        </li>
      </ul>
    </div>
  );
};

export default UserProfileMenu;
