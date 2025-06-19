import React from "react";

const StoreSettingDomainInfoSection: React.FC = () => {
  // Replace these with props or API data later
  const domainName = "https://storemins.com/khan-store";
  const status = "LIVE";
  const dateAdded = "Jun 25, 2025";
  const provider = "StoreMins";

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 lg:p-8 space-y-4">
      {/* Heading */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Domains</h3>
        <p className="text-sm text-gray-500">
          Set up and personalize your store’s web address.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full text-sm text-left border border-gray-100">
          <thead className="bg-gray-100 text-gray-600 font-medium">
            <tr>
              <th className="px-4 py-2">Domain name</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date added</th>
              <th className="px-4 py-2">Provider</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-100">
              <td className="px-4 py-3 text-blue-600 underline">
                <a href={domainName} target="_blank" rel="noopener noreferrer">
                  {domainName}
                </a>
              </td>
              <td className="px-4 py-3">
                <span className="bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded">
                  {status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">{dateAdded}</td>
              <td className="px-4 py-3 text-gray-700">{provider}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreSettingDomainInfoSection;
