import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ProductFormValues, productSchema } from "../../Schemas/productSchema";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../../auth/services/productApi";
import { showToast } from "../../../../common/utils/showToast";

import InventorySection from "./InventorySection";
import ProductMediaSection from "./ProductMediaSection";
import SEOSection from "./SEOSection";
import VariantsSection from "./VariantsSection";
import ShippingTaxSection from "./ShippingTaxSection";
import ProductInfoSection from "./ProductInfoSection";
import { useAuth } from "../../../auth/contexts/AuthContext";

interface ProductFormProps {
  productId?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ productId }) => {
  const navigate = useNavigate();
  const { userDetails } = useAuth();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const { data: product, isLoading: isFetchingProduct } =
    useGetProductByIdQuery(
      { id: productId! },
      {
        skip: !productId,
        refetchOnMountOrArgChange: true,
      }
    );

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      categoryLinks: [],
      categoryName: "",
      price: "",
      discountedPrice: "",
      description: "",
      stock: undefined,
      sku: undefined,
      stockStatus: undefined,
      shippingClass: undefined,
      taxClass: undefined,
      variant: undefined,
      images: undefined,
      video: undefined,
    },
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (product && productId) {
      const categoryLinks = product.categoryLinks || [];

      const categoryName = categoryLinks
        .map((link) => link.subCategoryName || link.parentCategoryName)
        .filter(Boolean)
        .join(", ");

      reset({
        name: product.name,
        categoryLinks,
        categoryName,
        price: product.price?.toString() || "",
        discountedPrice: product.discountedPrice?.toString() || "",
        description: product.description || "",
        stock: product.stock || 0,
        sku: product.sku || "",
        stockStatus: product.stockStatus,
        shippingClass: product.shippingClass,
        taxClass: product.taxClass,
        variant: product.variant,

        seoTitle: product.seoMetaData?.title || "",
        seoDescription: product.seoMetaData?.description || "",
        seoImageUrl: product.seoMetaData?.imageUrl || "",
      });
    }
  }, [product, productId, reset]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const { images, video, ...rest } = data;

      const formData = new FormData();
      formData.append("name", rest.name);
      formData.append("price", parseFloat(rest.price).toString());

      if (rest.discountedPrice) {
        formData.append(
          "discountedPrice",
          parseFloat(rest.discountedPrice).toString()
        );
      }

      if (rest.description) formData.append("description", rest.description);
      if (rest.stock !== undefined)
        formData.append("quantity", rest.stock.toString());
      if (rest.stockStatus) formData.append("stockStatus", rest.stockStatus);
      if (rest.shippingClass)
        formData.append("shippingClass", rest.shippingClass);
      if (rest.taxClass) formData.append("taxClass", rest.taxClass);

      if (rest.sku) formData.append("sku", rest.sku);
      if (rest.shippingWeight !== undefined)
        formData.append("shippingWeight", rest.shippingWeight.toString());
      if (rest.hsnCode) formData.append("hsnCode", rest.hsnCode);
      if (rest.gstPercent !== undefined)
        formData.append("gstPercent", rest.gstPercent.toString());
      if (rest.type) formData.append("type", rest.type);

      if (rest.categoryLinks && rest.categoryLinks.length > 0) {
        formData.append("categoryLinks", JSON.stringify(rest.categoryLinks));
      }

      // ✅ Variants
      if (rest.variant && rest.variant.length > 0) {
        formData.append("variants", JSON.stringify(rest.variant));
      }

      // ✅ SEO
      if (
        rest.seoTitle ||
        rest.seoDescription ||
        rest.seoImage ||
        rest.seoImageUrl
      ) {
        let imageUrl = rest.seoImageUrl || "";

        // If a new file is selected (not a string), upload it
        if (
          rest.seoImage &&
          rest.seoImage instanceof File &&
          rest.seoImage.size > 0
        ) {
          formData.append("seoImage", rest.seoImage); // for backend to store
          imageUrl = ""; // backend will generate and set the imageUrl
        }

        const seoMetaData = {
          title: rest.seoTitle || "",
          description: rest.seoDescription || "",
          imageUrl: imageUrl, // optional
        };
        formData.append("seoMetaData", JSON.stringify(seoMetaData));
      }

      // ✅ Media
      if (images && images instanceof FileList) {
        Array.from(images).forEach((file) => {
          formData.append("images", file);
        });
      }

      if (video && video instanceof FileList && video.length > 0) {
        formData.append("video", video[0]);
      }

      const businessId = userDetails?.storeLinks?.[0]?.businessId;
      if (!businessId) {
        showToast({
          type: "error",
          message: "Business ID is missing!",
          showClose: true,
        });
        return;
      }
      formData.append("businessId", businessId);

      if (productId) {
        formData.append("id", productId);
        await updateProduct(formData).unwrap();
        showToast({
          type: "success",
          message: "Product updated successfully!",
          showClose: true,
        });
      } else {
        await createProduct(formData).unwrap();
        showToast({
          type: "success",
          message: "Product created successfully!",
          showClose: true,
        });
      }

      navigate("/seller/catalogue/products", { state: { refresh: true } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showToast({
        type: "error",
        message: error?.data?.message || "Failed to save product!",
        showClose: true,
      });
    }
  };

  const isSubmitting = isCreating || isUpdating;

  if (isFetchingProduct && productId) {
    return <div>Loading product details...</div>;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
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
