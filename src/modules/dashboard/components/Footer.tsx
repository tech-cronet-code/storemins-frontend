// src/modules/dashboard/components/Footer.tsx
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white px-4 py-2 text-xs w-full mt-10">
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        <p className="text-center sm:text-left w-full sm:w-auto">
          &copy; {new Date().getFullYear()} Your Ecommerce Store. All rights
          reserved.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 sm:ml-auto">
          <div className="flex gap-3 justify-center sm:justify-end">
            <a
              href="#"
              className="hover:text-blue-400 transition"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-3.5 h-3.5" />
            </a>
            <a
              href="#"
              className="hover:text-pink-400 transition"
              aria-label="Instagram"
            >
              <FaInstagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="#"
              className="hover:text-blue-300 transition"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="flex gap-3 text-xs justify-center sm:justify-end">
            <a href="#" className="hover:text-blue-300 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-300 transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-300 transition">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
