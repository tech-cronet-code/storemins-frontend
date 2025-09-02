// src/modules/seller/components/ProductForm/ProductFlagsSection.tsx
import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { ProductFormValues } from "../../Schemas/productSchema";

interface Props {
  isEdit?: boolean;
  defaultOpen?: boolean;
}

/** Reusable chevron-up icon (inline, no deps). */
const ChevronUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M6 14l6-6 6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Reusable visual switch with RHF Controller (keyboard & a11y friendly). */
const SwitchRow: React.FC<{
  name: "isRecommended" | "customerQuestionsRequired" | "replaceQuestions";
  label: React.ReactNode;
  hint?: React.ReactNode;
}> = ({ name, label, hint }) => {
  const { control } = useFormContext<ProductFormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const checked = !!field.value;
        const toggle = () => field.onChange(!checked);
        const onKey = (e: React.KeyboardEvent) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            toggle();
          }
        };

        return (
          <label className="group flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={toggle}
              className="sr-only"
            />
            <button
              type="button"
              role="switch"
              aria-checked={checked}
              aria-label={typeof label === "string" ? label : "Toggle setting"}
              onClick={toggle}
              onKeyDown={onKey}
              className={[
                "relative h-6 w-11 shrink-0 rounded-full transition-colors ring-1 ring-inset",
                checked
                  ? "bg-blue-600 ring-blue-600/50"
                  : "bg-gray-200 ring-gray-300",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className={[
                  "absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow-sm",
                  "transition-transform duration-200",
                  checked ? "translate-x-6 left-0.5" : "translate-x-0 left-0.5",
                ].join(" ")}
              />
            </button>

            <div className="pt-0.5">
              <div className="text-sm font-medium text-gray-900">{label}</div>
              {hint ? (
                <p className="text-xs text-gray-500 leading-5">{hint}</p>
              ) : null}
            </div>
          </label>
        );
      }}
    />
  );
};

const ProductFlagsSection: React.FC<Props> = ({
  isEdit,
  defaultOpen = true,
}) => {
  const { control } = useFormContext<ProductFormValues>();
  const [open, setOpen] = React.useState(defaultOpen);
  const contentId = React.useId();

  // Live indicators
  const questionsRequired = !!useWatch({
    control,
    name: "customerQuestionsRequired",
  });
  const questions = (useWatch({ control, name: "questions" }) ??
    []) as unknown[];
  const questionsCount = Array.isArray(questions) ? questions.length : 0;

  return (
    <section
      className="rounded-xl border border-gray-200 bg-white shadow-sm hover:border-gray-300 transition-colors"
      aria-labelledby="product-flags-heading"
    >
      {/* Card header */}
      <div className="flex items-start gap-3 px-5 py-4">
        <div className="flex-1">
          <h3
            id="product-flags-heading"
            className="text-base font-semibold text-gray-900"
          >
            Product Flags
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Optimize merchandising and checkout behavior with these toggles.
          </p>
        </div>

        {/* Right-side status chips */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
            Questions:&nbsp;<b className="tabular-nums">{questionsCount}</b>
          </span>
          {questionsRequired && questionsCount === 0 && (
            <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
              required but none added
            </span>
          )}
        </div>

        {/* Chevron toggle (matches your screenshot) */}
        <button
          type="button"
          aria-label="Toggle section"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((v) => !v)}
          className="ml-1 -mr-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ChevronUpIcon
            className={[
              "h-4 w-4 transition-transform",
              open ? "rotate-0" : "rotate-180",
            ].join(" ")}
          />
        </button>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-100" />

      {/* Card body (collapsible) */}
      <div
        id={contentId}
        aria-hidden={!open}
        className={open ? "block" : "hidden"}
      >
        <div className="px-5 py-5">
          <div className="grid gap-6 sm:grid-cols-2">
            <SwitchRow
              name="isRecommended"
              label="Mark as Recommended"
              hint="Surface this product in featured/upsell placements."
            />

            <SwitchRow
              name="customerQuestionsRequired"
              label="All customer questions must be answered"
              hint="Buyer cannot add to cart until all required questions are satisfied."
            />
          </div>

          {isEdit && (
            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                <SwitchRow
                  name="replaceQuestions"
                  label={
                    <span className="font-medium text-amber-900">
                      Replace existing questions on save
                    </span>
                  }
                />
                <p className="text-sm leading-6 text-amber-800">
                  When checked, the set below will overwrite the current saved
                  questions. Leave unchecked to keep them untouched.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default React.memo(ProductFlagsSection);
