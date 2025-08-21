import React, { useCallback, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { ProductFormValues } from "../../Schemas/productSchema";

type Q = NonNullable<ProductFormValues["questions"]>[number];

const emptyRow = (): Q => ({
  order: 0,
  prompt: "",
  answerType: "TEXT",
  isRequired: false,
  maxFiles: null,
  maxSizeMB: null,
  metadata: null,
  isActive: true,
});

const TEMPLATES: Q[] = [
  {
    order: 0,
    prompt: "Add custom text?",
    answerType: "TEXT",
    isRequired: true,
    maxFiles: null,
    maxSizeMB: null,
    metadata: { ui: { hint: "Max 40 chars" } } as unknown as Record<string, unknown>,
    isActive: true,
  },
  {
    order: 1,
    prompt: "Gift wrap?",
    answerType: "YES_NO",
    isRequired: false,
    maxFiles: null,
    maxSizeMB: null,
    metadata: { ui: { note: "Adds ₹49" } } as unknown as Record<string, unknown>,
    isActive: true,
  },
  {
    order: 2,
    prompt: "Upload logo (PNG)",
    answerType: "FILE_UPLOAD",
    isRequired: false,
    maxFiles: 1,
    maxSizeMB: 5,
    metadata: { file: { types: ["png"], note: "Transparent preferred" } } as unknown as Record<
      string,
      unknown
    >,
    isActive: true,
  },
];

const Badge: React.FC<{ children: React.ReactNode; tone?: "gray" | "blue" | "green" | "red" }> = ({
  children,
  tone = "gray",
}) => {
  const tones: Record<string, string> = {
    gray: "bg-gray-100 text-gray-700 border-gray-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border ${tones[tone]}`}>
      {children}
    </span>
  );
};

const Segmented: React.FC<{
  name: `questions.${number}.answerType`;
  value: string | undefined;
  onChange: (v: Q["answerType"]) => void;
}> = ({ name, value, onChange }) => {
  const options: Q["answerType"][] = ["TEXT", "YES_NO", "FILE_UPLOAD"];
  return (
    <div className="inline-flex rounded-lg border bg-white overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          aria-pressed={value === opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 text-sm transition ${
            value === opt ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {opt.replace("_", " / ")}
        </button>
      ))}
    </div>
  );
};

