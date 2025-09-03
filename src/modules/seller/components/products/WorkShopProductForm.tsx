/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/seller/components/products/MeetingProductForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../../common/utils/showToast";
import { useAuth } from "../../../auth/contexts/AuthContext";
import {
  useCreateMeetingProductMutation,
  useGetProductByIdQuery,
  useUpdateMeetingProductMutation,
} from "../../../auth/services/productApi";

import InventorySection from "./InventorySection";
import ProductFlagsSection from "./ProductFlagsSection";
import ProductInfoSection from "./ProductInfoSection";
import ProductMediaSection from "./ProductMediaSection";
import QuestionsSection from "./QuestionsSection";
import SEOSection from "./SEOSection";
import PostPurchaseNoteSection from "./PostPurchaseNoteSection";

// Meeting UI sections
import MeetingBreakdownSection from "./MeetingBreakdownSection";
import MeetingChannelSection from "./MeetingChannelSection";
import DurationSection from "./DurationSection";
import WorkShopDurationSection from "./WorkShopDurationSection";
import {
  WorkShopProductFormValues,
  workShopProductSchema,
} from "../../Schemas/workShopProductSchema";

interface WorkShopProductFormProps {
  productId?: string;
}

const LOG = "[MeetingProductForm]";

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

// ----- Provider mapping helpers -----
const CODE_TO_LABEL: Record<string, string> = {
  ZOOM: "ZOOM",
  GMEET: "G-Meet",
  WHATSAPP: "WhatsApp",
  PHONE_CALL: "Phone call",
  FORM: "Form",
  ENDN: "Endn",
  HSHD: "Hshd",
};
const CODE_TO_KEY: Record<string, string> = {
  ZOOM: "zoom",
  GMEET: "gmeet",
  WHATSAPP: "whatsapp",
  PHONE_CALL: "phone",
  FORM: "form",
  ENDN: "endn",
  HSHD: "hshd",
};
function providerCodeToLabel(code?: string | null): string {
  if (!code) return "";
  const u = String(code).toUpperCase();
  return CODE_TO_LABEL[u] ?? code; // if custom (e.g., "Teams"), keep as label
}
function providerCodeToKey(code?: string | null): string | undefined {
  if (!code) return undefined;
  const u = String(code).toUpperCase();
  return CODE_TO_KEY[u];
}

// map visible label to backend enum (best-effort)
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
  return undefined; // fall back to sending custom label in provider
}

// simple slug util for CHOICE option values
const slug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

