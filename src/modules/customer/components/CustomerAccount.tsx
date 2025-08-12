// CustomerAccount.tsx

import React, { useState } from "react";
import { UserRoleName } from "../../auth/constants/userRoles";
import CustomerLayout from "../components/CustomerLayout";
import QuickLinksSidebar from "../components/QuickLinksSidebar";
import SignInUpModal from "../components/SignInUpModal";

const AccountEmptyState: React.FC<{ onAuthClick: () => void }> = ({
  onAuthClick,
}) => (
  <div className="flex flex-col items-center justify-center gap-6 py-16 px-4 text-center">
    {/* Illustration (can be swapped for a more detailed one) */}
    <div className="w-full max-w-xs mx-auto">
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="w-full h-auto"
      >
        <circle cx="100" cy="60" r="50" fill="#F23B3B" opacity="0.2" />
        <rect x="60" y="90" width="80" height="50" rx="8" fill="#1F2A44" />
        <rect x="70" y="100" width="60" height="10" rx="4" fill="#fff" />
        <circle cx="100" cy="50" r="18" fill="#1F2A44" />
      </svg>
    </div>
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold mb-2">Hello, There</h1>
      <p className="text-sm text-gray-600 mb-6">
        Please sign in or sign up and enjoy the experience.
      </p>
      <button
        onClick={onAuthClick}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition"
      >
        Sign In / Sign Up
      </button>
    </div>
  </div>
);

const CustomerAccount = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <>
      <CustomerLayout role={UserRoleName.CUSTOMER}>
        <div className="max-w-screen-xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-10">
          {/* Sidebar */}
          {/* <div className="flex-shrink-0">
            <QuickLinksSidebar />
          </div> */}

          {/* Main content */}
          <div className="flex-1">
            <AccountEmptyState onAuthClick={() => setAuthModalOpen(true)} />
          </div>
        </div>
      </CustomerLayout>

      <SignInUpModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default CustomerAccount;
