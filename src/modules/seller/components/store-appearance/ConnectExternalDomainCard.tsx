import React from "react";

const ConnectExternalDomainCard: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 flex items-center justify-between">
      <div>
        <h3 className="text-base font-semibold text-gray-800">
          Connect external domain
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          You can connect your existing domain to Dukaan in a few minutes.
        </p>
      </div>
      <button
        type="button"
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-md"
      >
        Connect
      </button>
    </div>
  );
};

export default ConnectExternalDomainCard;
