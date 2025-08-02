import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { showToast } from "../../../../common/utils/showToast";
import { useAuth } from "../../../auth/contexts/AuthContext";
import { useImageUpload } from "../../../auth/hooks/useImageUpload";
import { useSellerProduct } from "../../hooks/useSellerProduct";
import { CategoriesSchema } from "../../Schemas/CategoriesSchema";
import CategoriesInfoSection from "./CategoriesInfoSection";
import HeaderSubmitButton from "./HeaderButton";
import SEOCategorySection from "./SEOCategorySection";

type CategoriesFormValues = z.infer<typeof CategoriesSchema>;

interface CategoriesFormProps {
  categoryId?: string;
  type?: string;
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
  const { userDetails } = useAuth();

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
      seoImage: undefined,
    },
  });

  const { reset: resetForm, watch } = methods;
  const imageFileList =
    useWatch({ name: "image", control: methods.control }) ?? [];
  const imageFile = imageFileList?.[0];

  const isSubcategory = watch("isSubcategory") || type === "SUB";
  const role = isSubcategory ? "productCategory:sub" : "productCategory:parent";
  const { imageUrl, handleImageUpload, setImageUrl } = useImageUpload(role);

  const {
    getCategory: fetchCategory,
    data,
    isError,
    error,
    isLoading,
  } = getCategory;

  const didFetchRef = useRef(false);

  useEffect(() => {
    if (!didFetchRef.current && categoryId && type) {
      didFetchRef.current = true;
      const categoryType = type === "PARENT" ? "PARENT" : "SUB";
      fetchCategory(categoryId, categoryType);
    }
  }, [categoryId, type, fetchCategory]);

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
        seoImage: undefined,
      });
      methods.setValue("image", undefined);
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
    if (parentId) {
      methods.setValue("isSubcategory", true);
    }
  }, [methods, parentId]);

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

      let newCategoryId = categoryId;
      let uploadedImageId: string | undefined = undefined;

      // ---- EDIT FLOW ----
      if (isEditMode) {
        // Upload image first if selected
        if (imageFile) {
          try {
            const uploadRes = await handleImageUpload(
              imageFile,
              role,
              categoryId
            );
            uploadedImageId = uploadRes?.id;
          } catch (uploadError) {
            console.warn("Image upload failed:", uploadError);
          }
        }

        const response = await updateCategory.updateCategory({
          id: categoryId,
          name: formData.name,
          description: formData.description || undefined,
          status: "ACTIVE",
          categoryType,
          businessId,
          parentId: categoryType === "SUB" ? formData.category : undefined,
          imageId: uploadedImageId,
          seoMetaData:
            formData.seoTitle || formData.seoDescription
              ? {
                  title: formData.seoTitle || "",
                  description: formData.seoDescription || "",
                }
              : undefined,
        });

        showToast({
          type: "success",
          message: response.message || "Category updated successfully!",
          showClose: true,
        });
      }

      // ---- CREATE FLOW ----
      else {
        const response = await createCategory({
          name: formData.name,
          description: formData.description || undefined,
          status: "ACTIVE",
          categoryType,
          businessId,
          parentId: categoryType === "SUB" ? formData.category : undefined,
          seoMetaData:
            formData.seoTitle || formData.seoDescription
              ? {
                  title: formData.seoTitle || "",
                  description: formData.seoDescription || "",
                }
              : undefined,
        });

        newCategoryId = response.data?.data.id;

        if (!newCategoryId) {
          throw new Error("Failed to create category.");
        }

        // Upload image after create
        if (imageFile) {
          try {
            const uploadRes = await handleImageUpload(
              imageFile,
              role,
              newCategoryId
            );
            uploadedImageId = uploadRes?.id;

            if (uploadedImageId) {
              await updateCategory.updateCategory({
                id: newCategoryId,
                imageId: uploadedImageId,
                name: formData.name,
                businessId,
                categoryType,
              });
            }
          } catch (uploadError) {
            console.warn("Image upload failed after create:", uploadError);
          }
        }

        showToast({
          type: "success",
          message: response.data?.message || "Category created successfully!",
          showClose: true,
        });
      }

      resetForm();
      if (onSuccess) onSuccess();
      navigate("/seller/catalogue/categories");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to save category:", error);
      showToast({
        type: "error",
        message:
          error?.data?.message || "Something went wrong. Please try again.",
        showClose: true,
      });
    }
  };

  const handleImagePreview = (file: File) => {
    const localUrl = URL.createObjectURL(file);
    setImageUrl(localUrl);
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
              imageUrl={imageUrl}
              onImageFileChange={handleImagePreview}
              imageId={undefined}
              imageDiskName={data?.imageUrl}
            />
          </section>

          <section id="seo" className="scroll-mt-24">
            <SEOCategorySection />
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
