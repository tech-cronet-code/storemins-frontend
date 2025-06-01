import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import CategoriesInfoSection from "./CategoriesInfoSection";
import SEOCategorySection from "./SEOCategorySection";
import { useSellerProduct } from "../../hooks/useSellerProduct"; // 👈 hook for createCategory
import { useAuth } from "../../../auth/contexts/AuthContext"; // 👈 get userDetails
import { showToast } from "../../../../common/utils/showToast";
import { CategoriesSchema } from "../../Schemas/CategoriesSchema";

type CategoriesFormValues = z.infer<typeof CategoriesSchema>;

const CategoriesForm: React.FC = () => {
  const { createCategory } = useSellerProduct();
  const { userDetails } = useAuth();

  const methods = useForm<CategoriesFormValues>({
    resolver: zodResolver(CategoriesSchema),
    mode: "onChange", // 💡 Real-time validation
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

  const { isValid, isSubmitting } = methods.formState;

  const onSubmit = async (data: CategoriesFormValues) => {
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
        name: data.name,
        description: data.description || undefined,
        status: "ACTIVE" as const,
        categoryType: data.isSubcategory
          ? ("SUB" as const)
          : ("PARENT" as const),
        businessId,
        parentId: data.isSubcategory ? data.category : undefined,
        seoMetaData:
          data.seoTitle || data.seoDescription
            ? {
                title: data.seoTitle || "",
                description: data.seoDescription || "",
              }
            : undefined,
        imageId: undefined,
      };

      console.log("🚀 Payload sending to API:", payload);

      const response = await createCategory(payload).unwrap();

      showToast({
        type: "success",
        message: response.message || "Category created successfully!",
        showClose: true,
      });

      methods.reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Something went wrong. Please try again.";
      console.error("Failed to create category:", error);

      showToast({
        type: "error",
        message: errorMessage,
        showClose: true,
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-10">
        <section id="categories-info" className="scroll-mt-24">
          <CategoriesInfoSection />
        </section>

        <section id="seo" className="scroll-mt-24">
          <SEOCategorySection />
        </section>
        <div className="flex justify-end mt-6 pb-15 pt-1">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding..." : "Add Categories"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default CategoriesForm;
