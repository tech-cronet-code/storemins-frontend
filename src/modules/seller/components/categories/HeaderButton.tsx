"use client";

import { useFormContext, useWatch } from "react-hook-form";

interface HeaderSubmitButtonProps {
  categoryId?: string;
}

const HeaderSubmitButton: React.FC<HeaderSubmitButtonProps> = ({
  categoryId,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const nameValue = useWatch({ name: "name", control });
  const isNameFilled = !!nameValue?.trim();

  const isDisabled = !isNameFilled || isSubmitting;

  return (
    <button
      type="submit"
      disabled={isDisabled}
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