const QuestionsSection: React.FC = () => {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  const { fields, append, remove, move } = useFieldArray({ control, name: "questions" });
  const questions = watch("questions") || [];

  // top-level error (from zod refine)
  const questionsError = (errors as any)?.questions?.message as string | undefined;

  // local expand/collapse state by field.id
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const toggleOpen = useCallback((id: string) => {
    setOpenMap((m) => ({ ...m, [id]: !m[id] }));
  }, []);

  const addOne = () => append({ ...emptyRow(), order: questions.length });
  const addTemplates = () => {
    const base = questions.length || 0;
    append(TEMPLATES.map((t, i) => ({ ...t, order: base + i })));
  };

  const reindexOrders = () => {
    (questions || []).forEach((_, i) => setValue(`questions.${i}.order`, i));
  };

  // keyboard reordering: Alt+ArrowUp / Alt+ArrowDown on the prompt input
  const onPromptKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();
      if (e.key === "ArrowUp" && idx > 0) move(idx, idx - 1);
      if (e.key === "ArrowDown" && idx < fields.length - 1) move(idx, idx + 1);
      requestAnimationFrame(reindexOrders);
    }
  };

  return (
    <div className="rounded-2xl border p-5 space-y-4 shadow-sm bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-lg">Customer Questions</h3>
          <p className="text-xs text-gray-500">
            Collect details from buyers at checkout. Reorder with ↑/↓ (hold{" "}
            <kbd className="px-1 border rounded">Alt</kbd>).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={addTemplates} className="px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 text-sm">
            + Quick add templates
          </button>
          <button type="button" onClick={addOne} className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm">
            + Add question
          </button>
        </div>
      </div>

      {/* Inline error banner from schema */}
      {questionsError && (
        <div role="alert" className="rounded border border-red-200 bg-red-50 text-red-700 p-2 text-sm">
          {questionsError}
        </div>
      )}

      {!fields.length && (
        <div className="text-sm text-gray-500 border rounded-lg p-3 bg-gray-50">
          No questions yet. Click <b>+ Add question</b> or use <b>Quick add templates</b>.
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
              <Badge tone={type === "FILE_UPLOAD" ? "blue" : type === "YES_NO" ? "green" : "gray"}>{type}</Badge>
              {requiredVal ? <Badge tone="red">required</Badge> : <Badge>optional</Badge>}
              {!activeVal && <Badge tone="gray">inactive</Badge>}
            </div>
          );

          return (
            <div key={field.id} className="border rounded-xl bg-white shadow-sm overflow-hidden">
              {/* header */}
              <div className="flex items-center gap-3 px-3 py-2 border-b">
                <button
                  type="button"
                  onClick={() => toggleOpen(field.id)}
                  className="shrink-0 w-7 h-7 rounded-md border hover:bg-gray-50 grid place-items-center"
                  aria-label={expanded ? "Collapse" : "Expand"}
                >
                  <span className={`transition-transform ${expanded ? "rotate-90" : ""}`}>▸</span>
                </button>

                <div className="w-10">
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1 text-sm"
                    aria-label="Order"
                    {...register(`questions.${index}.order`, { valueAsNumber: true })}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">
                    {promptVal?.trim() ? promptVal : <span className="text-gray-400">Untitled question</span>}
                  </div>
                  <div className="text-xs text-gray-500">{headerBadges}</div>
                </div>

                {/* actions */}
                <div className="flex items-center gap-1">
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
                    onClick={() => index < fields.length - 1 && move(index, index + 1)}
                    className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => append({ ...(questions[index] ?? emptyRow()), order: index + 1 })}
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

              {/* body */}
              {expanded && (
                <div className="p-3 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600">Prompt</label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-1"
                        placeholder="Enter the question displayed to customer"
                        {...register(`questions.${index}.prompt`)}
                        onKeyDown={(e) => onPromptKeyDown(index, e)}
                      />
                    </div>

                    <div className="sm:w-[240px]">
                      <label className="block text-xs text-gray-600 mb-1">Answer Type</label>
                      <Segmented
                        name={`questions.${index}.answerType`}
                        value={type}
                        onChange={(v) => setValue(`questions.${index}.answerType`, v, { shouldValidate: true })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" {...register(`questions.${index}.isRequired`)} />
                      <span className="text-sm">Required</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" defaultChecked {...register(`questions.${index}.isActive`)} />
                      <span className="text-sm">Active</span>
                    </label>
                  </div>

                  {type === "FILE_UPLOAD" && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600">Max Files</label>
                        <input
                          type="number"
                          className="w-full border rounded px-2 py-1"
                          placeholder="e.g. 1"
                          {...register(`questions.${index}.maxFiles`, {
                            setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600">Max Size (MB)</label>
                        <input
                          type="number"
                          className="w-full border rounded px-2 py-1"
                          placeholder="e.g. 5"
                          {...register(`questions.${index}.maxSizeMB`, {
                            setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
                          })}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Metadata (JSON)</label>
                    <MetadataEditor
                      value={questions[index]?.metadata as Record<string, unknown> | null | undefined}
                      onChange={(obj) => setValue(`questions.${index}.metadata`, obj)}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!!fields.length && (
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={reindexOrders}
            className="px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 text-sm"
            title="Set order = visible position"
          >
            Reindex orders by position
          </button>
          <div className="text-xs text-gray-500">
            Tip: Hold <kbd className="px-1 border rounded">Alt</kbd> and press{" "}
            <kbd className="px-1 border rounded">↑</kbd>/<kbd className="px-1 border rounded">↓</kbd> in the Prompt field to
            reorder quickly.
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsSection;

/* ------------------ small JSON editor ------------------ */

const MetadataEditor: React.FC<{
  value: Record<string, unknown> | null | undefined;
  onChange: (obj: Record<string, unknown> | null) => void;
}> = ({ value, onChange }) => {
  const [text, setText] = useState(() => (value ? JSON.stringify(value, null, 2) : ""));
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
      } else {
        setError("Metadata must be a JSON object.");
      }
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
        <p className="text-xs text-gray-600">Paste JSON to control UI/validation (optional)</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={pretty} className="text-xs px-2 py-1 border rounded hover:bg-gray-50">
            Prettify
          </button>
          <button type="button" onClick={clear} className="text-xs px-2 py-1 border rounded hover:bg-gray-50">
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
        <span className={`text-xs ${error ? "text-red-600" : "text-gray-400"}`}>{error || "Valid JSON object or leave blank."}</span>
        <span className="text-[10px] text-gray-400">{text.length} chars</span>
      </div>
    </div>
  );
};
