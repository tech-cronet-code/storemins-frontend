import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate
import { productSchema } from "../../Schemas/productSchema";
import {
  useCreateProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
} from "../../../auth/services/productApi";
import { showToast } from "../../../../common/utils/showToast";
import InventorySection from "./InventorySection";
import ProductMediaSection from "./ProductMediaSection";
import SEOSection from "./SEOSection";
import VariantsSection from "./VariantsSection";
import ShippingTaxSection from "./ShippingTaxSection";
import ProductInfoSection from "./ProductInfoSection";

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  productId?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ productId }) => {
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const navigate = useNavigate();
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

  // 🟢 Fetch existing product if in edit mode
  const { data: productData, isLoading: isFetching } = useGetProductQuery(
    { id: productId! },
    { skip: !productId }
  );

  useEffect(() => {
    if (productData) {
      methods.reset({
        ...productData,
        price: productData.price.toString(),
        discountPrice: productData.discountPrice?.toString() || "",
      });
    }
  }, [productData, methods]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const payload = {
        ...data,
        price: parseFloat(data.price),
        discountPrice: data.discountPrice
          ? parseFloat(data.discountPrice)
          : undefined,
        stock: data.stock,
        stockStatus: data.stockStatus,
        shippingClass: data.shippingClass,
        taxClass: data.taxClass,
        variant: data.variant,
        images: data.images ? Array.from(data.images as FileList) : [],
        video: data.video ? (data.video as FileList)[0] : undefined,
      };

      if (productId) {
        await updateProduct({ ...payload, id: productId }).unwrap();
        showToast({
          type: "success",
          message: "Product updated successfully",
          showClose: true,
        });
      } else {
        await createProduct(payload).unwrap();
        showToast({
          type: "success",
          message: "Product added successfully",
          showClose: true,
        });
      }

      setTimeout(() => {
        navigate("/seller/catalogue/products");
      }, 1000);
    } catch (error) {
      console.error("❌ Product submission failed", error);

      showToast({
        type: "error",
        message: "Failed to submit product. Please try again.",
        showClose: true,
      });
    }
  };

  if (isFetching) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-10">
        {/* Sections */}
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
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? productId
                ? "Updating..."
                : "Saving..."
              : productId
              ? "Update Product"
              : "Add Product"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ProductForm;
