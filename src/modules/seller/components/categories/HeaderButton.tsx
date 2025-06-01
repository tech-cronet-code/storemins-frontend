'use client';

import { useFormContext } from "react-hook-form";

const HeaderButton = () => {
  const {
    formState: { isValid, isSubmitting },
  } = useFormContext();

  return (
    <button
      type="submit"
      disabled={!isValid || isSubmitting}
      className={`w-full sm:w-auto px-5 py-2.5 rounded-md text-sm font-medium shadow-sm transition ${
        isValid && !isSubmitting
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-300 text-white cursor-not-allowed"
      }`}
    >
      {isSubmitting ? "Adding..." : "Add Categories"}
    </button>
  );
};

export default HeaderButton;
