// src/components/CustomerHeader.tsx
import React, { useState } from "react";
import { FiSearch, FiMail } from "react-icons/fi";
import { FaRegUserCircle, FaWhatsapp } from "react-icons/fa";
import { HiOutlineMenu, HiOutlineLocationMarker } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import CustomerSidebar from "./CustomerSidebar";
import SignInUpModal from "./SignInUpModal";

const IconBtn: React.FC<{
  onClick?: () => void;
  ariaLabel?: string;
}> = ({ children, onClick, ariaLabel }) => (
  <button
    aria-label={ariaLabel}
    onClick={onClick}
    className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
  >
    {children}
  </button>
);

const CustomerHeader: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const goHome = () => {
    if (location.pathname.replace(/\/+$/, "") === "/customer") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/customer");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto flex items-center h-20 px-6">
          {/* Logo */}
          <div
            onClick={goHome}
            className="flex items-center gap-3 cursor-pointer min-w-[160px]"
          >
            <div className="w-12 h-12 border border-dashed rounded-md flex items-center justify-center text-xs text-gray-400">
              Your
              <br />
              Logo
            </div>
            <span className="text-xl font-bold text-black whitespace-nowrap">
              Your Shop
            </span>
          </div>

          {/* Search bar */}
          <div className="flex-1 flex justify-center px-6">
            <div className="relative w-full max-w-2xl">
              <FiSearch
                size={24}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search for a product"
                className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-full text-sm placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-sm transition-shadow"
              />
            </div>
          </div>

          {/* Desktop icons */}
          <div className="hidden md:flex items-center space-x-4">
            <IconBtn ariaLabel="Location">
              <HiOutlineLocationMarker size={30} className="text-gray-600" />
            </IconBtn>
            <IconBtn ariaLabel="Profile" onClick={() => setAuthOpen(true)}>
              <FaRegUserCircle size={30} className="text-gray-600" />
            </IconBtn>
            <IconBtn
              ariaLabel="Messages"
              onClick={() => navigate("/customer/messages")}
            >
              <FiMail size={30} className="text-gray-600" />
            </IconBtn>
            <IconBtn
              ariaLabel="WhatsApp"
              onClick={() => window.open("https://wa.me/XXXXXXXXXXX", "_blank")}
            >
              <FaWhatsapp size={30} className="text-[#25D366]" />
            </IconBtn>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center space-x-2 ml-4">
            <IconBtn ariaLabel="Menu" onClick={() => setSidebarOpen((o) => !o)}>
              <HiOutlineMenu size={30} className="text-gray-600" />
            </IconBtn>
            <IconBtn ariaLabel="Profile" onClick={() => setAuthOpen(true)}>
              <FaRegUserCircle size={30} className="text-gray-600" />
            </IconBtn>
          </div>
        </div>

        {/* Mobile sidebar */}
        <CustomerSidebar
          collapsed={!sidebarOpen}
          setCollapsed={(open) => setSidebarOpen(!open)}
        />
      </header>

      {/* Auth modal */}
      <SignInUpModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default CustomerHeader;
