import React, { useState } from "react";
import { ChevronDown, ChevronUp, X, Trash2 } from "lucide-react";
import { getColorName } from "../../common/utils";

interface VariantOption {
  id: number;
  name: string;
  type: "custom" | "size" | "color";
  values: string[];
  activeColor: string;
}

const VariantsSection: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [options, setOptions] = useState<VariantOption[]>([
    { id: 1, name: "", type: "custom", values: [], activeColor: "#000000" },
  ]);
  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});

  const addOption = () => {
    const newId = Date.now();
    setOptions((prev) => [
      ...prev,
      {
        id: newId,
        name: "",
        type: "custom",
        values: [],
        activeColor: "#000000",
      },
    ]);
    setInputValues((prev) => ({ ...prev, [newId]: "" }));
  };

  const removeOption = (id: number) => {
    setOptions((prev) => prev.filter((opt) => opt.id !== id));
    setInputValues((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateOption = (id: number, field: keyof VariantOption, value: any) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === id
          ? {
              ...opt,
              [field]: value,
              ...(field === "type"
                ? { values: [], activeColor: "#000000" }
                : {}),
            }
          : opt
      )
    );

    if (field === "type") {
      setInputValues((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const addColor = (id: number, color: string) => {
    setOptions((prev) =>
      prev.map((opt) => {
        if (opt.id === id && !opt.values.includes(color)) {
          return { ...opt, values: [...opt.values, color], activeColor: color };
        }
        return opt;
      })
    );
  };

  const removeValue = (id: number, value: string) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === id
          ? { ...opt, values: opt.values.filter((v) => v !== value) }
          : opt
      )
    );
  };

  const handleColorChange = (id: number, color: string) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, activeColor: color } : opt))
    );
  };

  const saveActiveColor = (id: number) => {
    const opt = options.find((o) => o.id === id);
    if (opt && opt.activeColor && !opt.values.includes(opt.activeColor)) {
      addColor(id, opt.activeColor);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-200">
        <div
          className="flex items-center justify-between px-6 py-5 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900">
              Variants
            </h3>
            <p className="text-[14px] text-gray-500">
              Customize variants for size, color, and more to cater to all your
              customers’ preferences.
            </p>
          </div>
          {expanded ? (
            <ChevronUp size={20} className="text-gray-800" />
          ) : (
            <ChevronDown size={20} className="text-gray-800" />
          )}
        </div>

        {expanded && (
          <div className="border-t border-gray-200 px-6 py-6 text-center">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="text-[14px] font-medium text-[#0B5ED7] border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 hover:border-gray-400 transition"
            >
              Add variants
            </button>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-[70vw] max-w-[900px] min-h-[450px] rounded-lg shadow-xl p-8 relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Add variants
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {options.map((opt) => (
                <div key={opt.id} className="w-full">
                  <div className="flex items-start gap-4">
                    {/* Option name */}
                    <div className="w-[30%]">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Option name <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center">
                        <select
                          value={opt.type}
                          onChange={(e) =>
                            updateOption(opt.id, "type", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm leading-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{
                            height: "42px",
                            lineHeight: "1.25rem",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                          }}
                        >
                          <option value="size">Size</option>
                          <option value="color">Color Picker</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                    </div>

                    {/* Option values */}
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Option values <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {opt.type === "color" ? (
                          <div className="w-full min-h-[42px] border border-gray-300 rounded px-2 py-1 flex items-center flex-wrap gap-2 text-sm focus-within:ring-2 focus-within:ring-blue-500">
                            {opt.values.map((val, i) => (
                              <span
                                key={i}
                                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
                              >
                                <span
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: val }}
                                ></span>
                                {/* <span>{val}</span> */}
                                <span>{getColorName(val)}</span>
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
                                value={opt.activeColor}
                                onChange={(e) => {
                                  // Only update preview, don't save yet
                                  handleColorChange(opt.id, e.target.value);
                                }}
                                className="w-10 h-10 border-none bg-transparent cursor-pointer p-0"
                                style={{ appearance: "none" }}
                              />
                              <button
                                type="button"
                                onClick={() => saveActiveColor(opt.id)}
                                className="text-sm text-blue-600 border border-gray-300 rounded px-2 py-[2px] hover:bg-blue-50"
                              >
                                Add
                              </button>
                            </div>

                            {/* Invisible dummy text input to handle Backspace */}
                            <input
                              type="text"
                              className="w-[1px] h-[1px] opacity-0 absolute"
                              onKeyDown={(e) => {
                                if (e.key === "Backspace") {
                                  e.preventDefault();
                                  setOptions((prev) =>
                                    prev.map((option) =>
                                      option.id === opt.id
                                        ? {
                                            ...option,
                                            values: option.values.slice(0, -1),
                                          }
                                        : option
                                    )
                                  );
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-full min-h-[42px] border border-gray-300 rounded px-2 py-1 flex items-center flex-wrap gap-2 text-sm focus-within:ring-2 focus-within:ring-blue-500">
                            {opt.values.map((val, i) => (
                              <span
                                key={i}
                                className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                              >
                                {val}
                                <button
                                  type="button"
                                  onClick={() => removeValue(opt.id, val)}
                                  className="ml-2 text-gray-500 hover:text-red-600"
                                >
                                  ×
                                </button>
                              </span>
                            ))}

                            <input
                              type="text"
                              value={inputValues[opt.id] || ""}
                              onChange={(e) =>
                                setInputValues((prev) => ({
                                  ...prev,
                                  [opt.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                const input = inputValues[opt.id]?.trim();

                                // Enter/comma/space to add
                                if (["Enter", ",", " "].includes(e.key)) {
                                  e.preventDefault();
                                  if (input) {
                                    addColor(opt.id, input);
                                    setInputValues((prev) => ({
                                      ...prev,
                                      [opt.id]: "",
                                    }));
                                  }
                                }

                                // Backspace to remove last
                                if (e.key === "Backspace" && !input) {
                                  e.preventDefault();
                                  setOptions((prev) =>
                                    prev.map((option) =>
                                      option.id === opt.id
                                        ? {
                                            ...option,
                                            values: option.values.slice(0, -1),
                                          }
                                        : option
                                    )
                                  );
                                }
                              }}
                              placeholder="Type and press Enter or ,"
                              className="flex-1 min-w-[100px] outline-none bg-transparent"
                            />
                          </div>
                        )}

                        <button
                          onClick={() => removeOption(opt.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addOption}
              className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 mt-6"
            >
              + Add another option
            </button>

            <div className="text-center mt-6">
              <button
                type="button"
                className="bg-[#0B5ED7] hover:bg-[#0A53BE] text-white px-6 py-2 rounded text-sm font-medium"
              >
                Add variants
              </button>
              <p className="text-xs text-gray-500 mt-2">
                <span className="inline-block align-middle">ⓘ</span> You can add
                prices, images, quantity, etc after this step.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VariantsSection;
