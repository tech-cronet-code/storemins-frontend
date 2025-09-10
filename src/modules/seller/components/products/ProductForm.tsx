// components/ProductForm/ProductForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../../common/utils/showToast";
import { useAuth } from "../../../auth/contexts/AuthContext";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../../auth/services/productApi";

import InventorySection from "./InventorySection";
import ProductFlagsSection from "./ProductFlagsSection";
import ProductInfoSection from "./ProductInfoSection";
import ProductMediaSection from "./ProductMediaSection";
import QuestionsSection from "./QuestionsSection";
import SEOSection from "./SEOSection";
import ShippingTaxSection from "./ShippingTaxSection";
import VariantsSection from "./VariantsSection";
import PostPurchaseNoteSection from "./PostPurchaseNoteSection";

import { ProductFormValues, productSchema } from "../../Schemas/productSchema";

interface ProductFormProps {
  productId?: string;
}

const LOG = "[ProductForm]";

/* ---------------- utils ---------------- */
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
    return obj.images
      .map((x: any) => (typeof x === "string" ? x : x?.url))
      .filter(Boolean)
      .map(String);
  }
  if (obj.data) return extractMediaTokens(obj.data);
  return [];
}

// very small deepEqual (good enough for our shapes)
const isObj = (v: any) => v && typeof v === "object" && !Array.isArray(v);
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  // allow "123" vs 123
  const isNumLike =
    (typeof a === "number" || typeof a === "string") &&
    (typeof b === "number" || typeof b === "string");
  if (isNumLike) return String(a) === String(b);

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }

  if (isObj(a) && isObj(b)) {
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    for (const k of ak) if (!deepEqual(a[k], (b as any)[k])) return false;
    return true;
  }

  return false;
}

// normalize questions for stable comparison
function normalizeQuestions(qs: NonNullable<ProductFormValues["questions"]>) {
  return (qs || []).map((q, i) => {
    const base: any = {
      order: typeof q.order === "number" ? q.order : i,
      prompt: q.prompt || "",
      answerType: q.answerType,
      isRequired: !!q.isRequired,
      maxFiles: q.maxFiles ?? null,
      maxSizeMB: q.maxSizeMB ?? null,
      imageId: q.imageId ?? null,
      metadata:
        q.metadata &&
        typeof q.metadata === "object" &&
        !Array.isArray(q.metadata)
          ? q.metadata
          : null,
    };

    const isChoice =
      q.answerType === "CHOICE_SINGLE" || q.answerType === "CHOICE_MULTI";

    if (isChoice) {
      const opts = (q.options || [])
        .filter((o) => o && String(o.label || "").trim())
        .slice(0, 10)
        .map((o, idx) => ({
          label: String(o.label).trim(),
          value:
            (o.value && String(o.value).trim()) ||
            String(o.label)
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-"),
          sortOrder: typeof o.sortOrder === "number" ? o.sortOrder : idx,
          isActive: o.isActive ?? true,
        }));

      base.options = opts;

      if (q.answerType === "CHOICE_SINGLE") {
        base.minSelect = 1;
        base.maxSelect = 1;
      } else {
        const len = opts.length;
        const min =
          q.minSelect == null ? 0 : Math.max(0, Math.min(len, q.minSelect));
        const max =
          q.maxSelect == null ? len : Math.max(min, Math.min(len, q.maxSelect));
        base.minSelect = min;
        base.maxSelect = max;
      }
    }

    return base;
  });
}

