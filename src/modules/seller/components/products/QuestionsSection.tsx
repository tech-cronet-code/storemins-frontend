// components/ProductForm/QuestionsSection.tsx
import React, { useCallback, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { ProductFormValues } from "../../Schemas/productSchema";

/* ------------------ utils ------------------ */
type Q = NonNullable<ProductFormValues["questions"]>[number];
type Opt = NonNullable<Q["options"]>[number];

const slug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

const emptyRow = (): Q => ({
  order: 0,
  prompt: "",
  answerType: "TEXT",
  isRequired: false,
  options: undefined,
  minSelect: null,
  maxSelect: null,
  maxFiles: null,
  maxSizeMB: null,
  imageId: null,
  metadata: null,
  isActive: true,
});

const TEMPLATES: Q[] = [
  {
    order: 0,
    prompt: "Add custom text?",
    answerType: "TEXT",
    isRequired: true,
    options: undefined,
    minSelect: null,
    maxSelect: null,
    maxFiles: null,
    maxSizeMB: null,
    imageId: null,
    metadata: { ui: { hint: "Max 40 chars" } } as unknown as Record<
      string,
      unknown
    >,
    isActive: true,
  },
  {
    order: 1,
    prompt: "Choose a day",
    answerType: "CHOICE_SINGLE",
    isRequired: false,
    options: [
      { label: "Monday", value: "monday", sortOrder: 0, isActive: true },
      { label: "Tuesday", value: "tuesday", sortOrder: 1, isActive: true },
    ],
    minSelect: 1,
    maxSelect: 1,
    maxFiles: null,
    maxSizeMB: null,
    imageId: null,
    metadata: { ui: { note: "Will affect scheduling" } } as unknown as Record<
      string,
      unknown
    >,
    isActive: true,
  },
  {
    order: 2,
    prompt: "Upload logo (PNG)",
    answerType: "FILE_UPLOAD",
    isRequired: false,
    options: undefined,
    minSelect: null,
    maxSelect: null,
    maxFiles: 1,
    maxSizeMB: 5,
    imageId: null,
    metadata: {
      file: { types: ["png"], note: "Transparent preferred" },
    } as unknown as Record<string, unknown>,
    isActive: true,
  },
];

/* ------------------ small UI bits ------------------ */
const Badge: React.FC<{
  children: React.ReactNode;
  tone?: "gray" | "blue" | "green" | "red";
}> = ({ children, tone = "gray" }) => {
  const tones: Record<string, string> = {
    gray: "bg-gray-100 text-gray-700 border-gray-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

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

const Segmented: React.FC<{
  name: `questions.${number}.answerType`;
  value: Q["answerType"] | undefined;
  onChange: (v: Q["answerType"]) => void;
}> = ({ value, onChange }) => {
  const opts: Q["answerType"][] = [
    "TEXT",
    "CHOICE_SINGLE",
    "CHOICE_MULTI",
    "FILE_UPLOAD",
  ];
  return (
    <div className="inline-flex rounded-lg border bg-white overflow-hidden">
      {opts.map((opt) => (
        <button
          key={opt}
          type="button"
          aria-pressed={value === opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 text-sm transition ${
            value === opt
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {opt.replace("_", " / ")}
        </button>
      ))}
    </div>
  );
};

/* ------------------ main ------------------ */
const QuestionsSection: React.FC = () => {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "questions",
  });
  const questions = watch("questions") || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const questionsError = (errors as any)?.questions?.message as
    | string
    | undefined;

  // card collapse
  const [openCard, setOpenCard] = useState(true);
  const cardContentId = React.useId();

  // header keyboard handler
  const onCardHeaderKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setOpenCard((v) => !v);
    }
  };

  // per-row collapse
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const toggleOpen = useCallback(
    (id: string) => setOpenMap((m) => ({ ...m, [id]: !m[id] })),
    []
  );

  const addOne = () => append({ ...emptyRow(), order: questions.length });
  const addTemplates = () => {
    const base = questions.length || 0;
    append(TEMPLATES.map((t, i) => ({ ...t, order: base + i })));
  };

  const reindexOrders = () =>
    (questions || []).forEach((_, i) => setValue(`questions.${i}.order`, i));

  const onPromptKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();
      if (e.key === "ArrowUp" && idx > 0) move(idx, idx - 1);
      if (e.key === "ArrowDown" && idx < fields.length - 1) move(idx, idx + 1);
      requestAnimationFrame(reindexOrders);
    }
  };

  const total = fields.length;
  const requiredCount = (questions || []).filter(
    (q: Q) => q?.isRequired
  ).length;

  return (
    <section
      className="rounded-xl border border-gray-200 bg-white shadow-sm hover:border-gray-300 transition-colors"
      aria-labelledby="questions-heading"
    >
      {/* header — NOW CLICKABLE */}
      <div
        className="flex items-start gap-3 px-5 py-4 cursor-pointer select-none"
        role="button"
        tabIndex={0}
        aria-expanded={openCard}
        aria-controls={cardContentId}
        onClick={() => setOpenCard((v) => !v)}
        onKeyDown={onCardHeaderKey}
      >
        <div className="flex-1">
          <h3
            id="questions-heading"
            className="text-base font-semibold text-gray-900"
          >
            Customer Questions
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Collect details from buyers at checkout. Reorder with ↑/↓ (hold{" "}
            <kbd className="px-1 border rounded">Alt</kbd>).
          </p>
        </div>

        {/* chips (right side) */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
            Total:&nbsp;<b className="tabular-nums">{total}</b>
          </span>
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs text-blue-700">
            Required:&nbsp;<b className="tabular-nums">{requiredCount}</b>
          </span>
        </div>

        {/* chevron */}
        <button
          type="button"
          aria-label="Toggle section"
          aria-expanded={openCard}
          aria-controls={cardContentId}
          onClick={(e) => {
            e.stopPropagation(); // prevent header click
            setOpenCard((v) => !v);
          }}
          className="ml-1 -mr-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ChevronUpIcon
            className={[
              "h-4 w-4 transition-transform",
              openCard ? "rotate-0" : "rotate-180",
            ].join(" ")}
          />
        </button>
      </div>

      {/* divider */}
      <div className="h-px w-full bg-gray-100" />

      {/* body */}
      <div
        id={cardContentId}
        aria-hidden={!openCard}
        className={openCard ? "block" : "hidden"}
      >
        <div className="px-5 py-5">
          {/* top actions */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="sr-only" aria-hidden />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addTemplates}
                className="px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 text-sm"
              >
                + Quick add templates
              </button>
              <button
                type="button"
                onClick={addOne}
                className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
              >
                + Add question
              </button>
            </div>
          </div>

          {/* schema banner */}
          {questionsError && (
            <div
              role="alert"
              className="mb-3 rounded border border-red-200 bg-red-50 text-red-700 p-2 text-sm"
            >
              {questionsError}
            </div>
          )}

          {!fields.length && (
            <div className="text-sm text-gray-500 border rounded-lg p-3 bg-gray-50">
              No questions yet. Click <b>+ Add question</b> or use{" "}
              <b>Quick add templates</b>.
            </div>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => {
              const type = watch(`questions.${index}.answerType`);
              const promptVal = watch(`questions.${index}.prompt`);
              const requiredVal = watch(`questions.${index}.isRequired`);
              const activeVal = watch(`questions.${index}.isActive`);
              const expanded = openMap[field.id] ?? true;

              const headerBadges = (
                <div className="flex items-center gap-2">
                  <Badge
                    tone={
                      type === "FILE_UPLOAD"
                        ? "blue"
                        : type?.startsWith("CHOICE")
                        ? "green"
                        : "gray"
                    }
                  >
                    {type}
                  </Badge>
                  {requiredVal ? (
                    <Badge tone="red">required</Badge>
                  ) : (
                    <Badge>optional</Badge>
                  )}
                  {!activeVal && <Badge tone="gray">inactive</Badge>}
                </div>
              );

              const showOptions =
                type === "CHOICE_SINGLE" || type === "CHOICE_MULTI";

              // row header keyboard handler
              const onRowHeaderKey = (
                e: React.KeyboardEvent<HTMLDivElement>
              ) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggleOpen(field.id);
                }
              };

              return (
                <div
                  key={field.id}
                  className="border rounded-xl bg-white shadow-sm overflow-hidden"
                >
                  {/* row header — NOW CLICKABLE */}
                  <div
                    className="flex items-center gap-3 px-3 py-2 border-b cursor-pointer select-none"
                    role="button"
                    tabIndex={0}
                    aria-expanded={expanded}
                    onClick={() => toggleOpen(field.id)}
                    onKeyDown={onRowHeaderKey}
                    aria-controls={`q-row-${field.id}`}
                    title="Click to expand/collapse"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent header click
                        toggleOpen(field.id);
                      }}
                      className="shrink-0 w-7 h-7 rounded-md text-gray-600 hover:bg-gray-50 grid place-items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label={expanded ? "Collapse" : "Expand"}
                    >
                      <ChevronUpIcon
                        className={[
                          "h-4 w-4 transition-transform",
                          expanded ? "rotate-0" : "rotate-180",
                        ].join(" ")}
                      />
                    </button>

                    <div className="w-12">
                      <input
                        type="number"
                        className="w-full border rounded px-2 py-1 text-sm"
                        aria-label="Order"
                        {...register(`questions.${index}.order`, {
                          valueAsNumber: true,
                        })}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="truncate text-sm font-medium">
                        {promptVal?.trim() ? (
                          promptVal
                        ) : (
                          <span className="text-gray-400">
                            Untitled question
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {headerBadges}
                      </div>
                    </div>

                    {/* actions */}
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => index > 0 && move(index, index - 1)}
                        className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
                        aria-label="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          index < fields.length - 1 && move(index, index + 1)
                        }
                        className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
                        aria-label="Move down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          append({
                            ...(questions[index] ?? emptyRow()),
                            order: index + 1,
                          })
                        }
                        className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
                        aria-label="Duplicate"
                        title="Duplicate"
                      >
                        ⧉
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="px-2 py-1 text-sm border rounded text-red-600 hover:bg-red-50"
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* row body */}
                  <div
                    id={`q-row-${field.id}`}
                    aria-hidden={!expanded}
                    className={expanded ? "block" : "hidden"}
                  >
                    <div className="p-3 space-y-3">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600">
                            Prompt
                          </label>
                          <input
                            type="text"
                            className="w-full border rounded px-2 py-1"
                            placeholder="Enter the question displayed to customer"
                            {...register(`questions.${index}.prompt`)}
                            onKeyDown={(e) => onPromptKeyDown(index, e)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        <div className="sm:w-[320px]">
                          <label className="block text-xs text-gray-600 mb-1">
                            Answer Type
                          </label>
                          <Segmented
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            name={`questions.${index}.answerType` as any}
                            value={type}
                            onChange={(v) => {
                              setValue(`questions.${index}.answerType`, v, {
                                shouldValidate: true,
                              });
                              if (v === "CHOICE_SINGLE") {
                                const opts = (questions[index]?.options ??
                                  []) as Opt[];
                                if (!opts.length) {
                                  setValue(`questions.${index}.options`, [
                                    {
                                      label: "Yes",
                                      value: "yes",
                                      sortOrder: 0,
                                      isActive: true,
                                    },
                                    {
                                      label: "No",
                                      value: "no",
                                      sortOrder: 1,
                                      isActive: true,
                                    },
                                  ]);
                                }
                                setValue(`questions.${index}.minSelect`, 1);
                                setValue(`questions.${index}.maxSelect`, 1);
                              } else if (v === "CHOICE_MULTI") {
                                const opts = (questions[index]?.options ??
                                  []) as Opt[];
                                if (opts.length < 2) {
                                  setValue(`questions.${index}.options`, [
                                    {
                                      label: "Option A",
                                      value: "option-a",
                                      sortOrder: 0,
                                      isActive: true,
                                    },
                                    {
                                      label: "Option B",
                                      value: "option-b",
                                      sortOrder: 1,
                                      isActive: true,
                                    },
                                  ]);
                                }
                                setValue(`questions.${index}.minSelect`, 1);
                                setValue(
                                  `questions.${index}.maxSelect`,
                                  opts.length || 2
                                );
                              } else {
                                setValue(
                                  `questions.${index}.options`,
                                  undefined
                                );
                                setValue(`questions.${index}.minSelect`, null);
                                setValue(`questions.${index}.maxSelect`, null);
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            {...register(`questions.${index}.isRequired`)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-sm">Required</span>
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            defaultChecked
                            {...register(`questions.${index}.isActive`)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-sm">Active</span>
                        </label>
                      </div>

                      {showOptions && <ChoiceEditor index={index} />}

                      {type === "FILE_UPLOAD" && (
                        <div className="grid sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600">
                              Max Files
                            </label>
                            <input
                              type="number"
                              className="w-full border rounded px-2 py-1"
                              placeholder="e.g. 1"
                              {...register(`questions.${index}.maxFiles`, {
                                setValueAs: (v) =>
                                  v === "" || v == null ? null : Number(v),
                              })}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600">
                              Max Size (MB)
                            </label>
                            <input
                              type="number"
                              className="w-full border rounded px-2 py-1"
                              placeholder="e.g. 5"
                              {...register(`questions.${index}.maxSizeMB`, {
                                setValueAs: (v) =>
                                  v === "" || v == null ? null : Number(v),
                              })}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600">
                              Image ID (placeholder)
                            </label>
                            <input
                              type="text"
                              className="w-full border rounded px-2 py-1"
                              placeholder="optional imageId"
                              {...register(`questions.${index}.imageId`)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      )}

                      <div onClick={(e) => e.stopPropagation()}>
                        <label className="block text-xs text-gray-600 mb-1">
                          Metadata (JSON)
                        </label>
                        <MetadataEditor
                          value={
                            questions[index]?.metadata as
                              | Record<string, unknown>
                              | null
                              | undefined
                          }
                          onChange={(obj) =>
                            setValue(`questions.${index}.metadata`, obj)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!!fields.length && (
            <div className="mt-3 flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={reindexOrders}
                className="px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 text-sm"
                title="Set order = visible position"
              >
                Reindex orders by position
              </button>
              <div className="text-xs text-gray-500">
                Tip: Hold <kbd className="px-1 border rounded">Alt</kbd> and
                press <kbd className="px-1 border rounded">↑</kbd>/
                <kbd className="px-1 border rounded">↓</kbd> in the Prompt field
                to reorder quickly.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuestionsSection;

/* ------------------ CHOICE editor ------------------ */
const ChoiceEditor: React.FC<{ index: number }> = ({ index }) => {
  const { control, register, watch, setValue } =
    useFormContext<ProductFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `questions.${index}.options` as const,
  });

  const type = watch(`questions.${index}.answerType`);
  const isSingle = type === "CHOICE_SINGLE";
  const options = (watch(`questions.${index}.options`) ?? []) as Opt[];

  const minSelect = watch(`questions.${index}.minSelect`);
  const maxSelect = watch(`questions.${index}.maxSelect`);

  const canAdd = fields.length < 10;
  const canRemove = fields.length > 2;

  const addOption = () => {
    const next = fields.length;
    append({
      label: `Option ${next + 1}`,
      value: slug(`Option ${next + 1}`),
      sortOrder: next,
      isActive: true,
    });
    if (!isSingle) {
      setValue(
        `questions.${index}.maxSelect`,
        (watch(`questions.${index}.options`)?.length || 1) + 1
      );
    }
  };

  const onLabelBlur = (i: number, e: React.FocusEvent<HTMLInputElement>) => {
    const lab = e.target.value || "";
    const currentVal = (options[i]?.value || "").trim();
    if (!currentVal)
      setValue(`questions.${index}.options.${i}.value`, slug(lab));
  };

  React.useEffect(() => {
    if (isSingle) {
      setValue(`questions.${index}.minSelect`, 1, { shouldValidate: true });
      setValue(`questions.${index}.maxSelect`, 1, { shouldValidate: true });
    } else {
      const count = options.length || 0;
      if (count >= 2) {
        if (minSelect == null || minSelect < 0)
          setValue(`questions.${index}.minSelect`, 1, { shouldValidate: true });
        if (maxSelect == null || maxSelect < 1 || maxSelect > count)
          setValue(`questions.${index}.maxSelect`, count, {
            shouldValidate: true,
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSingle, options.length]);

  return (
    <div className="rounded-lg border p-3 bg-gray-50 space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="grow">
          <div className="text-sm font-medium">Options</div>
          <div className="text-xs text-gray-500">Between 2 and 10 options.</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">Min Select</label>
            <input
              type="number"
              className="w-16 border rounded px-2 py-1 text-sm"
              disabled={isSingle}
              {...register(`questions.${index}.minSelect`, {
                setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
              })}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">Max Select</label>
            <input
              type="number"
              className="w-16 border rounded px-2 py-1 text-sm"
              disabled={isSingle}
              {...register(`questions.${index}.maxSelect`, {
                setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
              })}
            />
          </div>

          <button
            type="button"
            onClick={addOption}
            disabled={!canAdd}
            className="px-3 py-1.5 rounded-md border bg-white hover:bg-gray-100 text-sm disabled:opacity-50"
          >
            + Add option
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {fields.map((opt, i) => (
          <div
            key={opt.id}
            className="grid grid-cols-[40px_1fr_1fr_120px_90px_90px] gap-2"
          >
            <input
              type="number"
              className="w-full border rounded px-2 py-1 text-sm"
              {...register(`questions.${index}.options.${i}.sortOrder`, {
                valueAsNumber: true,
              })}
            />
            <input
              type="text"
              placeholder="Label"
              className="w-full border rounded px-2 py-1 text-sm"
              {...register(`questions.${index}.options.${i}.label`)}
              onBlur={(e) => onLabelBlur(i, e)}
            />
            <input
              type="text"
              placeholder="Value (slug)"
              className="w-full border rounded px-2 py-1 text-sm"
              {...register(`questions.${index}.options.${i}.value`)}
            />
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4"
                {...register(`questions.${index}.options.${i}.isActive`)}
                defaultChecked
              />
              Active
            </label>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => i > 0 && move(i, i - 1)}
                className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => i < fields.length - 1 && move(i, i + 1)}
                className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
                aria-label="Move down"
              >
                ↓
              </button>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => canRemove && remove(i)}
                className="px-2 py-1 text-sm border rounded text-red-600 hover:bg-red-50 disabled:opacity-50"
                disabled={!canRemove}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------ tiny JSON editor ------------------ */
const MetadataEditor: React.FC<{
  value: Record<string, unknown> | null | undefined;
  onChange: (obj: Record<string, unknown> | null) => void;
}> = ({ value, onChange }) => {
  const [text, setText] = useState(() =>
    value ? JSON.stringify(value, null, 2) : ""
  );
  const [error, setError] = useState<string | null>(null);

  const onBlur = () => {
    const t = text.trim();
    if (!t) {
      setError(null);
      onChange(null);
      return;
    }
    try {
      const obj = JSON.parse(t);
      if (obj && typeof obj === "object" && !Array.isArray(obj)) {
        setError(null);
        onChange(obj as Record<string, unknown>);
      } else setError("Metadata must be a JSON object.");
    } catch {
      setError("Invalid JSON.");
    }
  };

  const pretty = () => {
    try {
      const obj = JSON.parse(text);
      setText(JSON.stringify(obj, null, 2));
      setError(null);
    } catch {
      setError("Cannot prettify: invalid JSON.");
    }
  };

  const clear = () => {
    setText("");
    setError(null);
    onChange(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-gray-600">
          Paste JSON to control UI/validation (optional)
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={pretty}
            className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
          >
            Prettify
          </button>
          <button
            type="button"
            onClick={clear}
            className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </div>
      <textarea
        className={`w-full border rounded px-2 py-1 font-mono text-xs min-h-[96px] ${
          error ? "border-red-300 bg-red-50" : ""
        }`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={onBlur}
        placeholder='{"ui":{"hint":"e.g., Name to print"}}'
      />
      <div className="flex items-center justify-between mt-1">
        <span className={`text-xs ${error ? "text-red-600" : "text-gray-400"}`}>
          {error || "Valid JSON object or leave blank."}
        </span>
        <span className="text-[10px] text-gray-400">{text.length} chars</span>
      </div>
    </div>
  );
};
