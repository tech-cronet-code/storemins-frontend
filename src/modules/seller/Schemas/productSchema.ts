// Schemas/productSchema.ts
import { z } from "zod";

const maxFileSize = 5 * 1024 * 1024; // 5MB

const variantOption = z.object({
  optionName: z.string().min(1, "Option name is required"),
  optionValues: z.array(z.string().min(1)).min(1, "Add at least one value"),
});

// NEW: answer types
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

    // CHOICE_* only
    options: z.array(optionSchema).optional(),
    minSelect: z.number().int().min(0).nullable().optional(),
    maxSelect: z.number().int().min(0).nullable().optional(),

    // FILE_UPLOAD only (nullable so clearing is possible)
    maxFiles: z.number().int().positive().nullable().optional(),
    maxSizeMB: z.number().int().positive().nullable().optional(),
    imageId: z.string().trim().min(1).nullable().optional(),

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
      if (val.options && val.options.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Options are not applicable for FILE_UPLOAD",
        });
      }
    }

    if (val.answerType === "TEXT") {
      if (val.options && val.options.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Options are not applicable for TEXT",
        });
      }
    }

    if (
      val.answerType === "CHOICE_SINGLE" ||
      val.answerType === "CHOICE_MULTI"
    ) {
      const count = val.options?.length ?? 0;
      if (count < 2 || count > 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Provide between 2 and 10 options",
        });
      }
      if (val.answerType === "CHOICE_SINGLE") {
        if (val.minSelect != null && val.minSelect !== 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["minSelect"],
            message: "Single choice must have minSelect = 1",
          });
        }
        if (val.maxSelect != null && val.maxSelect !== 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["maxSelect"],
            message: "Single choice must have maxSelect = 1",
          });
        }
      } else {
        const min = val.minSelect ?? 0;
        const max = val.maxSelect ?? count;
        if (min < 0 || max < 1 || min > max) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["minSelect"],
            message: "Invalid min/max selection counts",
          });
        }
        if (max > count) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["maxSelect"],
            message: "maxSelect cannot exceed number of options",
          });
        }
      }
    }
  });

export type QuestionForm = z.infer<typeof questionSchema>;

export const productSchema = z
  .object({
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
      .number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number",
      })
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

    stockStatus: z.enum(["in_stock", "out_of_stock"]).optional(),
    shippingClass: z.string().optional(),
    taxClass: z.string().optional(),

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

    // Shipping/Tax
    shippingWeight: z.coerce.number().optional(),
    hsnCode: z.string().optional(),
    gstPercent: z.coerce.number().optional(),

    type: z.enum(["PHYSICAL", "DIGITAL", "MEETING", "WORKSHOP"]).optional(),

    // NEW: flags + note + questions
    isRecommended: z.boolean().optional().default(false),
    customerQuestionsRequired: z.boolean().optional().default(false),

    postPurchaseNoteDesc: z.string().optional().nullable(),

    replaceQuestions: z.boolean().optional().default(false),
    questions: z.array(questionSchema).default([]),
  })
  .refine(
    (data) =>
      !data.customerQuestionsRequired || (data.questions?.length ?? 0) > 0,
    {
      path: ["questions"],
      message:
        'Add at least one customer question or turn off "All customer questions must be answered".',
    }
  );

export type ProductFormValues = z.infer<typeof productSchema>;