/* --------------- component --------------- */
const ProductForm: React.FC<ProductFormProps> = ({ productId }) => {
  const navigate = useNavigate();
  const { userDetails } = useAuth();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const { data: productRaw, isLoading: isFetchingProduct } =
    useGetProductByIdQuery(
      { id: productId! },
      { skip: !productId, refetchOnMountOrArgChange: true }
    );

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
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

      postPurchaseNoteDesc: null,

      replaceQuestions: false,
      questions: [],
    } as any,
  });

  const { handleSubmit, reset, control, trigger } = methods;

  // snapshot of hydrated values for diffing in edit mode
  const initialRef = useRef<ProductFormValues | null>(null);

  // live watchers to revalidate questions “required” logic
  const mustAnswer = useWatch({ control, name: "customerQuestionsRequired" });
  const questions = useWatch({ control, name: "questions" }) || [];
  useEffect(() => {
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

    const hydrated: ProductFormValues = {
      name: p?.name || "",
      categoryLinks,
      categoryName,
      price: p?.price != null ? String(p.price) : "",
      discountedPrice:
        p?.discountedPrice != null ? String(p.discountedPrice) : "",
      description: p?.description || "",
      stock: (p as any)?.stock ?? p?.quantity ?? undefined,
      sku: p?.sku ?? "",
      stockStatus: (p as any)?.stockStatus,
      shippingClass: "" as any,
      taxClass: "" as any,

      variants: p?.variants || undefined,

      images: undefined as any,
      mediaUrls: mediaTokens,

      seoTitle: p?.seoMetaData?.title || "",
      seoDescription: p?.seoMetaData?.description || "",
      seoImageUrl: p?.seoMetaData?.imageUrl || "",
      seoImage: undefined as any,

      shippingWeight: p?.shippingWeight ?? undefined,
      hsnCode: p?.hsnCode || "",
      gstPercent: p?.gstPercent ?? undefined,

      type: p?.type || "PHYSICAL",

      isRecommended: !!p?.isRecommended,
      customerQuestionsRequired: !!p?.customerQuestionsRequired,

      postPurchaseNoteDesc: p?.postPurchaseNoteDesc ?? null,

      replaceQuestions: false,
      questions: Array.isArray(p?.questions)
        ? p.questions.map((q: any, i: number) => ({
            order: typeof q.order === "number" ? q.order : i,
            prompt: q.prompt || "",
            answerType: q.answerType || "TEXT",
            isRequired: !!q.isRequired,
            options: Array.isArray(q.options)
              ? q.options.map((o: any, j: number) => ({
                  label: o.label,
                  value: o.value,
                  sortOrder: typeof o.sortOrder === "number" ? o.sortOrder : j,
                  isActive: o.isActive ?? true,
                }))
              : undefined,
            minSelect: q.minSelect ?? null,
            maxSelect: q.maxSelect ?? null,
            maxFiles: q.maxFiles ?? null,
            maxSizeMB: q.maxSizeMB ?? null,
            imageId: q.imageId ?? null,
            metadata:
              q.metadata &&
              typeof q.metadata === "object" &&
              !Array.isArray(q.metadata)
                ? q.metadata
                : null,
            isActive: true,
          }))
        : [],
    } as any;

    reset(hydrated as any, { keepDirty: false });
    initialRef.current = hydrated; // snapshot AFTER reset
  }, [productRaw, productId, reset]);

  /* ---------------- submit ---------------- */
  const onSubmit = async (data: ProductFormValues) => {
    try {
      const businessId = userDetails?.storeLinks?.[0]?.businessId;
      if (!businessId) {
        showToast({
          type: "error",
          message: "Business ID is missing!",
          showClose: true,
        });
        return;
      }

      const isEdit = !!productId;
      const initial = initialRef.current; // null in create mode
      const fd = new FormData();
      let changedSomething = false;

      // helpers
      const append = (k: string, v: any) =>
        fd.append(
          k,
          v instanceof Blob || typeof v === "string" ? v : JSON.stringify(v)
        );
      const changed = (
        key: keyof ProductFormValues,
        normalized?: (v: any) => any
      ) => {
        if (!isEdit || !initial) return true; // in create mode send all
        const cur = (data as any)[key];
        const was = (initial as any)[key];
        const a = normalized ? normalized(cur) : cur;
        const b = normalized ? normalized(was) : was;
        return !deepEqual(a, b);
      };
      const mark = (cond: boolean, key: string, val: any) => {
        if (!cond) return;
        append(key, val);
        changedSomething = true;
      };

      // required always
      append("businessId", businessId);
      if (isEdit) append("id", productId!);

      // --- scalars / strings ---
      mark(changed("name"), "name", data.name);
      mark(changed("price"), "price", String(data.price ?? ""));
      if (String(data.discountedPrice ?? "") !== "")
        mark(
          changed("discountedPrice"),
          "discountedPrice",
          String(data.discountedPrice)
        );
      mark(changed("description"), "description", data.description || "");
      if (data.stock != null && String(data.stock) !== "")
        mark(changed("stock"), "quantity", String(data.stock));
      if (data.sku) mark(changed("sku"), "sku", data.sku);
      if (data.shippingWeight != null && String(data.shippingWeight) !== "")
        mark(
          changed("shippingWeight"),
          "shippingWeight",
          String(data.shippingWeight)
        );
      if (data.hsnCode) mark(changed("hsnCode"), "hsnCode", data.hsnCode);
      if (data.gstPercent != null && String(data.gstPercent) !== "")
        mark(changed("gstPercent"), "gstPercent", String(data.gstPercent));
      if (data.type) mark(changed("type"), "type", data.type);

      // flags
      mark(
        changed("isRecommended"),
        "isRecommended",
        String(!!data.isRecommended)
      );
      mark(
        changed("customerQuestionsRequired"),
        "customerQuestionsRequired",
        String(!!data.customerQuestionsRequired)
      );

      // --- categories / variants ---
      mark(changed("categoryLinks"), "categoryLinks", data.categoryLinks ?? []);
      mark(changed("variants"), "variants", data.variants ?? undefined);

      // --- SEO ---
      const seoFiles = data.seoImage as unknown as FileList | undefined;
      const hasSeoFile = !!(seoFiles && seoFiles.length);
      if (hasSeoFile) {
        append("seoImage", seoFiles[0]);
        changedSomething = true;
      }
      const seoMetaChanged =
        hasSeoFile ||
        changed("seoTitle") ||
        changed("seoDescription") ||
        changed("seoImageUrl");
      if (seoMetaChanged) {
        append("seoMetaData", {
          title: data.seoTitle || "",
          description: data.seoDescription || "",
          imageUrl: hasSeoFile ? "" : data.seoImageUrl || "",
        });
        changedSomething = true;
      }

      // --- Media tokens (edit) & new uploads ---
      const keptTokens = (data.mediaUrls || []) as string[];
      if (isEdit) {
        const normalizeMedia = (arr: string[]) =>
          (arr || []).map((u, i) => ({ type: "IMAGE", url: u, order: i }));
        const oldTokens = normalizeMedia(initial?.mediaUrls || []);
        const newTokens = normalizeMedia(keptTokens);
        if (!deepEqual(oldTokens, newTokens)) {
          append("media", newTokens);
          changedSomething = true;
        }
      }

      const images = data.images as unknown as FileList | undefined;
      if (images && images.length) {
        Array.from(images).forEach((f) => fd.append("images", f));
        changedSomething = true;
      }

      // --- Post purchase note ---
      if (
        !isEdit ||
        !deepEqual(initial?.postPurchaseNoteDesc, data.postPurchaseNoteDesc)
      ) {
        if (data.postPurchaseNoteDesc != null) {
          append("postPurchaseNoteDesc", String(data.postPurchaseNoteDesc));
          changedSomething = true;
        }
      }

      // --- Questions ---
      const nowQs = normalizeQuestions(data.questions || []);
      const oldQs = normalizeQuestions(initial?.questions || []);
      const sendQuestions =
        !isEdit ||
        !deepEqual(oldQs, nowQs) ||
        data.replaceQuestions === true ||
        data.customerQuestionsRequired === true;

      if (sendQuestions) {
        const clean = nowQs.filter((q) => q && q.prompt && q.answerType);
        append("questions", clean);
        changedSomething = true;
      }

      // --- final guard ---
      if (isEdit && !changedSomething) {
        showToast({
          type: "info",
          message: "No changes to update.",
          showClose: true,
        });
        return;
      }

      // --- submit ---
      if (isEdit) {
        await updateProduct(fd).unwrap();
        showToast({
          type: "success",
          message: "Product updated successfully!",
          showClose: true,
        });
      } else {
        await createProduct(fd).unwrap();
        showToast({
          type: "success",
          message: "Product created successfully!",
          showClose: true,
        });
      }

      navigate("/seller/catalogue/products/physical", {
        state: { refresh: true },
      });
    } catch (err: any) {
      console.error(LOG, "submit error", err);
      showToast({
        type: "error",
        message: err?.data?.message || "Failed to save product!",
        showClose: true,
      });
    }
  };

  const isSubmitting = isCreating || isUpdating;
  if (isFetchingProduct && productId)
    return <div>Loading product details...</div>;

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

        <section id="post-purchase-note" className="scroll-mt-24">
          <PostPurchaseNoteSection />
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
