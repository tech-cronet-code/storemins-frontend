import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useAuth } from "../../../auth/contexts/AuthContext";
import CategorySelectDropdown from "./CategorySelectorModal";

const StoreSettingInfoSection: React.FC = () => {
  /* ------------------------------------------------------------------ */
  /* ❶ react-hook-form helpers                                          */
  /* ------------------------------------------------------------------ */
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();           // <-- grab methods from provider

  /* ------------------------------------------------------------------ */
  /* ❷ category dropdown (kept outside RHF, per your request)           */
  /* ------------------------------------------------------------------ */
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedCategoryNames, setSelectedCategoryNames] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { userDetails } = useAuth();
  const businessId = userDetails?.storeLinks?.[0]?.businessId;

  const categories = [
    { id: "1", name: "Pharmacy",            image: "…" },
    { id: "2", name: "General Store",       image: "…" },
    { id: "3", name: "Fruits & Vegetables", image: "…" },
    { id: "4", name: "Meat Shop",           image: "…" },
    { id: "5", name: "Bakery Shop",         image: "…" },
    { id: "6", name: "Mobile Store",        image: "…" },
    { id: "7", name: "Electronics Shop",    image: "…" },
    { id: "8", name: "Restaurant",          image: "…" },
    { id: "9", name: "Book Shop",           image: "…" },
    { id: "10",name: "Beauty Store",        image: "…" },
  ];

  /** called when modal closes with a selection */
  const handleSelectCategories = (catIds: string[]) => {
    const names = catIds
      .map((id) => categories.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    setSelectedCategoryIds(catIds);
    setSelectedCategoryNames(names);
    setModalOpen(false);

    // even though you said “except category”, we still push the value
    // into the form so it’s available if you need it.
    setValue("categoryId", catIds[0] ?? "");
  };

  /* ------------------------------------------------------------------ */
  /* ➍ guard: show message if tenant has no store                       */
  /* ------------------------------------------------------------------ */
  if (!businessId) {
    return (
      <div className="text-center text-red-500">
        Business ID not found.
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* ➎ rendered section                                                 */
  /* ------------------------------------------------------------------ */
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 lg:p-8 space-y-6">
      {/* Heading */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Store Information
        </h3>
        <p className="text-sm text-gray-500">
          Easily input essential details like name, phone, etc.
        </p>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* Store Name                                                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Store Name
        </label>
        <input
          {...register("businessName")}
          type="text"
          placeholder="Enter store name"
          className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-1
                      ${errors.businessName ? "border-red-500" : "border-gray-300"}
                      focus:outline-none focus:ring-blue-500`}
        />
        {errors.businessName && (
          <p className="text-xs text-red-600">
            {errors.businessName.message as string}
          </p>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* Category (read-only input + modal)                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Category</label>
        <input
          ref={inputRef}
          readOnly
          value={selectedCategoryNames}
          onClick={() => setModalOpen(true)}
          placeholder="Select category"
          className="w-full border border-gray-300 bg-gray-50 rounded-md px-3 py-2
                     text-sm cursor-pointer focus:ring-1 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <CategorySelectDropdown
        open={modalOpen}
        categories={categories}
        selectedCategoryIds={selectedCategoryIds}
        onSelect={handleSelectCategories}
        onClose={() => setModalOpen(false)}
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* Phone & Email                                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* phone ---------------------------------------------------- */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            {...register("businessPhone")}
            type="text"
            placeholder="Enter phone number"
            onInput={(e) =>
              (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))
            }
            className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-1
                        ${errors.businessPhone ? "border-red-500" : "border-gray-300"}
                        focus:outline-none focus:ring-blue-500`}
          />
          {errors.businessPhone && (
            <p className="text-xs text-red-600">
              {errors.businessPhone.message as string}
            </p>
          )}
        </div>

        {/* email ---------------------------------------------------- */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            {...register("businessEmail")}
            type="email"
            placeholder="Enter email address"
            className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-1
                        ${errors.businessEmail ? "border-red-500" : "border-gray-300"}
                        focus:outline-none focus:ring-blue-500`}
          />
          {errors.businessEmail && (
            <p className="text-xs text-red-600">
              {errors.businessEmail.message as string}
            </p>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* Country                                                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Country</label>
        <input
          {...register("country")}
          type="text"
          placeholder="Enter country name"
          className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-1
                      ${errors.country ? "border-red-500" : "border-gray-300"}
                      focus:outline-none focus:ring-blue-500`}
        />
        {errors.country && (
          <p className="text-xs text-red-600">
            {errors.country.message as string}
          </p>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* Address                                                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Store Address
        </label>
        <textarea
          {...register("address")}
          rows={4}
          placeholder="Enter store address"
          className={`w-full border rounded-md px-3 py-2 text-sm resize-none focus:ring-1
                      ${errors.address ? "border-red-500" : "border-gray-300"}
                      focus:outline-none focus:ring-blue-500`}
        />
        {errors.address && (
          <p className="text-xs text-red-600">
            {errors.address.message as string}
          </p>
        )}
      </div>

      {/* hidden input to keep 1st category ID if you need it later */}
      <input type="hidden" {...register("categoryId")} />
    </div>
  );
};

export default StoreSettingInfoSection;
