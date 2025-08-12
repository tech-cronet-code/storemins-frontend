// CustomerHome.tsx

import React from "react";
import { UserRoleName } from "../../auth/constants/userRoles";
import CustomerLayout from "../components/CustomerLayout";
import BrowseCategories from "../components/BrowseCategories";
import ProductList from "../components/ProductList";

const SetupEmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-24 px-4 text-center gap-6">
    {/* Illustration (simplified vector placeholder matching style) */}
    <div className="w-full max-w-xs">
      <svg
        viewBox="0 0 320 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto"
        aria-hidden="true"
      >
        {/* Background dots */}
        <g opacity="0.2">
          <circle cx="50" cy="30" r="4" fill="#000" />
          <circle cx="70" cy="30" r="4" fill="#000" />
          <circle cx="90" cy="30" r="4" fill="#000" />
          <circle cx="50" cy="50" r="4" fill="#000" />
          <circle cx="70" cy="50" r="4" fill="#000" />
          <circle cx="90" cy="50" r="4" fill="#000" />

          <circle cx="230" cy="30" r="4" fill="#000" />
          <circle cx="250" cy="30" r="4" fill="#000" />
          <circle cx="270" cy="30" r="4" fill="#000" />
          <circle cx="230" cy="50" r="4" fill="#000" />
          <circle cx="250" cy="50" r="4" fill="#000" />
          <circle cx="270" cy="50" r="4" fill="#000" />
        </g>

        {/* Person with laptop */}
        <rect x="180" y="80" width="80" height="80" rx="8" fill="#1F2A44" />
        <circle cx="220" cy="60" r="18" fill="#F23B3B" />
        <rect x="190" y="130" width="60" height="10" rx="3" fill="#F23B3B" />
        <rect x="190" y="110" width="60" height="15" rx="4" fill="#fff" />

        {/* Stack of little characters */}
        <g>
          <circle cx="90" cy="120" r="20" fill="#1F2A44" />
          <circle cx="90" cy="85" r="16" fill="#F23B3B" />
          <rect x="75" y="128" width="30" height="12" rx="3" fill="#F23B3B" />
          <circle cx="70" cy="140" r="10" fill="#1F2A44" />
        </g>
      </svg>
    </div>

    {/* Text */}
    <div className="max-w-md space-y-2">
      <h1 className="text-3xl font-semibold text-gray-900">
        Hi there! Thanks for Shopping by!
      </h1>
      <p className="text-sm text-gray-500">
        Your preferred merchant is currently setting up their store
      </p>
    </div>
  </div>
);

const CustomerHome = () => {
  return (
    <CustomerLayout role={UserRoleName.CUSTOMER}>
      <main className="flex-grow">
        {/* <div className="min-h-[calc(100vh-80px)] flex items-start justify-center"> */}
        {/* <SetupEmptyState /> */}
        <div className="pt-8">
          <BrowseCategories />
          <ProductList />
        </div>
        {/* </div> */}
      </main>
    </CustomerLayout>
  );
};

export default CustomerHome;
