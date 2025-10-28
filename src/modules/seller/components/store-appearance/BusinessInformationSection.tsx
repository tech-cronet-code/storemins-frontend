// src/modules/store/containers/BusinessInformationSection.tsx

import React, { useState } from "react";
import { useFormContext, FieldError, FieldErrorsImpl } from "react-hook-form";
import { Pencil } from "lucide-react";
import EditAddressModal from "./EditAddressModal";
import { useListBusinessTypesQuery } from "../../../auth/services/sellerApi";

const BusinessInformationSection: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const {
    data: businessTypes = [],
    isLoading: typesLoading,
    error: typesError,
  } = useListBusinessTypesQuery();

  /* ---- local state ---- */
  const [showAddressModal, setShowAddressModal] = useState(false);
  const address = watch("businessProfile");

  /* ---- helpers ---- */
  const formattedAddress = `${address?.address || ""} ${
    address?.street2 || ""
  }, ${address?.city || ""}, ${address?.state || ""} - ${
    address?.pincode || ""
  }, ${address?.country || ""}`;

  /* ---- safely pick nested error ---- */
  const businessTypeErr = (
    errors.businessProfile as FieldErrorsImpl<any> | undefined
  )?.businessTypeId as FieldError | undefined;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Business Information
        </h3>
        <p className="text-sm text-gray-500">
          Submit Your Details to Formalize Your Business
        </p>
      </div>

      {/* Legal Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Legal Name</label>
        <input
          {...register("businessProfile.legalName")}
          type="text"
          placeholder="Enter legal name"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none focus:ring-blue-500"
        />
      </div>

      {/* Business Type (dynamic) */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Business Type
        </label>

        {typesLoading ? (
          <p className="text-sm text-gray-500">Loading business types…</p>
        ) : typesError ? (
          <p className="text-sm text-red-500">
            Couldn’t load business types. Try again later.
          </p>
        ) : (
          <select
            {...register("businessProfile.businessTypeId")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none focus:ring-blue-500"
            defaultValue=""
          >
            <option value="" disabled>
              Select
            </option>
            {businessTypes.map((bt) => (
              <option key={bt.id} value={String(bt.id)}>
                {bt.name}
              </option>
            ))}
          </select>
        )}

        {businessTypeErr && (
          <p className="text-xs text-red-500 mt-1">{businessTypeErr.message}</p>
        )}
      </div>

      {/* GST & CIN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            GST Number
          </label>
          <input
            {...register("businessProfile.gstNumber")}
            type="text"
            placeholder="Enter GST number"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">CIN</label>
          <input
            {...register("businessProfile.cin")}
            type="text"
            placeholder="Enter CIN"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none focus:ring-blue-500"
          />
        </div>
      </div>

      {/* FSSAI */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          FSSAI License Number
        </label>
        <input
          {...register("businessProfile.fssaiLicenseNumber")}
          type="text"
          placeholder="Enter FSSAI license number"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none focus:ring-blue-500"
        />
      </div>

      {/* Address Section */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Address</label>
        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
          <div className="text-sm text-gray-700">
            🏠{" "}
            {formattedAddress.trim() === ", , - ,"
              ? "No address added yet."
              : formattedAddress}
          </div>
          <button
            type="button"
            className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
            onClick={() => setShowAddressModal(true)}
          >
            <Pencil size={16} />
            Edit
          </button>
        </div>
      </div>

      {/* Address Modal */}
      <EditAddressModal
        open={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        address={{
          street1: address?.address || "",
          street2: address?.street2 || "",
          city: address?.city || "",
          state: address?.state || "",
          pincode: address?.pincode || "",
        }}
        onSave={(updated) => {
          setValue("businessProfile.address", updated.street1, {
            shouldDirty: true,
          });
          setValue("businessProfile.street2", updated.street2, {
            shouldDirty: true,
          });
          setValue("businessProfile.city", updated.city, { shouldDirty: true });
          setValue("businessProfile.state", updated.state, {
            shouldDirty: true,
          });
          setValue("businessProfile.pincode", updated.pincode, {
            shouldDirty: true,
          });
          setValue("businessProfile.country", "India", { shouldDirty: true });
        }}
      />
    </div>
  );
};

export default BusinessInformationSection;
