"use client";

import { useFormContext } from "react-hook-form";

interface HeaderSubmitButtonProps {
  categoryId?: string;
}

const HeaderSubmitButton: React.FC<HeaderSubmitButtonProps> = ({
  categoryId,
}) => {
  const {
    formState: { isValid, isSubmitting },
  } = useFormContext();

  return (
    <button
      type="submit"
      disabled={!isValid || isSubmitting}
      className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting
        ? categoryId
          ? "Updating..."
          : "Adding..."
        : categoryId
        ? "Update Category"
        : "Add Category"}
    </button>
  );
};

export default HeaderSubmitButton;
