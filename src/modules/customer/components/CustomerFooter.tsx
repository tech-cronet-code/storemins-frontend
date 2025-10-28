// CustomerFooter.tsx

import React from "react";
import { Link } from "react-router-dom";
import { FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const quickLinks = [
  { label: "Home", to: "/customer" },
  { label: "My Account", to: "/account" },
  { label: "My Orders", to: "/orders" },
  { label: "Contact Us", to: "/contact" },
];

const CustomerFooter: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-100 text-gray-800">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Quick Links */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="hover:underline"
                    aria-label={link.label}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">Get In Touch</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <FiPhone className="text-red-600" />
                <span>0909090988</span>
              </div>
              <div className="flex items-center gap-2">
                <FaWhatsapp className="text-red-600" />
                <span>0909090988</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-300 pt-6">
          <p className="text-center text-[12px] text-gray-400">
            Copyright © by Your Shop {year}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CustomerFooter;
