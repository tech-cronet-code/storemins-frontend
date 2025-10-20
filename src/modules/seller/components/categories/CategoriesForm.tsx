import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { showToast } from "../../../../common/utils/showToast";
import { useSellerAuth } from "../../../auth/contexts/SellerAuthContext";
import { useSellerProduct } from "../../hooks/useSellerProduct";
import { CategoriesSchema } from "../../Schemas/CategoriesSchema";
import CategoriesInfoSection from "./CategoriesInfoSection";
import HeaderSubmitButton from "./HeaderButton";
import SEOCategorySection from "./SEOCategorySection";
import { buildCategoryFormData } from "../../../auth/utils/buildCategoryFormData";
import { convertPath } from "../../../auth/utils/useImagePath";

type CategoriesFormValues = z.infer<typeof CategoriesSchema>;

interface CategoriesFormProps {
  categoryId?: string;
  type?: "PARENT" | "SUB";
  parentId?: string;
  onSuccess?: () => void;
}

const CategoriesForm: React.FC<CategoriesFormProps> = ({
  categoryId,
  type,
  parentId,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { createCategory, updateCategory, getCategory } = useSellerProduct();
  const { userDetails } = useSellerAuth();

  const methods = useForm<CategoriesFormValues>({
    resolver: zodResolver(CategoriesSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      isSubcategory: !!parentId,
      category: parentId || "",
      image: undefined,
      bannerDesktop: undefined,
      bannerMobile: undefined,
      description: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      seoImage: undefined,
    },
  });

  const { reset: resetForm } = methods;

  // Main image: keep as File[] semantics (your existing component expects this)
  const imageFileList = useWatch({
    name: "image",
    control: methods.control,
  }) as File[] | undefined;
  const imageFile: File | undefined = imageFileList?.[0];

  // SEO image: treat as FileList (how RHF stores file inputs)
  const seoFileList = useWatch({
    name: "seoImage",
    control: methods.control,
  }) as FileList | undefined;
  const seoFile: File | undefined = seoFileList?.[0];

  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const {
    getCategory: fetchCategory,
    data,
    isError,
    error,
    isLoading,
  } = getCategory;

  const didFetchRef = useRef(false);

  useEffect(() => {
    if (!categoryId || didFetchRef.current) return;
    didFetchRef.current = true;
    const initialType = type === "PARENT" || type === "SUB" ? type : "PARENT";
    fetchCategory(categoryId, initialType);
  }, [categoryId, type, fetchCategory]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const status = (error as any)?.status;
    if (!type && isError && status === 404 && categoryId) {
      fetchCategory(categoryId, "SUB");
    }
  }, [type, isError, error, categoryId, fetchCategory]);

  // Fill form from fetched data
  useEffect(() => {
    if (categoryId && data?.id === categoryId) {
      resetForm({
        name: data.name || "",
        description: data.description || "",
        isSubcategory: data.categoryType === "SUB",
        category: data.parentCategory?.id || "",
        image: undefined,
        bannerDesktop: undefined,
        bannerMobile: undefined,
        seoTitle: data.seoMetaData?.title || "",
        seoDescription: data.seoMetaData?.description || "",
        seoKeywords: data.seoMetaData?.keywords || "",
        seoImage: undefined,
      });
      methods.setValue("image", undefined);
      methods.setValue("seoImage", undefined);
      setPreviewUrl(undefined);
    }
  }, [categoryId, data, methods, resetForm]);

  useEffect(() => {
    if (isError && error) {
      showToast({
        type: "error",
        message: "Failed to load category details.",
        showClose: true,
      });
    }
  }, [isError, error]);

  useEffect(() => {
    if (parentId) methods.setValue("isSubcategory", true);
  }, [methods, parentId]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Category display image (server) for edit
  const serverImageDiskName = data?.imageUrl ?? undefined;
  const serverThumbUrl = serverImageDiskName
    ? convertPath(serverImageDiskName, "original/category")
    : undefined;
  const effectiveImageUrl = previewUrl ?? serverThumbUrl;

  // SEO image (server) for edit
  const serverSeoDiskName = data?.seoMetaData?.imageUrl ?? undefined;
  const serverSeoUrl = serverSeoDiskName
    ? convertPath(serverSeoDiskName, "original/category/seo")
    : undefined;

  const onSubmit = async (formData: CategoriesFormValues) => {
    try {
      const businessId = userDetails?.storeLinks?.[0]?.businessId;
      if (!businessId) {
        showToast({
          type: "error",
          message: "Business ID not found!",
          showClose: true,
        });
        return;
      }

      const isEditMode = !!categoryId;
      const categoryType: "PARENT" | "SUB" = isEditMode
        ? (type as "PARENT" | "SUB")
        : formData.isSubcategory || parentId
        ? "SUB"
        : "PARENT";

      const effectiveParentId =
        categoryType === "SUB" ? formData.category || parentId : undefined;

      const fd = buildCategoryFormData({
        id: isEditMode ? categoryId : undefined,
        name: formData.name,
        description: formData.description || undefined,
        status: "ACTIVE",
        categoryType,
        businessId,
        parentId: effectiveParentId,
        image: imageFile,
        seoImage: seoFile, // <-- append SEO file
        seoMetaData:
          formData.seoTitle || formData.seoDescription || formData.seoKeywords
            ? {
                title: formData.seoTitle || "",
                description: formData.seoDescription || "",
                keywords: formData.seoKeywords || "",
              }
            : undefined,
      });

      if (isEditMode) {
        const res = await updateCategory.updateCategory(fd);
        showToast({
          type: "success",
          message: res?.message || "Category updated successfully!",
          showClose: true,
        });
      } else {
        const res = await createCategory(fd);
        showToast({
          type: "success",
          message:
            res && "data" in res && res.data?.message
              ? res.data.message
              : "Category created successfully!",
          showClose: true,
        });
      }

      resetForm();
      if (onSuccess) onSuccess();
      navigate("/seller/catalogue/categories");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to save category:", err);
      showToast({
        type: "error",
        message:
          err?.data?.message || "Something went wrong. Please try again.",
        showClose: true,
      });
    }
  };

  const handleImagePreview = (file: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    methods.setValue("image", [file], { shouldValidate: true });
  };

  return (
    <FormProvider {...methods}>
      {isLoading ? (
        <div className="text-center py-6 text-gray-500">
          Loading category details...
        </div>
      ) : isError ? (
        <div className="text-center py-6 text-red-500">
          Failed to load category.
        </div>
      ) : (
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-10">
          <section id="categories-info" className="scroll-mt-24">
            <CategoriesInfoSection
              categoryId={categoryId}
              type={type as "PARENT" | "SUB"}
              imageUrl={effectiveImageUrl}
              onImageFileChange={handleImagePreview}
              imageId={undefined}
              imageDiskName={data?.imageUrl}
            />
          </section>

          <section id="seo" className="scroll-mt-24">
            <SEOCategorySection serverSeoImageUrl={serverSeoUrl} />
          </section>

          <div className="flex justify-end mt-6 pb-15 pt-1">
            <HeaderSubmitButton categoryId={categoryId} />
          </div>
        </form>
      )}
    </FormProvider>
  );
};

export default CategoriesForm;
