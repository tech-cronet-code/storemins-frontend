import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const sellerStoreDetailsSchema = z.object({
  mobile: z.string().min(10, "Mobile number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SellerStoreDetailsForm = z.infer<typeof sellerStoreDetailsSchema>;

interface Props {
  onSubmit: (data: SellerStoreDetailsForm) => Promise<void>;
  logout: () => void;
}

const SellerStoreDetailsForm: React.FC<Props> = ({ onSubmit, logout }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const [customCategory, setCustomCategory] = useState<string | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // const [isLogin, setIsLogin] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
  } = useForm<SellerStoreDetailsForm>({
    resolver: zodResolver(sellerStoreDetailsSchema),
  });

  const handleFormSubmit = (data: SellerStoreDetailsForm) => {
    // Prevent form submission if already submitting
    if (isSubmitting) return;

    setIsSubmitting(true); // Set loading state

    onSubmit(data).finally(() => {
      setIsSubmitting(false); // Reset loading state after submission
    });
  };

  return (
    <>
      {/* Transparent Modal for Adding Custom Category */}
      {showAddCategoryModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50"
          onClick={() => {
            setShowAddCategoryModal(false);
            setNewCategoryInput("");
          }}
        >
          <div
            className="bg-white rounded-md p-6 w-full max-w-sm shadow-lg"
            onClick={(e) => e.stopPropagation()} // prevent closing on inner click
          >
            <h2 className="text-lg font-semibold mb-3">Add New Category</h2>
            <input
              type="text"
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              className="form-input-style w-full mb-4"
              placeholder="Enter new category"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1 rounded-md border text-gray-600"
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setNewCategoryInput("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-1 rounded-md bg-[#7F56D9] text-white"
                onClick={() => {
                  if (newCategoryInput.trim()) {
                    setCustomCategory(newCategoryInput.trim());
                    setValue("businessCategory", newCategoryInput.trim());
                    setShowAddCategoryModal(false);
                    setNewCategoryInput("");
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center sm:pt-3 pt-1">
        <h3 className="text-2xl font-semibold text-[#0B132A]">
          Let’s begin to set you up!
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          please add your business information to get started
        </p>
      </div>
      <form className="space-y-2" onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Business Name Input */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Name
          </label>
          <input
            {...register("businessName")}
            placeholder="khan bakery"
            className="form-input-style w-full"
          />
          {/* {errors.businessName && (
            <p className="text-red-500 text-sm">
              {errors.businessName.message}
            </p>
          )} */}
        </div>

        {/* Business Type Dropdown */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Type
          </label>
          <select
            {...register("businessType")}
            className="form-input-style w-full"
          >
            <option value="">Select Type</option>
            <option value="indivitual">Indivitual</option>
            <option value="private">Private</option>
            <option value="other">Other</option>
          </select>
          <p className="text-xs text-gray-500">
            you can always change it later!
          </p>
          {/* {errors.businessCategory && (
            <p className="text-red-500 text-sm">
              {errors.businessCategory.message}
            </p>
          )} */}
        </div>

        {/* Category Tags Grid */}
        {/* Category Tags Grid */}
        <div className="mt-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            What’s your site <span className="text-[#7F56D9]">primarily</span>{" "}
            about?
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            You can always change it later!
          </p>

          <div className="flex flex-wrap gap-3">
            {/* Custom Category (if added) */}
            {customCategory && (
              <button
                type="button"
                className={`px-4 py-1 rounded-full text-sm font-medium border ${
                  selectedCategory === customCategory
                    ? "bg-[#7F56D9] text-white border-[#7F56D9]"
                    : "border-gray-300 text-gray-700 hover:border-[#7F56D9] hover:text-[#7F56D9]"
                }`}
                onClick={() => {
                  setSelectedCategory(customCategory);
                  setValue("businessCategory", customCategory);
                }}
              >
                {customCategory}
              </button>
            )}

            {/* Predefined Categories */}
            {[
              "Bakery",
              "Artist",
              "Home & Decor",
              "Fitness trainer",
              "Jewellery",
              "Handmade",
              "Tarot reader",
              "Gifting",
              "Nutritionist",
              "Therapist",
              "Spa",
              "Organic Food",
              "Books",
              "Fashion",
              "Snacks & Beverages",
              "Astrologer",
              "Mentor",
              "Doctor",
              "Yoga teacher",
              "Electronics",
            ].map((category, idx) => (
              <button
                type="button"
                key={idx}
                className={`px-4 py-1 rounded-full text-sm font-medium border ${
                  selectedCategory === category
                    ? "bg-[#7F56D9] text-white border-[#7F56D9]"
                    : "border-gray-300 text-gray-700 hover:border-[#7F56D9] hover:text-[#7F56D9]"
                }`}
                onClick={() => {
                  setSelectedCategory(category);
                  setValue("businessCategory", category);
                }}
              >
                {category}
              </button>
            ))}

            {/* Add Category Button */}
            <button
              type="button"
              className="px-4 py-1 border border-dashed border-orange-500 text-orange-500 rounded-full text-sm font-medium"
              onClick={() => setShowAddCategoryModal(true)}
            >
              + Add category
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 mt-1 rounded-md bg-[#7F56D9] text-white font-semibold hover:bg-[#6d45c8] transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Nexting in..." : "Next"}
        </button>
        <p className="text-center text-sm font-light">
          Not do right now! click here to....{"  "}
          <span className="text-[#7F56D9] font-medium">
            <button className="cursor-pointer" onClick={logout}>
              Logout
            </button>
          </span>
        </p>
      </form>
    </>
  );
};

export default SellerStoreDetailsForm;
