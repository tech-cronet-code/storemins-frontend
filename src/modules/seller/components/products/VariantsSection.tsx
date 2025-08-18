// components/ProductForm/VariantsSection.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, X } from "lucide-react";
import { useFormContext } from "react-hook-form";

type VariantDto = { optionName: string; optionValues: string[] };

type VariantOptionType = "size" | "color" | "custom";
type VariantOption = {
  id: number;
  type: VariantOptionType;
  name: string;         // used only for custom
  values: string[];
  activeColor?: string; // transient color picker value
};

const makeEmptyOption = (type: VariantOptionType = "custom"): VariantOption => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  type,
  name: type === "custom" ? "Custom" : "",
  values: [],
  activeColor: type === "color" ? "#000000" : undefined,
});

const optionDisplayName = (opt: VariantOption) =>
  opt.type === "color" ? "Color" : opt.type === "size" ? "Size" : (opt.name?.trim() || "Custom");

const VariantsSection: React.FC = () => {
  const { setValue, watch } = useFormContext();
  const [expanded, setExpanded] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [options, setOptions] = useState<VariantOption[]>([makeEmptyOption()]);

  // ✅ read from correct field
  const existing = watch("variants") as VariantDto[] | undefined;

  // hydrate once after ProductForm.reset populated "variants"
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (!hydratedRef.current && Array.isArray(existing) && existing.length) {
      const mapped: VariantOption[] = existing.map((v) => {
        const name = (v.optionName || "").trim();
        const lower = name.toLowerCase();
        const type: VariantOptionType =
          lower === "color" ? "color" : lower === "size" ? "size" : "custom";
        return {
          id: Date.now() + Math.floor(Math.random() * 1000),
          type,
          name: type === "custom" ? (name || "Custom") : "",
          values: Array.from(new Set((v.optionValues || []).map((x) => String(x).trim()).filter(Boolean))),
          activeColor: type === "color" ? "#000000" : undefined,
        };
      });
      setOptions(mapped);
      hydratedRef.current = true; // do not overwrite user edits subsequent times
    }
  }, [existing]);

  const addOption = () => setOptions((prev) => [...prev, makeEmptyOption()]);
  const removeOption = (id: number) => {
    setOptions((prev) => {
      const next = prev.filter((o) => o.id !== id);
      return next.length ? next : [makeEmptyOption()];
    });
  };
  const changeType = (id: number, type: VariantOptionType) => {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              type,
              name: type === "custom" ? (o.name || "Custom") : "",
              values: [],
              activeColor: type === "color" ? "#000000" : undefined,
            }
          : o
      )
    );
  };
  const changeName = (id: number, name: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, name } : o)));
  };
  const removeValue = (id: number, val: string) => {
    setOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, values: o.values.filter((v) => v !== val) } : o))
    );
  };
  const addTokenValue = (id: number, raw: string) => {
    const token = raw.trim();
    if (!token) return;
    setOptions((prev) =>
      prev.map((o) =>
        o.id === id && !o.values.includes(token)
          ? { ...o, values: [...o.values, token] }
          : o
      )
    );
  };
  const setActiveColor = (id: number, color: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, activeColor: color } : o)));
  };
  const addActiveColor = (id: number) => {
    const opt = options.find((o) => o.id === id);
    if (opt?.type !== "color" || !opt.activeColor) return;
    if (opt.values.includes(opt.activeColor)) return;
    setOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, values: [...o.values, opt.activeColor!] } : o))
    );
  };

  // Build BE payload
  const payload: VariantDto[] = useMemo(
    () =>
      options
        .map((o) => ({
          optionName: optionDisplayName(o),
          optionValues: Array.from(new Set(o.values.map((v) => String(v).trim()).filter(Boolean))),
        }))
        .filter((o) => o.optionName && o.optionValues.length > 0),
    [options]
  );

  const saveToForm = () => {
    setValue("variants", payload, { shouldDirty: true, shouldValidate: true });
    setModalOpen(false);
  };

  const clearAll = () => {
    setOptions([makeEmptyOption()]);
    setValue("variants", [], { shouldDirty: true, shouldValidate: true });
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div
          className="flex items-center justify-between px-6 py-5 cursor-pointer"
          onClick={() => setExpanded((x) => !x)}
        >
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900">Variants</h3>
            <p className="text-[14px] text-gray-500">
              Define option sets like Size, Color, or a custom attribute.
            </p>
          </div>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        {expanded && (
          <div className="border-t border-gray-200 px-6 py-6 space-y-4">
            {payload.length ? (
              <div className="space-y-3">
                {payload.map((p) => (
                  <div key={p.optionName}>
                    <div className="text-sm font-medium text-gray-800 mb-1">{p.optionName}</div>
                    <div className="flex flex-wrap gap-2">
                      {p.optionValues.map((v) => (
                        <span key={v} className="px-2 py-1 rounded-full bg-gray-100 text-sm">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No variants added yet.</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="text-[14px] font-medium text-[#0B5ED7] border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50"
              >
                Edit or add variants
              </button>
              {payload.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-[14px] text-red-600 border border-red-300 rounded-md px-4 py-2 hover:bg-red-50 inline-flex items-center gap-2"
                  title="Clear all variants"
                >
                  <Trash2 size={16} /> Clear all
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-[70vw] max-w-[900px] rounded-lg shadow-xl p-6 relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Add variants</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {options.map((opt) => (
                <div key={opt.id} className="w-full">
                  <div className="flex items-start gap-4">
                    {/* Type + optional name */}
                    <div className="w-[34%]">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Option type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={opt.type}
                        onChange={(e) => changeType(opt.id, e.target.value as VariantOptionType)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="size">Size</option>
                        <option value="color">Color Picker</option>
                        <option value="custom">Custom</option>
                      </select>

                      {opt.type === "custom" && (
                        <input
                          value={opt.name}
                          onChange={(e) => changeName(opt.id, e.target.value)}
                          placeholder="Option name (e.g., Material)"
                          className="mt-2 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>

                    {/* Values */}
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Option values <span className="text-red-500">*</span>
                      </label>

                      {opt.type === "color" ? (
                        <div className="w-full min-h-[42px] border border-gray-300 rounded px-3 py-2 flex items-center flex-wrap gap-2 text-sm">
                          {opt.values.map((val) => (
                            <span key={val} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: val }} />
                              <span>{val}</span>
                              <button
                                type="button"
                                className="text-gray-500 hover:text-red-600"
                                onClick={() => removeValue(opt.id, val)}
                              >
                                ×
                              </button>
                            </span>
                          ))}

                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={opt.activeColor || "#000000"}
                              onChange={(e) => setActiveColor(opt.id, e.target.value)}
                              className="w-10 h-10 border-none bg-transparent cursor-pointer p-0"
                              style={{ appearance: "none" }}
                            />
                            <button
                              type="button"
                              onClick={() => addActiveColor(opt.id)}
                              className="text-sm text-blue-600 border border-gray-300 rounded px-2 py-[2px] hover:bg-blue-50"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ) : (
                        <TokenInput
                          opt={opt}
                          onAdd={(val) => addTokenValue(opt.id, val)}
                          onBackspace={() => {
                            const last = opt.values.at(-1);
                            if (last) removeValue(opt.id, last);
                          }}
                          onRemove={(val) => removeValue(opt.id, val)}
                        />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeOption(opt.id)}
                      className="text-gray-500 hover:text-red-600 mt-7"
                      title="Remove option"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={addOption}
                className="inline-flex items-center gap-2 border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Plus size={16} /> Add another option
              </button>

              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveToForm}
                  className="px-4 py-2 text-sm bg-[#0B5ED7] hover:bg-[#0A53BE] text-white rounded"
                >
                  Add variants
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VariantsSection;

/* ---------- small token input for size/custom ---------- */
const TokenInput: React.FC<{
  opt: VariantOption;
  onAdd: (val: string) => void;
  onBackspace: () => void;
  onRemove: (val: string) => void;
}> = ({ opt, onAdd, onBackspace, onRemove }) => {
  const [val, setVal] = useState("");

  return (
    <div className="w-full min-h-[42px] border border-gray-300 rounded px-2 py-1 flex items-center flex-wrap gap-2 text-sm focus-within:ring-2 focus-within:ring-blue-500">
      {opt.values.map((v) => (
        <span key={v} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
          {v}
          <button type="button" className="ml-2 text-gray-500 hover:text-red-600" onClick={() => onRemove(v)}>
            ×
          </button>
        </span>
      ))}

      <input
        type="text"
        value={val}
        onChange={(e) => {
          const next = e.target.value;
          if (opt.type === "size" && /\D/.test(next)) return; // numeric only for size
          setVal(next);
        }}
        onKeyDown={(e) => {
          const token = val.trim();
          if (["Enter", ",", " "].includes(e.key)) {
            e.preventDefault();
            if (token) {
              onAdd(token);
              setVal("");
            }
          }
          if (e.key === "Backspace" && !val) {
            e.preventDefault();
            onBackspace();
          }
        }}
        placeholder={opt.type === "size" ? "Type a number and press Enter or ," : "Type and press Enter or ,"}
        className="flex-1 min-w-[120px] outline-none bg-transparent py-1 px-1"
      />
    </div>
  );
};
