import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schema
const sellerUnlockStoreFormSchema = z.object({
  businessName: z
    .string()
    .nonempty("Business url is required")
    .min(3, "Business url must be at least 3 characters"),
});



export type SellerUnlockStoreForm = z.infer<typeof sellerUnlockStoreFormSchema>;

interface Props {
  onSubmit: (data: SellerUnlockStoreForm) => Promise<void>;
  logout: () => void;
  checkAvailability: (name: string) => Promise<"available" | "taken">;
}

const SellerUnlockStoreForm: React.FC<Props> = ({ onSubmit, logout, checkAvailability }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availability, setAvailability] = useState<"available" | "taken" | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SellerUnlockStoreForm>({
    resolver: zodResolver(sellerUnlockStoreFormSchema),
  });

  const businessName = watch("businessName");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!businessName || businessName.trim().length < 3) {
        setAvailability(null);
        return;
      }

      // Check validation error before checking availability
      if (!errors.businessName) {
        checkAvailability(businessName).then(setAvailability);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [businessName, errors.businessName]);


  const handleFormSubmit = (data: SellerUnlockStoreForm) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    onSubmit(data).finally(() => setIsSubmitting(false));
  };

  return (
    <div>
      <div className="text-center sm:pt-3 pt-1">
        <h3 className="text-2xl font-semibold text-[#0B132A]">Create Your Online Identity</h3>
        <p className="mt-2 text-sm text-gray-600">
          to share it in your Instagram bio and WhatsApp for people to easily browse your website
        </p>
      </div>

      <form className="space-y-4 mt-4" onSubmit={handleSubmit(handleFormSubmit)}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business URL</label>

          <div
            className={`relative flex items-center border rounded-md px-3 py-2 ${availability === "available"
                ? "border-green-500"
                : availability === "taken"
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
          >
            <input
              {...register("businessName")}
              placeholder="khan-food-bakery"
              className="flex-1 outline-none pr-36 text-sm"
            />
            <div className="absolute right-3 flex items-center gap-2">
              <span className="text-[#7F56D9] font-semibold text-sm">.storemins.com</span>

              <span
                className={`
      w-6 h-6 rounded-full flex items-center justify-center
      ${availability === "available"
                    ? "bg-green-500 text-white"
                    : availability === "taken"
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-white"
                  }
    `}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </div>

          </div>

          {/* Messages */}
          {errors.businessName ? (
            <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
          ) : availability === "taken" ? (
            <p className="text-red-600 text-sm mt-1">This link is already in use. Please try another name</p>
          ) : availability === "available" ? (
            <p className="text-green-600 text-sm mt-1">Yay!! This link is available</p>
          ) : null}

        </div>


        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded-md text-white font-semibold transition ${isSubmitting ? "bg-[#A08ADB]" : "bg-[#7F56D9] hover:bg-[#6d45c8]"
            }`}
        >
          {isSubmitting ? "Nexting in..." : "Unlock your store"}
        </button>


        {/* Logout */}
        <p className="text-center text-sm font-light">
          Click here to...{" "}
          <button className="text-[#7F56D9] font-medium underline" type="button" onClick={logout}>
            Logout
          </button>
        </p>
      </form>
    </div>
  );
};

export default SellerUnlockStoreForm;
