import React, { useEffect } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/contexts/AuthContext";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../../auth/services/productApi";
import { showToast } from "../../../../common/utils/showToast";

import ProductMediaSection from "./ProductMediaSection";
import ProductInfoSection from "./ProductInfoSection";
import InventorySection from "./InventorySection";
import ShippingTaxSection from "./ShippingTaxSection";
import VariantsSection from "./VariantsSection";
import SEOSection from "./SEOSection";
import ProductFlagsSection from "./ProductFlagsSection";
import QuestionsSection from "./QuestionsSection";

import { ProductFormValues, productSchema } from "../../Schemas/productSchema";

interface ProductFormProps {
  productId?: string;
}

const LOG = "[ProductForm]";

function unwrapProduct(p: any): any {
  if (!p) return p;
  if (p.data && typeof p.data === "object") return unwrapProduct(p.data);
  return p;
}

function extractMediaTokens(obj: any): string[] {
  if (!obj) return [];
  if (Array.isArray(obj.media)) {
    return obj.media
      .slice()
      .sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0))
      .map((m: any) => String(m.url))
      .filter(Boolean);
  }
  if (Array.isArray(obj.images)) {
    return obj.images.map((x: any) => (typeof x === "string" ? x : x?.url)).filter(Boolean).map(String);
  }
  if (obj.data) return extractMediaTokens(obj.data);
  return [];
}

