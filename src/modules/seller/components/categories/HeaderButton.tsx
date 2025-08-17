"use client";
import { useFormContext } from "react-hook-form";
import type { CategoriesFormValues } from "../../Schemas/CategoriesSchema";

interface HeaderSubmitButtonProps {
  categoryId?: string; // present in Edit
}

const HeaderSubmitButton: React.FC<HeaderSubmitButtonProps> = ({ categoryId }) => {
  const {
    watch,
    formState: { isSubmitting, isDirty },
  } = useFormContext<CategoriesFormValues>();

  const name = watch("name");
  const isSub = watch("isSubcategory");
  const parent = watch("category");

  // ✅ Only the required bits for enabling:
  // - name length ≥ 3 (matches your schema)
  // - if subcategory is checked => parent must be selected
  const hasRequiredFields =
    (name?.trim().length ?? 0) >= 3 &&
    (!isSub || !!String(parent ?? "").trim());

  const isEditMode = Boolean(categoryId);
  const isDisabled = isSubmitting || (isEditMode ? !isDirty || !hasRequiredFields : !hasRequiredFields);

  return (
    <button
      type="submit"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting
        ? isEditMode
          ? "Updating..."
          : "Adding..."
        : isEditMode
        ? "Update Category"
        : "Add Category"}
    </button>
  );
};

export default HeaderSubmitButton;
