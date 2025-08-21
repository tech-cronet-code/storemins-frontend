// Schemas/productSchema.ts
import { z } from "zod";

const maxFileSize = 5 * 1024 * 1024; // 5MB

const variantOption = z.object({
  optionName: z.string().min(1, "Option name is required"),
  optionValues: z.array(z.string().min(1)).min(1, "Add at least one value"),
});


/** answer type options for customer questions */
export const AnswerTypeEnum = z.enum(["TEXT", "YES_NO", "FILE_UPLOAD"]);

export const questionSchema = z
  .object({
    order: z.number().int().min(0).optional().default(0),
    prompt: z.string().trim().min(1, "Prompt is required"),
    answerType: AnswerTypeEnum,
    isRequired: z.boolean().optional().default(false),

    // file-only constraints (nullable so clearing is possible)
    maxFiles: z.number().int().positive().nullable().optional(),
    maxSizeMB: z.number().int().positive().nullable().optional(),

    // arbitrary JSON object or null
    metadata: z.record(z.unknown()).nullable().optional(),

    isActive: z.boolean().optional().default(true),
  })
  .superRefine((val, ctx) => {
    if (val.answerType === "FILE_UPLOAD") {
      if (val.maxFiles == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["maxFiles"],
          message: "Max files is required for file uploads",
        });
      }
      if (val.maxSizeMB == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["maxSizeMB"],
          message: "Max size (MB) is required for file uploads",
        });
      }
    }
  });

export type QuestionForm = z.infer<typeof questionSchema>;

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),

  // Backend accepts empty or omitted; don't force min(1) here
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

  // Allow decimals; coerce to number
  price: z.coerce
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be greater than 0"),

  discountedPrice: z
    .coerce
    .number()
    .optional()
    .refine((v) => v === undefined || v >= 0, {
      message: "Discount must be 0 or more",
    }),

  description: z.string().optional(),

  stock: z.coerce.number().min(0, "Stock must be 0 or more").optional(),
  sku: z.string().optional(),

  stockStatus: z.enum(["in_stock", "out_of_stock"]).optional(),
  shippingClass: z.string().optional(),
  taxClass: z.string().optional(),

  // ✅ Correct: array of { optionName, optionValues[] }
  variants: z.array(variantOption).optional(),

  // Gallery files (or undefined). We accept FileList OR array of URLs (strings) for edit mode.
  images: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files) return true;
        if (Array.isArray(files) && files.every((f) => typeof f === "string")) return true;
        return (
          files instanceof FileList &&
          Array.from(files).every((file) => file instanceof File && file.size <= maxFileSize)
        );
      },
      { message: "Each image must be a valid file under 5MB" }
    ),

  // Ordered existing URLs used by your gallery editor
  mediaUrls: z.array(z.string().min(1)).optional(),

  // SEO
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoImageUrl: z.string().optional(), // allow empty string too
  seoImage: z.any().optional(),       // FileList (handled in UI)

  // Shipping/Tax
  shippingWeight: z.coerce.number().optional(),
  hsnCode: z.string().optional(),
  gstPercent: z.coerce.number().optional(),

  // Product type
  type: z.enum(["PHYSICAL", "DIGITAL", "MEETING", "WORKSHOP"]).optional(),

    // NEW
     // flags
    isRecommended: z.boolean().optional().default(false),
    customerQuestionsRequired: z.boolean().optional().default(false),

    // questions
    replaceQuestions: z.boolean().optional().default(false),
    questions: z.array(questionSchema).default([]),
  })
  // conditional: if toggle ON, must have at least 1 question
  .refine(
    (data) => !data.customerQuestionsRequired || (data.questions?.length ?? 0) > 0,
    {
      path: ["questions"],
      message:
        'Add at least one customer question or turn off "All customer questions must be answered".',
    }
  );

export type ProductFormValues = z.infer<typeof productSchema>;
