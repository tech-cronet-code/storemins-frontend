import React from 'react';
import { useGetMyDomainQuery } from '../../../auth/services/authApi';

const StoreSettingDomainInfoSection: React.FC = () => {
  /* ───────── fetch domain + SSL details ───────── */
  const { data, isLoading, isError } = useGetMyDomainQuery();

  /* → helpers */
  const formatDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-';

  /* UI states */
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 lg:p-8">
        <div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-4" />
        <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 lg:p-8">
        <p className="text-sm text-gray-500">No domain connected yet.</p>
      </div>
    );
  }

  /* ───────── render domain row ───────── */
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 lg:p-8 space-y-4">
      {/* Heading */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Domains</h3>
        <p className="text-sm text-gray-500">
          Set up and personalize your store’s web address.
        </p>
      </div>

      {/* Domain table */}
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
              <td className="px-4 py-3 text-blue-600 underline break-all">
                <a
                  href={
                    data.domainType === 'SUBDOMAIN'
                      ? `https://storemins.com/${data.domain}`
                      : `https://${data.domain}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.domainType === 'SUBDOMAIN'
                    ? `https://storemins.com/${data.domain}`
                    : `https://${data.domain}`}
                </a>
              </td>


              <td className="px-4 py-3">
                <span
                  className={`${data.verificationStatus === 'VERIFIED'
                      ? 'bg-green-600'
                      : data.verificationStatus === 'PENDING'
                        ? 'bg-yellow-400'
                        : 'bg-red-500'
                    }  text-white text-xs font-semibold px-2.5 py-1 rounded`}
                >
                  {data.verificationStatus === 'VERIFIED' ? 'LIVE' : data.verificationStatus}
                </span>
              </td>

              <td className="px-4 py-3 text-gray-700">
                {formatDate(data.createdAt)}
              </td>

              <td className="px-4 py-3 text-gray-700">
                {data.domainType === 'SUBDOMAIN' ? 'StoreMins' : 'External'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreSettingDomainInfoSection;
