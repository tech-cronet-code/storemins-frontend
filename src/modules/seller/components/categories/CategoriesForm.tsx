import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import CategoriesInfoSection from "./CategoriesInfoSection";
import SEOCategorySection from "./SEOCategorySection";
import { useSellerProduct } from "../../hooks/useSellerProduct";
import { useAuth } from "../../../auth/contexts/AuthContext";
import { showToast } from "../../../../common/utils/showToast";
import { CategoriesSchema } from "../../Schemas/CategoriesSchema";
import { useNavigate } from "react-router-dom";
import HeaderSubmitButton from "./HeaderButton";

type CategoriesFormValues = z.infer<typeof CategoriesSchema>;

interface CategoriesFormProps {
  categoryId?: string; // 📝 For Edit Mode
  type?: string;
  onSuccess?: () => void; // ✅ On Save Success
}

const CategoriesForm: React.FC<CategoriesFormProps> = ({
  categoryId,
  type,
  onSuccess,
}) => {
  const navigate = useNavigate();

  const { createCategory, updateCategory, getCategory } = useSellerProduct(); // CRUD APIs
  const { userDetails } = useAuth(); // User Info

  const methods = useForm<CategoriesFormValues>({
    resolver: zodResolver(CategoriesSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      isSubcategory: false,
      image: undefined,
      bannerDesktop: undefined,
      bannerMobile: undefined,
      description: "",
      seoTitle: "",
      seoDescription: "",
      seoImage: undefined,
    },
  });

  //   const { isValid, isSubmitting } = methods.formState;
  const { reset: resetForm } = methods;

  // 👇 Lazy Query for Get Category (one-time)
  const {
    getCategory: fetchCategory,
    data,
    isError,
    error,
    isLoading,
  } = getCategory;
  // 👇 Fetch Category on Mount
  useEffect(() => {
    if (categoryId && type) {
      const categoryType = type === "PARENT" ? "PARENT" : "SUB";
      fetchCategory(categoryId, categoryType);
    }
    // 👇 fetchCategory ko dependency se hatao
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, type]);

  // 👇 Reset form with fetched data
  useEffect(() => {
    if (data) {
      resetForm({
        name: data.name || "",
        description: data.description || "",
        isSubcategory: data.categoryType === "SUB",
        seoTitle: data.seoMetaData?.title || "",
        seoDescription: data.seoMetaData?.description || "",
      });
    }
  }, [data, resetForm]);

  // 👇 Show error toast
  useEffect(() => {
    if (isError && error) {
      showToast({
        type: "error",
        message: "Failed to load category details.",
        showClose: true,
      });
    }
  }, [isError, error]);

  // 👇 Form Submit Handler
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

      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        status: "ACTIVE" as const,
        categoryType: formData.isSubcategory
          ? ("SUB" as const)
          : ("PARENT" as const),
        businessId,
        parentId: formData.isSubcategory ? formData.category : undefined,
        seoMetaData:
          formData.seoTitle || formData.seoDescription
            ? {
                title: formData.seoTitle || "",
                description: formData.seoDescription || "",
              }
            : undefined,
        imageId: undefined,
      };

      if (categoryId) {
        // ✅ Update Mode
        const response = await updateCategory.updateCategory({
          ...payload,
          id: categoryId,
        });
        showToast({
          type: "success",
          message: response.message || "Category updated successfully!",
          showClose: true,
        });
      } else {
        // ➕ Create Mode
        const response = await createCategory(payload);
        showToast({
          type: "success",
          message: response.data?.message || "Category created successfully!",
          showClose: true,
        });
      }

      resetForm(); // Reset Form
      if (onSuccess) {
        onSuccess();
      }
      navigate("/seller/catalogue/categories"); // 👈 redirects to main listing

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Something went wrong. Please try again.";
      console.error("Failed to save category:", error);

      showToast({
        type: "error",
        message: errorMessage,
        showClose: true,
      });
    }
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
