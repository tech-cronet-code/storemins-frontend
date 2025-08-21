// src/modules/seller/components/ProductForm/ProductFlagsSection.tsx
import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { ProductFormValues } from "../../Schemas/productSchema";

interface Props {
  isEdit?: boolean;
}

/** A11y switch driven by RHF Controller (no register prop spreading). */
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
          <div className="flex items-start gap-3">
            {/* The visual switch */}
            <button
              type="button"
              role="switch"
              aria-checked={checked}
              onClick={toggle}
              onKeyDown={onKey}
              className={[
                "relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
                checked ? "bg-blue-600" : "bg-gray-300",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white shadow transition-transform",
                  checked ? "translate-x-6 left-1" : "translate-x-0 left-1",
                ].join(" ")}
              />
            </button>

            <div>
              <div className="text-sm font-medium text-gray-900">{label}</div>
              {hint ? <p className="text-xs text-gray-500">{hint}</p> : null}
            </div>
          </div>
        );
      }}
    />
  );
};

const ProductFlagsSection: React.FC<Props> = ({ isEdit }) => {
  const { control } = useFormContext<ProductFormValues>();

  // Live counters/indicators (defensive so no crashes)
  const questionsRequired = !!useWatch({ control, name: "customerQuestionsRequired" });
  const questions = (useWatch({ control, name: "questions" }) ?? []) as unknown[];
  const questionsCount = Array.isArray(questions) ? questions.length : 0;

  return (
    <section className="rounded-2xl border p-5 space-y-4 shadow-sm bg-white" aria-labelledby="product-flags-heading">
      <div className="flex items-center justify-between">
        <div>
          <h3 id="product-flags-heading" className="font-semibold text-lg">
            Product Flags
          </h3>
          <p className="text-xs text-gray-500">
            Control merchandising and checkout behavior with these toggles.
          </p>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            Questions: <b>{questionsCount}</b>
          </span>
          {questionsRequired && questionsCount === 0 && (
            <span className="px-2 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
              required but none added
            </span>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
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
        <div className="mt-1 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-start gap-3">
            <SwitchRow
              name="replaceQuestions"
              label={<span className="font-medium text-amber-900">Replace existing questions on save</span>}
            />
            <p className="text-sm text-amber-800">
              When checked, the set below will overwrite the current saved questions. Leave unchecked to keep them
              untouched.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default React.memo(ProductFlagsSection);
