import React, { useState } from 'react'

/* ---------- Types ---------- */
export interface PolicySettings {
  termsText: string
  shippingPolicy: string
  paymentPolicy: string
  returnPolicy: string
  privacyPolicy: string
}

interface TermsOfServiceSettingsProps {
  policySettings: PolicySettings
  onChange: (settings: PolicySettings) => void
}

/* ---------- Component ---------- */
const TermsOfServiceSettings: React.FC<TermsOfServiceSettingsProps> = ({
  policySettings,
  onChange,
}) => {
  const [fullscreenKey, setFullscreenKey] = useState<keyof PolicySettings | null>(null)

  const handleTextChange =
    (key: keyof PolicySettings) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange({ ...policySettings, [key]: e.target.value })
    }

  const PolicyBlock = (key: keyof PolicySettings, label: string) => (
    <>
      <div className='space-y-6 rounded-xl border border-gray-200 bg-white p-5'>
        <label className='block text-sm font-medium text-gray-800'>{label}</label>

        <textarea
          className='w-full min-h-[220px] rounded border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 text-sm resize-y'
          value={policySettings[key]}
          onChange={handleTextChange(key)}
          placeholder={`Write or paste your ${label} here…`}
        />

        <button
          type='button'
          className='text-sm text-blue-600 hover:underline'
          onClick={() => setFullscreenKey(key)}
        >
          Expand and Edit Field
        </button>
      </div>

      {fullscreenKey === key && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='w-full max-w-4xl bg-white rounded-lg shadow-xl p-6 flex flex-col gap-4 h-[80vh]'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>Edit {label}</h2>
              <button
                className='text-gray-500 hover:text-gray-700'
                onClick={() => setFullscreenKey(null)}
              >
                ✕
              </button>
            </div>

            <textarea
              className='flex-1 w-full border border-gray-300 rounded p-4 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              value={policySettings[key]}
              onChange={handleTextChange(key)}
            />

            <div className='flex justify-end gap-3 pt-2 border-t'>
              <button
                className='px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition'
                onClick={() => setFullscreenKey(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )

  return (
    <>
      {PolicyBlock('termsText', 'Terms and Conditions')}
      {PolicyBlock('shippingPolicy', 'Shipping Policy')}
      {PolicyBlock('paymentPolicy', 'Payment Policy')}
      {PolicyBlock('returnPolicy', 'Return and Refund Policy')}
      {PolicyBlock('privacyPolicy', 'Privacy Policy')}
    </>
  )
}

export default TermsOfServiceSettings
