// CustomerSidebar.tsx

import React from "react";
import { FiSearch } from "react-icons/fi";
import { FaRegUserCircle, FaWhatsapp } from "react-icons/fa";
import { HiOutlineShoppingBag, HiOutlineX } from "react-icons/hi";
import LocationDropdown from "./LocationDropdown";

interface SidebarProps {
  collapsed: boolean; // true = hidden
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomerSidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  if (collapsed) return null;

  return (
    <div className="md:hidden fixed inset-x-0 top-[80px] bg-white z-40 border-t border-gray-200 shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">Menu</div>
          <button
            aria-label="Close menu"
            onClick={() => setCollapsed(true)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <HiOutlineX size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <FiSearch className="text-gray-500 text-[18px]" />
          </div>
          <input
            type="text"
            placeholder="Search for a product"
            className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-lg text-[14px] placeholder-gray-500 text-gray-800 outline-none shadow-sm focus:ring-1 focus:ring-gray-300"
          />
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-6 text-[22px]">
          <LocationDropdown />
          <button
            aria-label="Profile"
            className="p-2 hover:bg-gray-100 rounded-full flex items-center justify-center"
          >
            <FaRegUserCircle />
          </button>
          <button
            aria-label="Cart"
            className="p-2 hover:bg-gray-100 rounded-full flex items-center justify-center"
          >
            <HiOutlineShoppingBag />
          </button>
          <a
            href="https://wa.me/XXXXXXXXXXX"
            aria-label="WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-gray-100 rounded-full flex items-center justify-center"
          >
            <FaWhatsapp className="text-[#25D366]" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default CustomerSidebar;
