// HostedNotice.tsx
import React from "react";

const HostedNotice: React.FC = () => (
  <div className="w-full bg-gray-100 text-center text-[13px] py-2 border-b border-gray-200">
    <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center items-center gap-1">
      <span className="text-gray-800">This store is freely hosted on</span>
      <a
        href="https://shoopy.in"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold underline flex items-center gap-1"
      >
        {/* Replace with real logo if available */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="inline-block"
        >
          <circle cx="12" cy="12" r="12" fill="#E63946" />
          <path
            d="M7 12h10M12 7v10"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Stormins
      </a>
      <span className="text-gray-800">Pay only if you know the seller</span>
    </div>
  </div>
);

export default HostedNotice;
