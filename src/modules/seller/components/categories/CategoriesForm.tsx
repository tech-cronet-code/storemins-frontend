import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { CategoriesSchema } from "../../Schemas/CategoriesSchema";
import CategoriesInfoSection from "./CategoriesInfoSection";
import SEOCategorySection from "./SEOCategorySection";

type CategoriesFormValues = z.infer<typeof CategoriesSchema>;

const CategoriesForm: React.FC = () => {
    const methods = useForm<CategoriesFormValues>({
        resolver: zodResolver(CategoriesSchema),
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

    console.log("CategoriesForm");

    const onSubmit = (data: CategoriesFormValues) => {
        console.log("✅ Submitted:", data);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-10">
                <section id="categories-info" className="scroll-mt-24">

                    <CategoriesInfoSection />
                </section>

                {/* <section id="Categories-media" className="scroll-mt-24">
          <CategoriesMediaSection />
        </section>

        <section id="inventory" className="scroll-mt-24">
          <InventorySection />
        </section>

        <section id="shipping-tax" className="scroll-mt-24">
          <ShippingTaxSection />
        </section>

        <section id="variants" className="scroll-mt-24">
          <VariantsSection />
        </section>

       */}
                <section id="seo" className="scroll-mt-24">
                    <SEOCategorySection />
                </section>
                <div className="flex justify-end mt-6 pb-15 pt-1">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm hover:bg-blue-700"
                    >
                        Add Categories
                    </button>
                </div>
            </form>
        </FormProvider>
    );
};

export default CategoriesForm;
