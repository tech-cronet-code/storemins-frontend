// src/common/utils/buildCategoryFormData.ts
export type CategoryType = "PARENT" | "SUB";
export type CategoryStatus = "ACTIVE" | "INACTIVE";

export interface BuildCategoryFormInput {
  // Common
  id?: string; // required for edit
  name: string;
  description?: string;
  status?: CategoryStatus;
  categoryType: CategoryType;
  businessId: string;
  parentId?: string;

  // File
  image?: File;

  // Nested
  seoMetaData?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

export function buildCategoryFormData(input: BuildCategoryFormInput) {
  const fd = new FormData();
  if (input.id) fd.append("id", input.id);

  fd.append("name", input.name);
  if (input.description) fd.append("description", input.description);
  if (input.status) fd.append("status", input.status);
  fd.append("categoryType", input.categoryType);
  fd.append("businessId", input.businessId);
  if (input.parentId) fd.append("parentId", input.parentId);

  if (
    input.seoMetaData &&
    (input.seoMetaData.title ||
      input.seoMetaData.description ||
      input.seoMetaData.keywords)
  ) {
    // Backend’s DTO accepts an object; send JSON (your OptionalObjectProperty handles parsing).
    fd.append("seoMetaData", JSON.stringify(input.seoMetaData));
  }

  if (input.image) fd.append("image", input.image);

  return fd;
}
