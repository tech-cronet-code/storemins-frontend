// src/modules/seller/components/products/DigitalProductForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../../common/utils/showToast";
import { useSellerAuth } from "../../../auth/contexts/SellerAuthContext";
import {
  useCreateDigitalProductMutation,
  useGetProductByIdQuery,
  useUpdateDigitalProductMutation,
} from "../../../auth/services/productApi";

import InventorySection from "./InventorySection";
import ProductFlagsSection from "./ProductFlagsSection";
import ProductInfoSection from "./ProductInfoSection";
import ProductMediaSection from "./ProductMediaSection";
import QuestionsSection from "./QuestionsSection";
import SEOSection from "./SEOSection";
import PostPurchaseNoteSection from "./PostPurchaseNoteSection";
import DigitalAssetSection from "./DigitalAssetSection";

import {
  DigitalProductFormValues,
  digitalProductSchema,
} from "../../Schemas/digitalProductSchema";

interface DigitalProductFormProps {
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
    return obj.images
      .map((x: any) => (typeof x === "string" ? x : x?.url))
      .filter(Boolean)
      .map(String);
  }
  if (obj.data) return extractMediaTokens(obj.data);
  return [];
}

// simple slug util for CHOICE option values
const slug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const DigitalProductForm: React.FC<DigitalProductFormProps> = ({
  productId,
}) => {
  const navigate = useNavigate();
  const { userDetails } = useSellerAuth();

  const [createDigital, { isLoading: isCreating }] =
    useCreateDigitalProductMutation();
  const [updateDigital, { isLoading: isUpdating }] =
    useUpdateDigitalProductMutation();

  const { data: productRaw, isLoading: isFetchingProduct } =
    useGetProductByIdQuery(
      { id: productId! },
      { skip: !productId, refetchOnMountOrArgChange: true }
    );

  const methods = useForm<DigitalProductFormValues>({
    resolver: zodResolver(digitalProductSchema),
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

      type: "DIGITAL",

      isRecommended: false,
      customerQuestionsRequired: false,

      postPurchaseNoteDesc: null,

      replaceQuestions: false,
      questions: [],

      // Digital asset fields
      digitalAssetMode: "none",
      digitalAssetUrl: null,
      digitalAssetUrls: [], // multi-link
      digitalAssetFile: undefined as any, // FileList handled in section

      // preview-only full asset objects from server
      digitalAssetExisting: [] as any[],
    } as any,
  });

  const { handleSubmit, reset, control, trigger } = methods;

  // live watchers for instant "questions" validation
  const mustAnswer = useWatch({ control, name: "customerQuestionsRequired" });
  const questions = useWatch({ control, name: "questions" }) || [];

  useEffect(() => {
    void trigger("questions");
  }, [mustAnswer, questions.length, trigger]);

  // hydrate in edit mode
  useEffect(() => {
    if (!productId || !productRaw) return;

    console.log(productRaw, "productRaw");

    const p = unwrapProduct(productRaw);
    const mediaTokens = extractMediaTokens(p);

    const categoryLinks = p?.categoryLinks || [];
    const categoryName = categoryLinks
      .map((l: any) => l?.subCategoryName || l?.parentCategoryName)
      .filter(Boolean)
      .join(", ");

    // legacy link fields
    const existingUrls = Array.isArray(p?.digitalAssetUrls)
      ? p.digitalAssetUrls
      : typeof p?.digitalAssetUrl === "string" && p.digitalAssetUrl.trim()
      ? [p.digitalAssetUrl.trim()]
      : [];

    // pull digital asset objects from p.digital.assets
    const digitalAssets = Array.isArray(p?.digital?.assets)
      ? p.digital.assets
      : [];

    console.log("[Form hydrate] p.digital.assets =>", digitalAssets);

    // Keep the full asset objects instead of just tokens
    const assetObjects = digitalAssets.map((asset: any) => ({
      fileId: asset.fileId || null,
      externalUrl: asset.externalUrl || null,
      title: asset.title || "",
      sortOrder: asset.sortOrder || 0,
    }));

    console.log("[Form hydrate] assetObjects =>", assetObjects);

    const assetExternalLinks: string[] = digitalAssets
      .filter(
        (a: any) => typeof a?.externalUrl === "string" && a.externalUrl.trim()
      )
      .map((a: any) => a.externalUrl.trim());

    const mergedLinks = Array.from(
      new Set([...(existingUrls as string[]), ...assetExternalLinks])
    );

    reset({
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

      type: p?.type || "DIGITAL",

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

            // CHOICE
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

            // FILE_UPLOAD
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

      // digital assets
      digitalAssetMode: "none",
      digitalAssetUrl: mergedLinks[0] ?? null,
      digitalAssetUrls: mergedLinks,
      digitalAssetFile: undefined as any,

      // edit previews - pass the full asset objects
      digitalAssetExisting: assetObjects,
    } as any);
  }, [productRaw, productId, reset]);

  const onSubmit = async (data: DigitalProductFormValues) => {
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

      const fd = new FormData();
      fd.append("businessId", businessId);
      fd.append("name", data.name);

      // numbers
      fd.append("price", String(data.price ?? ""));
      if (String(data.discountedPrice ?? "") !== "")
        fd.append("discountedPrice", String(data.discountedPrice));
      if (data.description) fd.append("description", data.description);
      if (data.stock != null && String(data.stock) !== "")
        fd.append("quantity", String(data.stock));
      if (data.sku) fd.append("sku", data.sku);
      if (data.shippingWeight != null && String(data.shippingWeight) !== "")
        fd.append("shippingWeight", String(data.shippingWeight));
      if (data.hsnCode) fd.append("hsnCode", data.hsnCode);
      if (data.gstPercent != null && String(data.gstPercent) !== "")
        fd.append("gstPercent", String(data.gstPercent));
      if (data.type) fd.append("type", data.type);

      // post purchase note
      if (data.postPurchaseNoteDesc != null) {
        fd.append("postPurchaseNoteDesc", String(data.postPurchaseNoteDesc));
      }

      // flags
      fd.append("isRecommended", String(!!data.isRecommended));
      fd.append(
        "customerQuestionsRequired",
        String(!!data.customerQuestionsRequired)
      );

      // categories
      if (data.categoryLinks !== undefined) {
        fd.append("categoryLinks", JSON.stringify(data.categoryLinks));
      }

      // variants
      if (data.variants !== undefined) {
        fd.append("variants", JSON.stringify(data.variants));
      }

      /* ---------------- DIGITAL ASSETS (files + links together) ---------------- */
      const maxBytes = 30 * 1024 * 1024; // 30MB per file

      // files
      const pickedRaw = data.digitalAssetFile as unknown as
        | FileList
        | File[]
        | undefined;
      const pickedFiles: File[] = pickedRaw
        ? Array.isArray(pickedRaw)
          ? pickedRaw
          : Array.from(pickedRaw)
        : [];

      if (pickedFiles.length) {
        for (const f of pickedFiles) {
          if (f.size > maxBytes) {
            showToast({
              type: "error",
              message: `Digital asset "${f.name}" must be 30 MB or less.`,
              showClose: true,
            });
            return;
          }
        }
        // append all files under the same key (backend FileFieldsInterceptor)
        for (const f of pickedFiles) {
          fd.append("digitalAssets", f);
        }
      }

      // links (multi) -> **digitalAssets JSON** expected by backend
      const urls = Array.isArray(data.digitalAssetUrls)
        ? data.digitalAssetUrls
        : [];
      const single =
        typeof data.digitalAssetUrl === "string" && data.digitalAssetUrl.trim()
          ? data.digitalAssetUrl
              .split(/[\n,]+/)
              .map((x) => x.trim())
              .filter(Boolean)
          : [];
      const allUrls = Array.from(new Set([...(urls || []), ...single]));
      if (allUrls.length) {
        const linkPayload = allUrls.map((u, i) => ({
          externalUrl: u,
          sortOrder: i,
        }));
        fd.append("digitalAssets", JSON.stringify(linkPayload));
      }

      // SEO
      const seoFiles = data.seoImage as unknown as FileList | undefined;
      const hasSeoFile = !!(seoFiles && seoFiles.length);
      if (hasSeoFile) fd.append("seoImage", seoFiles[0]);
      if (
        data.seoTitle ||
        data.seoDescription ||
        data.seoImageUrl ||
        hasSeoFile
      ) {
        fd.append(
          "seoMetaData",
          JSON.stringify({
            title: data.seoTitle || "",
            description: data.seoDescription || "",
            imageUrl: hasSeoFile ? "" : data.seoImageUrl || "",
          })
        );
      }

      // gallery tokens (edit)
      const keptTokens = (data.mediaUrls || []) as string[];
      if (productId) {
        fd.append(
          "media",
          JSON.stringify(
            keptTokens.map((u, i) => ({ type: "IMAGE", url: u, order: i }))
          )
        );
      }

      // new uploads (product gallery)
      const galleryFiles = data.images as unknown as FileList | undefined;
      if (galleryFiles && galleryFiles.length)
        Array.from(galleryFiles).forEach((f) => fd.append("images", f));

      // questions payload
      const shouldSendQuestions =
        (data.questions?.length ?? 0) > 0 ||
        data.customerQuestionsRequired === true ||
        data.replaceQuestions === true;

      if (shouldSendQuestions) {
        const clean = (data.questions || [])
          .filter((q) => q && q.prompt && q.answerType)
          .map((q, i) => {
            const base: any = {
              order: typeof q.order === "number" ? q.order : i,
              prompt: q.prompt,
              answerType: q.answerType,
              isRequired: !!q.isRequired,

              // FILE_UPLOAD extras
              maxFiles: q.maxFiles ?? null,
              maxSizeMB: q.maxSizeMB ?? null,
              imageId: q.imageId ?? null,

              // misc
              metadata:
                q.metadata &&
                typeof q.metadata === "object" &&
                !Array.isArray(q.metadata)
                  ? q.metadata
                  : null,
            };

            const isChoice =
              q.answerType === "CHOICE_SINGLE" ||
              q.answerType === "CHOICE_MULTI";
            if (isChoice) {
              const opts = (q.options || [])
                .filter((o) => o && String(o.label || "").trim())
                .slice(0, 10)
                .map((o, idx) => ({
                  label: String(o.label).trim(),
                  value:
                    (o.value && String(o.value).trim()) ||
                    slug(String(o.label)),
                  sortOrder:
                    typeof o.sortOrder === "number" ? o.sortOrder : idx,
                  isActive: o.isActive ?? true,
                }));

              base.options = opts;

              if (q.answerType === "CHOICE_SINGLE") {
                base.minSelect = 1;
                base.maxSelect = 1;
              } else {
                const len = opts.length;
                const min =
                  q.minSelect == null
                    ? 0
                    : Math.max(0, Math.min(len, q.minSelect));
                const max =
                  q.maxSelect == null
                    ? len
                    : Math.max(min, Math.min(len, q.maxSelect));
                base.minSelect = min;
                base.maxSelect = max;
              }
            }
            return base;
          });

        fd.append("questions", JSON.stringify(clean));
      }

      if (productId) {
        fd.append("id", productId);
        await updateDigital(fd).unwrap();
        showToast({
          type: "success",
          message: "Product updated successfully!",
          showClose: true,
        });
      } else {
        await createDigital(fd).unwrap();
        showToast({
          type: "success",
          message: "Product created successfully!",
          showClose: true,
        });
      }

      navigate("/seller/catalogue/products/digital", {
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

        {/* Digital asset (upload and/or link) */}
        <section id="digital-asset" className="scroll-mt-24">
          <DigitalAssetSection />
        </section>

        <section id="inventory" className="scroll-mt-24">
          <InventorySection />
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

        <div className="flex justify-end mt-6 pt-1">
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
              ? "Update Digital Product"
              : "Add Digital Product"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default DigitalProductForm;
