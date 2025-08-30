import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { ProductFormValues } from "../../Schemas/productSchema";

const LIMIT = 400;

const PostPurchaseNoteSection: React.FC = () => {
  const { register, control } = useFormContext<ProductFormValues>();
  const note = (useWatch({ control, name: "postPurchaseNoteDesc" }) ??
    "") as string;
  const count = String(note).length;

  return (
    <section
      className="rounded-2xl border p-5 space-y-3 shadow-sm bg-white"
      aria-labelledby="ppn-heading"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 id="ppn-heading" className="font-semibold text-lg">
            Post-purchase note
          </h3>
          <p className="text-xs text-gray-500">
            Shown to the customer on the Thank-you page and in order details
            (optional).
          </p>
        </div>
        <span
          className={`text-xs ${
            count > LIMIT ? "text-red-600" : "text-gray-500"
          }`}
        >
          {count}/{LIMIT}
        </span>
      </div>

      <textarea
        rows={4}
        maxLength={LIMIT}
        placeholder="Example: We’ll contact you within 24 hours to schedule your session."
        className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        {...register("postPurchaseNoteDesc", {
          setValueAs: (v) => {
            if (typeof v !== "string") return null;
            const t = v.trim();
            return t === "" ? null : t;
          },
        })}
      />

      {note ? (
        <div className="rounded-md border bg-gray-50 p-3">
          <div className="text-xs text-gray-600 mb-1">Preview</div>
          <pre className="m-0 whitespace-pre-wrap break-words text-sm text-gray-900">
            {note}
          </pre>
        </div>
      ) : null}
    </section>
  );
};

export default React.memo(PostPurchaseNoteSection);