const WorkShopProductForm: React.FC<WorkShopProductFormProps> = ({
  productId,
}) => {
  const navigate = useNavigate();
  const { userDetails } = useAuth();

  const [createMeeting, { isLoading: isCreating }] =
    useCreateMeetingProductMutation();
  const [updateMeeting, { isLoading: isUpdating }] =
    useUpdateMeetingProductMutation();

  const { data: productRaw, isLoading: isFetchingProduct } =
    useGetProductByIdQuery(
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

      type: "MEETING",

      isRecommended: false,
      customerQuestionsRequired: false,

      postPurchaseNoteDesc: null,

      replaceQuestions: false,
      questions: [],

      // ── Meeting fields ──
      startsAtISO: undefined,
      endsAtISO: undefined,
      timezone: localTZ,

      meetingDuration: undefined,
      meetingDurationUnit: "mins",
      meetingBreakdown: "",

      // channel selection + link (written by MeetingChannelSection)
      meetingChannel: "",
      meetingChannelUrl: "",

      // optional BE fields / legacy
      meetingLink: "",
      capacity: undefined,
      hostName: "",
      instructions: "",

      // state for MeetingChannelSection
      customChannel: undefined as any,
      customChannels: [],
      channelLinks: {},
    } as any,
  });

  const { handleSubmit, reset, control, trigger, getValues } = methods;

  // validate questions live when required
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

    // map provider code -> tile label + per-tile key for saved link
    const providerLabel = providerCodeToLabel(p?.meetingProvider);
    const providerKey = providerCodeToKey(p?.meetingProvider);
    const meetingUrl: string = p?.meetingLink ?? "";

    // build per-channel saved links for the tiles so the grey text shows
    const channelLinks: Record<string, string> = {};
    if (providerKey && meetingUrl) channelLinks[providerKey] = meetingUrl;

    // If providerLabel isn't one of our base labels, treat it as a custom tile
    const baseLabels = new Set(Object.values(CODE_TO_LABEL));
    const isCustom = providerLabel && !baseLabels.has(providerLabel);

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

      type: "WORKSHOP",
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

      // ── Meeting hydrate ──
      startsAtISO: p?.startsAtISO ?? undefined,
      endsAtISO: p?.endsAtISO ?? undefined,
      timezone: p?.timezone ?? localTZ,
      meetingDuration: p?.meetingDuration ?? undefined,
      meetingDurationUnit: "mins",
      meetingBreakdown: p?.meetingBreakdown ?? "",

      // hydrate channel + link to the form
      meetingChannel: providerLabel || "",
      meetingChannelUrl: meetingUrl || "",
      meetingLink: meetingUrl || "",

      capacity: p?.capacity ?? undefined,
      hostName: p?.hostName ?? "",
      instructions: p?.instructions ?? "",

      // section state for tile URLs and optional custom tile
      customChannel:
        isCustom && providerLabel
          ? { label: providerLabel, url: meetingUrl || "" }
          : undefined,
      customChannels: isCustom && providerLabel ? [providerLabel] : [],
      channelLinks,
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

      // compute time window
      const startsAt = data.startsAtISO
        ? new Date(data.startsAtISO)
        : new Date();
      let endsAt = data.endsAtISO ? new Date(data.endsAtISO) : undefined;

      // derive minutes from unit
      const durationMins =
        data.meetingDuration != null
          ? data.meetingDurationUnit === "hrs"
            ? Number(data.meetingDuration) * 60
            : Number(data.meetingDuration)
          : undefined;

      if (!endsAt && durationMins && !Number.isNaN(durationMins)) {
        endsAt = new Date(startsAt.getTime() + durationMins * 60_000);
      }
      if (!endsAt) {
        showToast({
          type: "error",
          message: "Please provide duration or (start & end).",
          showClose: true,
        });
        return;
      }

      const fd = new FormData();
      fd.append("businessId", businessId);
      fd.append("name", data.name);

      // numbers / strings
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

      // flags
      fd.append("isRecommended", String(!!data.isRecommended));
      fd.append(
        "customerQuestionsRequired",
        String(!!data.customerQuestionsRequired)
      );

      // categories / variants
      if (data.categoryLinks !== undefined)
        fd.append("categoryLinks", JSON.stringify(data.categoryLinks));
      if (data.variants !== undefined)
        fd.append("variants", JSON.stringify(data.variants));

      /** ── MEETING fields ───────────────────────── */
      fd.append("startsAt", startsAt.toISOString());
      fd.append("endsAt", endsAt.toISOString());
      fd.append("timezone", data.timezone || localTZ);
      if (durationMins != null && !Number.isNaN(durationMins))
        fd.append("durationMinutes", String(durationMins));

      // breakdown
      if (data.meetingBreakdown && data.meetingBreakdown.trim()) {
        const breakdown = {
          format: "markdown",
          text: data.meetingBreakdown.trim(),
        };
        fd.append("breakdown", JSON.stringify(breakdown));
      }

      // Provider:
      // - if it's a known label, send the enum;
      // - otherwise send the label itself so it round-trips (custom tile).
      const providerEnum = toProviderEnum(data.meetingChannel);
      if (providerEnum) {
        fd.append("provider", providerEnum);
      } else if (data.meetingChannel && data.meetingChannel.trim()) {
        fd.append("provider", data.meetingChannel.trim());
      }

      // Meeting link: always take what the channel modal saved.
      const linkFromSection = (
        getValues("meetingChannelUrl") ||
        data.meetingChannel ||
        data.meetingLink ||
        ""
      ).trim();
      if (linkFromSection) {
        fd.append("meetingLink", linkFromSection);
      }

      if (data.capacity != null && String(data.capacity) !== "")
        fd.append("capacity", String(data.capacity));
      if (data.hostName) fd.append("hostName", data.hostName);
      if (data.instructions) fd.append("instructions", data.instructions);

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

      // gallery kept tokens (edit)
      const keptTokens = (data.mediaUrls || []) as string[];
      if (productId) {
        fd.append(
          "media",
          JSON.stringify(
            keptTokens.map((u, i) => ({ type: "IMAGE", url: u, order: i }))
          )
        );
      }

      // new gallery files
      const galleryFiles = data.images as unknown as FileList | undefined;
      if (galleryFiles && galleryFiles.length)
        Array.from(galleryFiles).forEach((f) => fd.append("images", f));

      // questions
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
        await updateMeeting(fd).unwrap();
        showToast({
          type: "success",
          message: "Meeting product updated!",
          showClose: true,
        });
      } else {
        await createMeeting(fd).unwrap();
        showToast({
          type: "success",
          message: "Meeting product created!",
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
        message: err?.data?.message || "Failed to save meeting!",
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

        {/* Meeting-only sections */}
        <section id="meeting-duration" className="scroll-mt-24">
          <DurationSection />
        </section>

        {/* workshop-only sections */}
        <section id="workshop-duration" className="scroll-mt-24">
          <WorkShopDurationSection />
        </section>

        <section id="meeting-breakdown" className="scroll-mt-24">
          <MeetingBreakdownSection />
        </section>

        <section id="meeting-channel" className="scroll-mt-24">
          <MeetingChannelSection />
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
              ? "Update WorkShop Product"
              : "Add WorkShop Product"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default WorkShopProductForm;
