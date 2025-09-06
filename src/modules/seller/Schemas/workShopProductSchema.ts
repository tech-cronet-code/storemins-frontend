// src/modules/seller/Schemas/workShopProductSchema.ts
import { z } from "zod";

const maxFileSize = 5 * 1024 * 1024;

const variantOption = z.object({
  optionName: z.string().min(1, "Option name is required"),
  optionValues: z.array(z.string().min(1)).min(1, "Add at least one value"),
});

export const AnswerTypeEnum = z.enum([
  "TEXT",
  "CHOICE_SINGLE",
  "CHOICE_MULTI",
  "FILE_UPLOAD",
]);

const optionSchema = z.object({
  label: z.string().trim().min(1, "Option label is required"),
  value: z.string().trim().min(1, "Option value is required"),
  sortOrder: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const questionSchema = z
  .object({
    order: z.number().int().min(0).optional().default(0),
    prompt: z.string().trim().min(1, "Prompt is required"),
    answerType: AnswerTypeEnum,
    isRequired: z.boolean().optional().default(false),

    options: z.array(optionSchema).optional(),
    minSelect: z.number().int().min(0).nullable().optional(),
    maxSelect: z.number().int().min(0).nullable().optional(),

    maxFiles: z.number().int().positive().nullable().optional(),
    maxSizeMB: z.number().int().positive().nullable().optional(),
    imageId: z.string().trim().min(1).nullable().optional(),

    metadata: z.record(z.unknown()).nullable().optional(),
    isActive: z.boolean().optional().default(true),
  })
  .superRefine((val, ctx) => {
    if (val.answerType === "FILE_UPLOAD") {
      if (val.maxFiles == null)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["maxFiles"],
          message: "Max files is required",
        });
      if (val.maxSizeMB == null)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["maxSizeMB"],
          message: "Max size (MB) is required",
        });
      if (val.options?.length)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Options not applicable for FILE_UPLOAD",
        });
    }
    if (val.answerType === "TEXT" && val.options?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Options not applicable for TEXT",
      });
    }
    if (
      val.answerType === "CHOICE_SINGLE" ||
      val.answerType === "CHOICE_MULTI"
    ) {
      const count = val.options?.length ?? 0;
      if (count < 2 || count > 10)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Provide 2–10 options",
        });
      if (val.answerType === "CHOICE_SINGLE") {
        if (val.minSelect != null && val.minSelect !== 1)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["minSelect"],
            message: "minSelect=1",
          });
        if (val.maxSelect != null && val.maxSelect !== 1)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["maxSelect"],
            message: "maxSelect=1",
          });
      } else {
        const min = val.minSelect ?? 0;
        const max = val.maxSelect ?? count;
        if (min < 0 || max < 1 || min > max)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["minSelect"],
            message: "Invalid min/max",
          });
        if (max > count)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["maxSelect"],
            message: "maxSelect cannot exceed option count",
          });
      }
    }
  });

export type QuestionForm = z.infer<typeof questionSchema>;

export const workShopProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),

  categoryLinks: z
    .array(
      z.object({
        parentCategoryId: z.string().uuid().optional(),
        parentCategoryName: z.string().optional(),
        subCategoryId: z.string().uuid().optional(),
        subCategoryName: z.string().optional(),
      })
    )
    .optional(),
  categoryName: z.string().optional(),

  price: z.coerce
    .number({ required_error: "Price is required" })
    .positive("Price must be greater than 0"),
  discountedPrice: z.coerce
    .number()
    .optional()
    .refine((v) => v === undefined || v >= 0, {
      message: "Discount must be 0 or more",
    }),
  description: z.string().optional(),

  stock: z.coerce.number().min(0, "Stock must be 0 or more").optional(),
  sku: z.string().optional(),

  variants: z.array(variantOption).optional(),

  images: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files) return true;
        if (Array.isArray(files) && files.every((f) => typeof f === "string"))
          return true;
        return (
          files instanceof FileList &&
          Array.from(files).every(
            (file) => file instanceof File && file.size <= maxFileSize
          )
        );
      },
      { message: "Each image must be a valid file under 5MB" }
    ),
  mediaUrls: z.array(z.string().min(1)).optional(),

  // SEO
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoImageUrl: z.string().optional(),
  seoImage: z.any().optional(),

  // Flags + note + questions
  isRecommended: z.boolean().optional().default(false),
  customerQuestionsRequired: z.boolean().optional().default(false),
  postPurchaseNoteDesc: z.string().optional().nullable(),
  replaceQuestions: z.boolean().optional().default(false),
  questions: z.array(questionSchema).default([]),

  // Workshop duration
  workshopDuration: z.coerce
    .number({ invalid_type_error: "Duration must be a number" })
    .int()
    .positive("Duration must be greater than 0"),
  workshopDurationUnit: z.enum(["days", "weeks", "months", "sessions"]),

  // Breakdown + provider + link
  meetingBreakdown: z.string().optional(),
  meetingChannel: z.string().optional(),
  meetingChannelUrl: z.union([z.string().url(), z.literal("")]).optional(), // ⬅️ NEW
});

export type WorkShopProductFormValues = z.infer<typeof workShopProductSchema>;
