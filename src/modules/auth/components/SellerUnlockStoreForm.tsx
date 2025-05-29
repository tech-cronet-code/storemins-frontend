// src/components/SellerUnlockStoreForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  sellerUnlockStoreFormSchema,
  SellerUnlockStoreFormValues,
} from "../schemas/sellerUnlockStoreSchema";
import { useDebounce } from "../hooks/useDebounce";

interface Props {
  onSubmit: (data: SellerUnlockStoreFormValues) => Promise<void>;
  logout: () => void;
  checkAvailability: (name: string) => Promise<"available" | "taken">;
  isSubmitting: boolean;
}

const SellerUnlockStoreForm: React.FC<Props> = ({
  onSubmit,
  logout,
  checkAvailability,
  isSubmitting,
}) => {
  const [availability, setAvailability] = useState<"available" | "taken" | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SellerUnlockStoreFormValues>({
    resolver: zodResolver(sellerUnlockStoreFormSchema),
  });

  const businessName = watch("businessName");
  const debouncedName = useDebounce(businessName, 500);

  useEffect(() => {
    let cancelled = false;

    if (!debouncedName || debouncedName.trim().length < 3) {
      setAvailability(null);
      return;
    }

    setAvailability(null);
    checkAvailability(debouncedName).then((status) => {
      if (!cancelled) {
        setAvailability(status);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedName]);

  return (
    <div>
      <div className="text-center sm:pt-3 pt-1">
        <h3 className="text-2xl font-semibold text-[#0B132A]">
          Create Your Online Identity
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          to share it in your Instagram bio and WhatsApp for people to easily
          browse your website
        </p>
      </div>

      <form
        className="space-y-4 mt-4"
        onSubmit={handleSubmit((data) => {
          if (availability !== "available") return;
          onSubmit(data);
        })}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business URL
          </label>

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
  value={businessName}
  placeholder="khan-food-bakery"
  onKeyDown={(e) => {
    if (e.key === " ") {
      e.preventDefault(); // replace space with hyphen
      const pos = e.currentTarget.selectionStart || 0;
      const updated =
        businessName.slice(0, pos) + "-" + businessName.slice(pos);
      setValue("businessName", updated, { shouldValidate: true });
    }
  }}
  onChange={(e) => {
    let raw = e.target.value;

    // 1. Convert to lowercase
    raw = raw.toLowerCase();

    // 2. Replace spaces with -
    raw = raw.replace(/\s+/g, "-");

    // 3. Remove anything that's NOT a-z, 0-9, or -
    raw = raw.replace(/[^a-z0-9-]/g, "");

    // 4. Collapse multiple dashes to single
    raw = raw.replace(/-+/g, "-");

    // 5. Remove starting/ending dash
    raw = raw.replace(/^-+|-+$/g, "");

    setValue("businessName", raw, { shouldValidate: true });
  }}
  className="flex-1 outline-none pr-36 text-sm"
/>


            <div className="absolute right-3 flex items-center gap-2">
              <span className="text-[#7F56D9] font-semibold text-sm">
                .storemins.com
              </span>
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center ${availability === "available"
                    ? "bg-green-500 text-white"
                    : availability === "taken"
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-white"
                  }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
            </div>
          </div>

          {errors.businessName ? (
            <p className="text-red-500 text-sm mt-1">
              {errors.businessName.message}
            </p>
          ) : availability === "taken" ? (
            <p className="text-red-600 text-sm mt-1">
              This link is already in use. Please try another name.
            </p>
          ) : availability === "available" ? (
            <p className="text-green-600 text-sm mt-1">
              Yay! This link is available.
            </p>
          ) : debouncedName?.trim().length >= 3 ? (
            <p className="text-sm text-gray-500 mt-1">
              Checking availability...
            </p>
          ) : null}
        </div>

      <button
  type="submit"
  disabled={
    isSubmitting ||
    availability !== "available" ||
    !!errors.businessName // ⛔ disable if there is a validation error
  }
  className={`w-full py-2 rounded-md text-white font-semibold transition ${
    isSubmitting ||
    availability !== "available" ||
    !!errors.businessName
      ? "bg-[#A08ADB] cursor-not-allowed"
      : "bg-[#7F56D9] hover:bg-[#6d45c8]"
  }`}
>
  {isSubmitting ? "Nexting in..." : "Unlock your store"}
</button>


        <p className="text-center text-sm font-light">
          Click here to...{" "}
          <button
            className="text-[#7F56D9] font-medium underline"
            type="button"
            onClick={logout}
          >
            Logout
          </button>
        </p>
      </form>
    </div>
  );
};

export default SellerUnlockStoreForm;
