// src/modules/seller/components/products/WorkShopProductForm.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../../common/utils/showToast";
import { useSellerAuth } from "../../../auth/contexts/SellerAuthContext";

import InventorySection from "./InventorySection";
import PostPurchaseNoteSection from "./PostPurchaseNoteSection";
import ProductFlagsSection from "./ProductFlagsSection";
import ProductInfoSection from "./ProductInfoSection";
import ProductMediaSection from "./ProductMediaSection";
import QuestionsSection from "./QuestionsSection";
import SEOSection from "./SEOSection";

import {
  WorkShopProductFormValues,
  workShopProductSchema,
} from "../../Schemas/workShopProductSchema";
import MeetingBreakdownSection from "./MeetingBreakdownSection";
import MeetingChannelSection from "./MeetingChannelSection"; // <— ensure path
import WorkShopDurationSection from "./WorkShopDurationSection";
import {
  useGetProductByIdQuery,
  useCreateWorkshopProductMutation,
  useUpdateWorkshopProductMutation,
} from "../../../auth/services/productApi";

interface WorkShopProductFormProps {
  productId?: string;
}

const LOG = "[WorkShopProductForm]";

function unwrap(p: any): any {
  if (!p) return p;
  if (p.data && typeof p.data === "object") return unwrap(p.data);
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

const CODE_TO_LABEL: Record<string, string> = {
  ZOOM: "ZOOM",
  GMEET: "G-Meet",
  WHATSAPP: "WhatsApp",
  PHONE_CALL: "Phone call",
  FORM: "Form",
  ENDN: "Endn",
  HSHD: "Hshd",
};
const ENUM_TO_KEY: Record<string, string> = {
  ZOOM: "zoom",
  GMEET: "gmeet",
  WHATSAPP: "whatsapp",
  PHONE_CALL: "phone",
  FORM: "form",
  ENDN: "endn",
  HSHD: "hshd",
};
const toProviderLabel = (code?: string | null) =>
  code ? CODE_TO_LABEL[String(code).toUpperCase()] ?? code : "";

// label ➜ enum
function toProviderEnum(label?: string | null): string | undefined {
  if (!label) return undefined;
  const t = label.trim().toLowerCase();
  if (t.includes("zoom")) return "ZOOM";
  if (t.includes("g-meet") || t.includes("meet") || t.includes("gmeet"))
    return "GMEET";
  if (t.includes("whatsapp")) return "WHATSAPP";
  if (t.includes("phone")) return "PHONE_CALL";
  if (t === "form") return "FORM";
  if (t === "endn") return "ENDN";
  if (t === "hshd") return "HSHD";
  return undefined;
}

const unitMap = {
  days: "DAYS",
  weeks: "WEEKS",
  months: "MONTHS",
  sessions: "SESSIONS",
} as const;

const slug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const WorkShopProductForm: React.FC<WorkShopProductFormProps> = ({
  productId,
}) => {
  const navigate = useNavigate();
  const { userDetails } = useSellerAuth();

  const [createWorkshop, { isLoading: isCreating }] =
    useCreateWorkshopProductMutation();
  const [updateWorkshop, { isLoading: isUpdating }] =
    useUpdateWorkshopProductMutation();

  const { data: productRaw, isLoading: isFetching } = useGetProductByIdQuery(
    { id: productId! },
    { skip: !productId, refetchOnMountOrArgChange: true }
  );

  const methods = useForm<WorkShopProductFormValues>({
    resolver: zodResolver(workShopProductSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      categoryLinks: [],
      categoryName: "",
      price: undefined as any,
      discountedPrice: undefined as any,
      description: "",
      stock: undefined,
      sku: "",
      variants: undefined,

      images: undefined as any,
      mediaUrls: [],

      seoTitle: "",
      seoDescription: "",
      seoImageUrl: "",
      seoImage: undefined as any,

      isRecommended: false,
      customerQuestionsRequired: false,

      postPurchaseNoteDesc: null,
      replaceQuestions: false,
      questions: [],

      // workshop-only
      workshopDuration: undefined,
      workshopDurationUnit: "days",
      meetingBreakdown: "",
      meetingChannel: "",
      meetingChannelUrl: "",

      // local state used by MeetingChannelSection
      channelLinks: {}, // <<—— per-tile URL map (zoom/gmeet/…)
      customChannel: undefined as any,
      customChannels: [] as any,
    } as any,
  });

  const { handleSubmit, reset, control, trigger, getValues } = methods;

  const mustAnswer = useWatch({ control, name: "customerQuestionsRequired" });
  const questions = useWatch({ control, name: "questions" }) || [];
  useEffect(() => {
    void trigger("questions");
  }, [mustAnswer, questions.length, trigger]);

  // -------- hydrate on edit --------
  useEffect(() => {
    if (!productId || !productRaw) return;
    const p = unwrap(productRaw);
    const mediaTokens = extractMediaTokens(p);
    const categoryLinks = p?.categoryLinks || [];
    const categoryName = categoryLinks
      .map((l: any) => l?.subCategoryName || l?.parentCategoryName)
      .filter(Boolean)
      .join(", ");

    // normalize provider + link coming from API
    const label = toProviderLabel(p?.meetingChannel); // "ZOOM", "G-Meet", etc.
    const urlFromApi: string = p?.meetingChannelUrl || ""; // <<—— from transform
    const enumVal = toProviderEnum(label);
    const key = enumVal ? ENUM_TO_KEY[enumVal] : undefined;
    const prefillLinks = key && urlFromApi ? { [key]: urlFromApi } : {};

    reset({
      name: p?.name || "",
      categoryLinks,
      categoryName,
      price: p?.price != null ? String(p.price) : undefined,
      discountedPrice:
        p?.discountedPrice != null ? String(p.discountedPrice) : undefined,
      description: p?.description || "",
      stock: (p as any)?.stock ?? p?.quantity ?? undefined,
      sku: p?.sku ?? "",
      variants: p?.variants || undefined,

      images: undefined as any,
      mediaUrls: mediaTokens,

      seoTitle: p?.seoMetaData?.title || "",
      seoDescription: p?.seoMetaData?.description || "",
      seoImageUrl: p?.seoMetaData?.imageUrl || "",

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

      // Workshop hydrate
      workshopDuration: p?.workshopDuration ?? undefined,
      workshopDurationUnit: p?.workshopDurationUnit ?? "days",
      meetingBreakdown: p?.meetingBreakdown ?? "",
      meetingChannel: label,
      meetingChannelUrl: urlFromApi, // <<—— modal input value
      channelLinks: prefillLinks, // <<—— makes the tile show the link
    } as any);
  }, [productRaw, productId, reset]);

  const onSubmit = async (data: WorkShopProductFormValues) => {
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

      // pricing / basics
      fd.append("price", String(data.price ?? ""));
      if (String(data.discountedPrice ?? "") !== "")
        fd.append("discountedPrice", String(data.discountedPrice));
      if (data.description) fd.append("description", data.description);
      if (data.stock != null && String(data.stock) !== "")
        fd.append("quantity", String(data.stock));
      if (data.sku) fd.append("sku", data.sku);

      // flags
      fd.append("isRecommended", String(!!data.isRecommended));
      fd.append(
        "customerQuestionsRequired",
        String(!!data.customerQuestionsRequired)
      );
      if (data.postPurchaseNoteDesc != null)
        fd.append(
          "postPurchaseNoteDesc",
          String(data.postPurchaseNoteDesc ?? "")
        );

      // categories / variants
      if (data.categoryLinks !== undefined)
        fd.append("categoryLinks", JSON.stringify(data.categoryLinks));
      if (data.variants !== undefined)
        fd.append("variants", JSON.stringify(data.variants));

      // workshop fields
      if (data.workshopDuration != null)
        fd.append("durationValue", String(data.workshopDuration));
      if (data.workshopDurationUnit)
        fd.append("durationUnit", unitMap[data.workshopDurationUnit]);
      if (data.meetingBreakdown && data.meetingBreakdown.trim()) {
        fd.append(
          "breakdown",
          JSON.stringify({
            format: "markdown",
            text: data.meetingBreakdown.trim(),
          })
        );
      }
      const providerEnum = toProviderEnum(data.meetingChannel);
      if (providerEnum) fd.append("provider", providerEnum);
      else if (data.meetingChannel?.trim())
        fd.append("provider", data.meetingChannel.trim());

      const link = (getValues("meetingChannelUrl") || "").trim();
      if (link) fd.append("meetingLink", link); // <<—— persisted

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

      // gallery
      const keptTokens = (data.mediaUrls || []) as string[];
      if (productId) {
        fd.append(
          "media",
          JSON.stringify(
            keptTokens.map((u, i) => ({ type: "IMAGE", url: u, order: i }))
          )
        );
      }
      const galleryFiles = data.images as unknown as FileList | undefined;
      if (galleryFiles && galleryFiles.length)
        Array.from(galleryFiles).forEach((f) => fd.append("images", f));

      // questions
      if (
        (data.questions?.length ?? 0) > 0 ||
        data.customerQuestionsRequired ||
        data.replaceQuestions
      ) {
        const clean = (data.questions || [])
          .filter((q) => q && q.prompt && q.answerType)
          .map((q, i) => {
            const base: any = {
              order: typeof q.order === "number" ? q.order : i,
              prompt: q.prompt,
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
        await updateWorkshop(fd).unwrap();
        showToast({
          type: "success",
          message: "Workshop product updated!",
          showClose: true,
        });
      } else {
        await createWorkshop(fd).unwrap();
        showToast({
          type: "success",
          message: "Workshop product created!",
          showClose: true,
        });
      }

      navigate("/seller/catalogue/products/workshop", {
        state: { refresh: true },
      });
    } catch (err: any) {
      console.error(LOG, "submit error", err);
      showToast({
        type: "error",
        message: err?.data?.message || "Failed to save workshop!",
        showClose: true,
      });
    }
  };

  const isSubmitting = isCreating || isUpdating;
  if (isFetching && productId) return <div>Loading product details...</div>;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section id="product-media" className="scroll-mt-24">
          <ProductMediaSection />
        </section>
        <section id="product-info" className="scroll-mt-24">
          <ProductInfoSection />
        </section>
        <section id="workshop-duration" className="scroll-mt-24">
          <WorkShopDurationSection />
        </section>
        <section id="workshop-breakdown" className="scroll-mt-24">
          <MeetingBreakdownSection sectionName={"Workshop"} />
        </section>
        <section id="workshop-channel" className="scroll-mt-24">
          <MeetingChannelSection sectionName={"Workshop"} />
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
              ? "Update Workshop Product"
              : "Add Workshop Product"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default WorkShopProductForm;