const ProductForm: React.FC<ProductFormProps> = ({ productId }) => {
  const navigate = useNavigate();
  const { userDetails } = useAuth();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const { data: productRaw, isLoading: isFetchingProduct } = useGetProductByIdQuery(
    { id: productId! },
    { skip: !productId, refetchOnMountOrArgChange: true }
  );

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: "onChange",         // real-time validation
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      categoryLinks: [],
      categoryName: "",
      price: "",
      discountedPrice: "",
      description: "",
      stock: undefined,
      sku: "",
      stockStatus: undefined,
      shippingClass: undefined,
      taxClass: undefined,
      variants: undefined,

      images: undefined as any,
      mediaUrls: [],

      seoTitle: "",
      seoDescription: "",
      seoImageUrl: "",
      seoImage: undefined as any,

      shippingWeight: undefined,
      hsnCode: "",
      gstPercent: undefined,

      type: "PHYSICAL",

      isRecommended: false,
      customerQuestionsRequired: false,

      replaceQuestions: false,
      questions: [],
    } as any,
  });

  const { handleSubmit, reset, control, trigger } = methods;

  // live watchers for instant "questions" validation
  const mustAnswer = useWatch({ control, name: "customerQuestionsRequired" });
  const questions = useWatch({ control, name: "questions" }) || [];

  useEffect(() => {
    // revalidate only the "questions" field when toggle/length changes
    void trigger("questions");
  }, [mustAnswer, questions.length, trigger]);

  // hydrate in edit mode
  useEffect(() => {
    if (!productId || !productRaw) return;

    const p = unwrapProduct(productRaw);
    const mediaTokens = extractMediaTokens(p);

    const categoryLinks = p?.categoryLinks || [];
    const categoryName = categoryLinks
      .map((l: any) => l?.subCategoryName || l?.parentCategoryName)
      .filter(Boolean)
      .join(", ");

    reset({
      name: p?.name || "",
      categoryLinks,
      categoryName,
      price: p?.price != null ? String(p.price) : "",
      discountedPrice: p?.discountedPrice != null ? String(p.discountedPrice) : "",
      description: p?.description || "",
      stock: (p as any)?.stock ?? p?.quantity ?? undefined,
      sku: p?.sku ?? "",
      stockStatus: (p as any)?.stockStatus,
      shippingClass: "",
      taxClass: "",

      variants: p?.variants || undefined,

      images: undefined as any,
      mediaUrls: mediaTokens,

      seoTitle: p?.seoMetaData?.title || "",
      seoDescription: p?.seoMetaData?.description || "",
      seoImageUrl: p?.seoMetaData?.imageUrl || "",

      shippingWeight: p?.shippingWeight ?? undefined,
      hsnCode: p?.hsnCode || "",
      gstPercent: p?.gstPercent ?? undefined,

      type: p?.type || "PHYSICAL",

      isRecommended: !!p?.isRecommended,
      customerQuestionsRequired: !!p?.customerQuestionsRequired,

      replaceQuestions: false,
      questions: Array.isArray(p?.questions)
        ? p.questions.map((q: any, i: number) => ({
            order: typeof q.order === "number" ? q.order : i,
            prompt: q.prompt || "",
            answerType: q.answerType || "TEXT",
            isRequired: !!q.isRequired,
            maxFiles: q.maxFiles ?? null,
            maxSizeMB: q.maxSizeMB ?? null,
            metadata: q.metadata && typeof q.metadata === "object" && !Array.isArray(q.metadata) ? q.metadata : null,
            isActive: true,
          }))
        : [],
    } as any);
  }, [productRaw, productId, reset]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const businessId = userDetails?.storeLinks?.[0]?.businessId;
      if (!businessId) {
        showToast({ type: "error", message: "Business ID is missing!", showClose: true });
        return;
      }

      const fd = new FormData();
      fd.append("businessId", businessId);
      fd.append("name", data.name);

      // numeric fields
      fd.append("price", String(data.price ?? ""));
      if (String(data.discountedPrice ?? "") !== "") fd.append("discountedPrice", String(data.discountedPrice));
      if (data.description) fd.append("description", data.description);
      if (data.stock != null && String(data.stock) !== "") fd.append("quantity", String(data.stock));
      if (data.sku) fd.append("sku", data.sku);
      if (data.shippingWeight != null && String(data.shippingWeight) !== "")
        fd.append("shippingWeight", String(data.shippingWeight));
      if (data.hsnCode) fd.append("hsnCode", data.hsnCode);
      if (data.gstPercent != null && String(data.gstPercent) !== "") fd.append("gstPercent", String(data.gstPercent));
      if (data.type) fd.append("type", data.type);

      // flags
      fd.append("isRecommended", String(!!data.isRecommended));
      fd.append("customerQuestionsRequired", String(!!data.customerQuestionsRequired));

      // categories
      if (data.categoryLinks !== undefined) {
        fd.append("categoryLinks", JSON.stringify(data.categoryLinks));
      }

      // variants
      if (data.variants !== undefined) {
        fd.append("variants", JSON.stringify(data.variants));
      }

      // SEO
      const seoFiles = data.seoImage as unknown as FileList | undefined;
      const hasSeoFile = !!(seoFiles && seoFiles.length);
      if (hasSeoFile) fd.append("seoImage", seoFiles[0]);
      if (data.seoTitle || data.seoDescription || data.seoImageUrl || hasSeoFile) {
        fd.append(
          "seoMetaData",
          JSON.stringify({
            title: data.seoTitle || "",
            description: data.seoDescription || "",
            imageUrl: hasSeoFile ? "" : data.seoImageUrl || "",
          })
        );
      }

      // gallery kept tokens (edit)
      const keptTokens = (data.mediaUrls || []) as string[];
      if (productId) {
        fd.append("media", JSON.stringify(keptTokens.map((u, i) => ({ type: "IMAGE", url: u, order: i }))));
      }

      // new uploads
      const files = data.images as unknown as FileList | undefined;
      if (files && files.length) Array.from(files).forEach((f) => fd.append("images", f));

      // questions payload
      const shouldSendQuestions = !productId
        ? (data.questions?.length ?? 0) > 0 || data.customerQuestionsRequired === true
        : data.replaceQuestions === true;

      if (shouldSendQuestions) {
        const clean = (data.questions || [])
          .filter((q) => q && q.prompt && q.answerType)
          .map((q, i) => ({
            order: typeof q.order === "number" ? q.order : i,
            prompt: q.prompt,
            answerType: q.answerType,
            isRequired: !!q.isRequired,
            maxFiles: q.maxFiles ?? null,
            maxSizeMB: q.maxSizeMB ?? null,
            metadata:
              q.metadata && typeof q.metadata === "object" && !Array.isArray(q.metadata) ? q.metadata : null,
          }));
        fd.append("questions", JSON.stringify(clean));
      }

      if (productId) {
        fd.append("id", productId);
        await updateProduct(fd).unwrap();
        showToast({ type: "success", message: "Product updated successfully!", showClose: true });
      } else {
        await createProduct(fd).unwrap();
        showToast({ type: "success", message: "Product created successfully!", showClose: true });
      }

      navigate("/seller/catalogue/products", { state: { refresh: true } });
    } catch (err: any) {
      console.error(LOG, "submit error", err);
      showToast({ type: "error", message: err?.data?.message || "Failed to save product!", showClose: true });
    }
  };

  const isSubmitting = isCreating || isUpdating;
  if (isFetchingProduct && productId) return <div>Loading product details...</div>;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section id="product-media" className="scroll-mt-24">
          <ProductMediaSection />
        </section>

        <section id="product-info" className="scroll-mt-24">
          <ProductInfoSection />
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

        <section id="product-flags" className="scroll-mt-24">
          <ProductFlagsSection isEdit={!!productId} />
        </section>

        <section id="product-questions" className="scroll-mt-24">
          <QuestionsSection />
        </section>

        <div className="flex justify-end mt-6 pb-15 pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (productId ? "Updating..." : "Saving...") : productId ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ProductForm;
