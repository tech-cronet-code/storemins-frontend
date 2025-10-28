export type CategoryType = "PARENT" | "SUB";
export type CategoryStatus = "ACTIVE" | "INACTIVE";

export interface BuildCategoryFormInput {
  // Common
  id?: string;
  name: string;
  description?: string;
  status?: CategoryStatus;
  categoryType: CategoryType;
  businessId: string;
  parentId?: string;

  // Files
  image?: File;
  seoImage?: File; // ✅ NEW

  // Nested
  seoMetaData?: {
    title?: string;
    description?: string;
    keywords?: string;
    // DO NOT put a file here
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
    fd.append("seoMetaData", JSON.stringify(input.seoMetaData));
  }


  if (input.image) fd.append("image", input.image);         // ✅ optional
  if (input.seoImage) fd.append("seoImage", input.seoImage); // ✅ optional


  return fd;
}
