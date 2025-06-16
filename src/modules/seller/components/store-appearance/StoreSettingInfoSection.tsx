import React, { useRef, useState } from "react";
import { useAuth } from "../../../auth/contexts/AuthContext";
import CategorySelectDropdown from "./CategorySelectorModal";

const StoreSettingInfoSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedCategoryNames, setSelectedCategoryNames] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { userDetails } = useAuth();
  const businessId = userDetails?.storeLinks?.[0]?.businessId;

  const categories = [
    {
      id: "1",
      name: "Pharmacy",
      image: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png",
    },
    {
      id: "2",
      name: "General Store",
      image: "https://cdn-icons-png.flaticon.com/512/2976/2976215.png",
    },
    {
      id: "3",
      name: "Fruits & Vegetables",
      image: "https://cdn-icons-png.flaticon.com/512/1046/1046869.png",
    },
    {
      id: "4",
      name: "Meat Shop",
      image: "https://cdn-icons-png.flaticon.com/512/3194/3194775.png",
    },
    {
      id: "5",
      name: "Bakery Shop",
      image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    },
    {
      id: "6",
      name: "Mobile Store",
      image: "https://cdn-icons-png.flaticon.com/512/3050/3050525.png",
    },
    {
      id: "7",
      name: "Electronics Shop",
      image: "https://cdn-icons-png.flaticon.com/512/998/998601.png",
    },
    {
      id: "8",
      name: "Restaurant",
      image: "https://cdn-icons-png.flaticon.com/512/3075/3075973.png",
    },
    {
      id: "9",
      name: "Book Shop",
      image: "https://cdn-icons-png.flaticon.com/512/2972/2972035.png",
    },
    {
      id: "10",
      name: "Beauty Store",
      image: "https://cdn-icons-png.flaticon.com/512/3075/3075972.png",
    },
  ];

  const handleSelectCategories = (categoryIds: string[]) => {
    const names = categoryIds
      .map((id) => categories.find((cat) => cat.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    setSelectedCategoryNames(names);
    setSelectedCategoryIds(categoryIds);
    setModalOpen(false);
  };

  if (!businessId) {
    return (
      <div className="text-center text-red-500">Business ID not found.</div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 lg:p-8 space-y-6">
      {/* Heading */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Store Information
        </h3>
        <p className="text-sm text-gray-500">
          Easily input essential details like name, category, etc.
        </p>
      </div>

      {/* Store Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Store Name</label>
        <input
          type="text"
          placeholder="Enter store name"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none focus:ring-blue-500"
        />
      </div>

      {/* Category */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Category</label>
        <input
          ref={inputRef}
          type="text"
          readOnly
          value={selectedCategoryNames}
          onClick={() => setModalOpen(true)}
          placeholder="Select categories"
          className="w-full border border-gray-300 bg-gray-50 rounded-md px-3 py-2 text-sm cursor-pointer focus:ring-1 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <CategorySelectDropdown
        open={modalOpen}
        categories={categories}
        selectedCategoryIds={selectedCategoryIds}
        onSelect={handleSelectCategories}
        onClose={() => setModalOpen(false)}
      />

      {/* Phone & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            placeholder="Enter phone number"
            onInput={(e) =>
              (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none focus:ring-blue-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="text"
            placeholder="Enter email address"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Country */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Country</label>
        <input
          type="text"
          placeholder="Enter country name"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:outline-none focus:ring-blue-500"
        />
      </div>

      {/* Address */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Store Address
        </label>
        <textarea
          rows={4}
          placeholder="Enter store address"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:ring-1 focus:outline-none focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default StoreSettingInfoSection;