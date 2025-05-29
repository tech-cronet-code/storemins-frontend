import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import ProductInfoSection from "./ProductInfoSection";
import ProductMediaSection from "./ProductMediaSection";
import InventorySection from "./InventorySection";
import ShippingTaxSection from "./ShippingTaxSection";
import VariantsSection from "./VariantsSection";
import SEOSection from "./SEOSection";
import { productSchema } from "../../Schemas/productSchema";

type ProductFormValues = z.infer<typeof productSchema>;

const ProductForm: React.FC = () => {
  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      price: "",
      discountPrice: "",
      description: "",
      stock: 0,
      stockStatus: "in_stock",
      shippingClass: "standard",
      taxClass: "gst",
      variant: "",
    },
  });
  console.log("ProductForm");

  const onSubmit = (data: ProductFormValues) => {
    console.log("✅ Submitted:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-10">
        <section id="product-info" className="scroll-mt-24">
          <ProductInfoSection />
        </section>

        <section id="product-media" className="scroll-mt-24">
          <ProductMediaSection />
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

        <section id="seo" className="scroll-mt-24">
          <SEOSection />
        </section>
        <div className="flex justify-end mt-6 pb-15 pt-1">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ProductForm;
