// components/ProductForm/PostPurchaseNoteSection.tsx
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { ProductFormValues } from "../../Schemas/productSchema";

const LIMIT = 400;

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PostPurchaseNoteSection: React.FC<{ defaultOpen?: boolean }> = ({
  defaultOpen = true,
}) => {
  const { register, control } = useFormContext<ProductFormValues>();
  const note = (useWatch({ control, name: "postPurchaseNoteDesc" }) ??
    "") as string;
  const count = String(note).length;

  const [open, setOpen] = React.useState(defaultOpen);
  const contentId = React.useId();

  const toggle = () => setOpen((v) => !v);

  return (
    <section
      className="rounded-xl border border-gray-200 bg-white shadow-sm hover:border-gray-300 transition-colors"
      aria-labelledby="ppn-heading"
    >
      {/* header → full clickable */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={toggle}
        className="w-full flex items-start gap-3 px-5 py-4 text-left"
      >
        <div className="flex-1">
          <h3
            id="ppn-heading"
            className="text-base font-semibold text-gray-900"
          >
            Post-purchase note
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Shown to the customer on the Thank-you page and in order details
            (optional).
          </p>
        </div>

        {/* counter pill */}
        <span
          className={[
            "inline-flex items-center rounded-full border px-2.5 py-1 text-xs",
            count > LIMIT
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-gray-200 bg-gray-50 text-gray-700",
          ].join(" ")}
        >
          {count}/{LIMIT}
        </span>

        {/* chevron */}
        <ChevronDownIcon
          className={[
            "ml-2 h-4 w-4 shrink-0 transition-transform",
            open ? "rotate-180" : "rotate-0",
          ].join(" ")}
        />
      </button>

      {/* divider */}
      <div className="h-px w-full bg-gray-100" />

      {/* body */}
      <div
        id={contentId}
        aria-hidden={!open}
        className={open ? "block" : "hidden"}
      >
        <div className="px-5 py-5 space-y-3">
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
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="text-xs text-gray-600 mb-1">Preview</div>
              <pre className="m-0 whitespace-pre-wrap break-words text-sm text-gray-900">
                {note}
              </pre>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default React.memo(PostPurchaseNoteSection);
