// src/modules/customer/pages/CustomerAddressesPage.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* =================== Types =================== */
type AddressKind = "home" | "work" | "other";

type CustomerAddress = {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  kind: AddressKind;
  isDefault?: boolean;
  createdAt: number;
};

/* =================== Tiny inline icons =================== */
const Icon = {
  Back: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path
        d="M15 18 9 12l6-6"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Home: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path
        d="M3 10.5 12 4l9 6.5V20a2 2 0 0 1-2 2h-5v-6H10v6H5a2 2 0 0 1-2-2v-9.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  Work: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path
        d="M9 4h6a2 2 0 0 1 2 2v2h3a2 2 0 0 1 2 2v7a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-7a2 2 0 0 1 2-2h3V6a2 2 0 0 1 2-2Zm0 4h6V6H9v2Z"
        fill="currentColor"
      />
    </svg>
  ),
  Pin: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  Edit: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path
        d="m3 17.25 10.06-10.06a1.5 1.5 0 0 1 2.12 0l1.63 1.63a1.5 1.5 0 0 1 0 2.12L6.75 21H3v-3.75Z"
        fill="currentColor"
      />
    </svg>
  ),
  Trash: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path
        d="M6 7h12l-1 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Zm3-3h6l1 2H8l1-2Z"
        fill="currentColor"
      />
    </svg>
  ),
  Check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path
        d="m20 6-11 11-5-5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Plus: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M11 5h2v14h-2zM5 11h14v2H5z" fill="currentColor" />
    </svg>
  ),
};

/* =================== Demo data =================== */
const now = Date.now();
const demo: CustomerAddress[] = [
  {
    id: "a1",
    label: "Home",
    line1: "TuretwsT, Old City, Tajpur Panch Pipli, Khamasa",
    city: "Ahmedabad",
    state: "Gujarat",
    postalCode: "380001",
    country: "India",
    kind: "home",
    isDefault: true,
    createdAt: now - 300000,
  },
  {
    id: "a2",
    label: "Vi",
    line1: "H, Vijay Para, Visnagar",
    city: "Visnagar",
    state: "Gujarat",
    postalCode: "384315",
    country: "India",
    kind: "other",
    isDefault: false,
    createdAt: now - 200000,
  },
  {
    id: "a3",
    label: "Tettt",
    line1: "Wheh, Kirby Place, Delhi Cantonment",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110010",
    country: "India",
    kind: "other",
    isDefault: false,
    createdAt: now - 100000,
  },
];

/* =================== Helpers =================== */
const kindIcon = (k: AddressKind) =>
  k === "home" ? (
    <Icon.Home className="h-4 w-4 text-violet-600" />
  ) : k === "work" ? (
    <Icon.Work className="h-4 w-4 text-violet-600" />
  ) : (
    <Icon.Pin className="h-4 w-4 text-violet-600" />
  );

function chip(label: string, active = false) {
  return [
    "px-3 py-1.5 text-xs font-semibold rounded-full transition",
    active
      ? "bg-violet-600 text-white shadow-[0_1px_0_0_rgba(0,0,0,0.15)]"
      : "text-slate-700 hover:bg-white/70",
  ].join(" ");
}

function pill(text: string, tone: "emerald" | "slate" = "slate", extra = "") {
  const tones =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-slate-50 text-slate-700 ring-slate-200";
  return `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${tones} ${extra}`;
}

function randomId() {
  if ("randomUUID" in crypto) return (crypto as any).randomUUID();
  return Math.random().toString(36).slice(2);
}

function emptyDraft(): CustomerAddress {
  return {
    id: `tmp-${randomId()}`,
    label: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    kind: "home",
    isDefault: false,
    createdAt: Date.now(),
  };
}

/* =================== Card =================== */
function AddressCard({
  a,
  onSetDefault,
  onEdit,
  onDelete,
}: {
  a: CustomerAddress;
  onSetDefault: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={[
        "rounded-3xl bg-white/90 backdrop-blur ring-1 ring-black/10 shadow-sm hover:shadow transition",
        a.isDefault ? "outline outline-1 outline-emerald-200" : "",
      ].join(" ")}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="mt-1">{kindIcon(a.kind)}</div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-[15px] font-semibold text-slate-900 tracking-tight">
                {a.label}
              </div>
              {a.isDefault && <span className={pill("Default", "emerald")} />}
            </div>

            <div className="mt-1 text-sm text-slate-600">
              {a.line1}
              {a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state}{" "}
              {a.postalCode}, {a.country}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {!a.isDefault && (
            <button
              onClick={onSetDefault}
              className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <Icon.Check className="h-3.5 w-3.5" />
              Set default
            </button>
          )}

          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1 rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            <Icon.Edit className="h-3.5 w-3.5" />
            Edit
          </button>

          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
          >
            <Icon.Trash className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

/* =================== Slide-over (Add/Edit) =================== */
type SheetState =
  | { open: false }
  | { open: true; mode: "create" | "edit"; draft: CustomerAddress };

function Field({
  label,
  value,
  onChange,
  className = "",
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={onChange}
        className={[
          "w-full rounded-xl border px-3 py-2 text-sm",
          "border-slate-300 bg-white/90 focus:border-violet-400",
          "focus:outline-none focus:ring-4 focus:ring-violet-100",
          className,
        ].join(" ")}
      />
    </label>
  );
}

/* =================== Page =================== */
export default function CustomerAddressesPage() {
  const navigate = useNavigate();

  // Demo state
  const [items, setItems] = useState<CustomerAddress[]>(demo);
  const [kindFilter, setKindFilter] = useState<"all" | AddressKind>("all");
  const [sheet, setSheet] = useState<SheetState>({ open: false });

  // Default first, then recency
  const sorted = useMemo(() => {
    const list = [...items];
    list.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return b.createdAt - a.createdAt;
    });
    return list;
  }, [items]);

  const filtered = useMemo(() => {
    if (kindFilter === "all") return sorted;
    return sorted.filter((x) => x.kind === kindFilter);
  }, [sorted, kindFilter]);

  const setDefault = (id: string) => {
    setItems((prev) => prev.map((x) => ({ ...x, isDefault: x.id === id })));
  };

  const startCreate = () =>
    setSheet({ open: true, mode: "create", draft: emptyDraft() });

  const startEdit = (a: CustomerAddress) =>
    setSheet({ open: true, mode: "edit", draft: { ...a } });

  const remove = (id: string) =>
    setItems((prev) => prev.filter((x) => x.id !== id));

  const saveDraft = () => {
    if (!sheet.open) return;
    const d = sheet.draft;
    if (!d.label || !d.line1 || !d.city || !d.state || !d.postalCode) return;

    if (sheet.mode === "create") {
      const newOne = { ...d, id: randomId(), createdAt: Date.now() };
      setItems((prev) => {
        const next = [...prev, newOne];
        return newOne.isDefault
          ? next.map((x) => ({ ...x, isDefault: x.id === newOne.id }))
          : next;
      });
    } else {
      setItems((prev) => prev.map((x) => (x.id === d.id ? { ...x, ...d } : x)));
      if (d.isDefault) {
        setItems((prev) =>
          prev.map((x) => ({ ...x, isDefault: x.id === d.id }))
        );
      }
    }
    setSheet({ open: false });
  };

  return (
    <div className="min-h-dvh bg-[color:rgb(247,248,250)]">
      {/* ===== Header with glass effect ===== */}
      <div className="relative">
        <div className="h-40 bg-[linear-gradient(115deg,#7C3AED,55%,#C026D3_90%)]" />
        <div className="absolute inset-x-0 top-0">
          <div className="max-w-3xl mx-auto px-4 pt-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="h-10 w-10 rounded-full bg-white/15 text-white grid place-items-center backdrop-blur hover:bg-white/25 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-label="Back"
              >
                <Icon.Back className="h-5 w-5" />
              </button>

              <button
                onClick={startCreate}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-white font-semibold backdrop-blur hover:bg-white/25 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <Icon.Plus className="h-4 w-4" />
                Add New Address
              </button>
            </div>

            <div className="mt-6 text-white">
              <div className="text-[20px] font-semibold tracking-tight">
                Saved addresses
              </div>
              <div className="text-[12px] opacity-90">
                Manage delivery locations
              </div>
            </div>

            {/* chips */}
            <div className="mt-3 flex items-center justify-between">
              <div className="rounded-full bg-white/20 backdrop-blur p-1 ring-1 ring-white/25 inline-flex">
                <button
                  className={chip("All", kindFilter === "all")}
                  onClick={() => setKindFilter("all")}
                >
                  All
                </button>
                <button
                  className={chip("Home", kindFilter === "home")}
                  onClick={() => setKindFilter("home")}
                >
                  Home
                </button>
                <button
                  className={chip("Work", kindFilter === "work")}
                  onClick={() => setKindFilter("work")}
                >
                  Work
                </button>
                <button
                  className={chip("Other", kindFilter === "other")}
                  onClick={() => setKindFilter("other")}
                >
                  Other
                </button>
              </div>
              <div className="hidden sm:block text-[11px] text-white/90">
                {filtered.length} of {items.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== List ===== */}
      <div className="max-w-3xl mx-auto px-4 pb-24 pt-4 space-y-4">
        {filtered.map((a) => (
          <AddressCard
            key={a.id}
            a={a}
            onSetDefault={() => setDefault(a.id)}
            onEdit={() => startEdit(a)}
            onDelete={() => remove(a.id)}
          />
        ))}

        {/* Secondary add button at bottom */}
        <div className="pt-2">
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50"
          >
            <span className="h-5 w-5 grid place-items-center rounded-xl bg-violet-50 ring-1 ring-violet-200">
              <Icon.Plus className="h-4 w-4 text-violet-700" />
            </span>
            Add New Address
          </button>
        </div>
      </div>

      {/* ===== Slide-over sheet ===== */}
      {sheet.open && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/35"
            onClick={() => setSheet({ open: false })}
          />
          <div className="absolute inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[520px]">
            <div className="h-auto sm:h-full rounded-t-3xl sm:rounded-none sm:rounded-l-3xl bg-white shadow-2xl ring-1 ring-black/10 p-5">
              <div className="flex items-center justify-between">
                <div className="text-[15px] font-semibold">
                  {sheet.mode === "create" ? "Add address" : "Edit address"}
                </div>
                <button
                  onClick={() => setSheet({ open: false })}
                  className="text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Field
                  label="Label (Home, Work, …)"
                  value={sheet.draft.label}
                  onChange={(e) =>
                    setSheet((s) =>
                      s.open
                        ? { ...s, draft: { ...s.draft, label: e.target.value } }
                        : s
                    )
                  }
                  className="col-span-2"
                  placeholder="e.g., Home"
                />

                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600">
                    Type
                  </span>
                  <select
                    value={sheet.draft.kind}
                    onChange={(e) =>
                      setSheet((s) =>
                        s.open
                          ? {
                              ...s,
                              draft: {
                                ...s.draft,
                                kind: e.target.value as AddressKind,
                              },
                            }
                          : s
                      )
                    }
                    className="rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="mt-6 inline-flex items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={sheet.draft.isDefault ?? false}
                    onChange={(e) =>
                      setSheet((s) =>
                        s.open
                          ? {
                              ...s,
                              draft: {
                                ...s.draft,
                                isDefault: e.target.checked,
                              },
                            }
                          : s
                      )
                    }
                    className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-400"
                  />
                  Make this my default address
                </label>

                <Field
                  label="Address line 1"
                  value={sheet.draft.line1}
                  onChange={(e) =>
                    setSheet((s) =>
                      s.open
                        ? { ...s, draft: { ...s.draft, line1: e.target.value } }
                        : s
                    )
                  }
                  className="col-span-2"
                  placeholder="Street, area, landmark"
                />
                <Field
                  label="Address line 2 (optional)"
                  value={sheet.draft.line2 ?? ""}
                  onChange={(e) =>
                    setSheet((s) =>
                      s.open
                        ? { ...s, draft: { ...s.draft, line2: e.target.value } }
                        : s
                    )
                  }
                  className="col-span-2"
                  placeholder="Apartment, floor, etc."
                />
                <Field
                  label="City"
                  value={sheet.draft.city}
                  onChange={(e) =>
                    setSheet((s) =>
                      s.open
                        ? { ...s, draft: { ...s.draft, city: e.target.value } }
                        : s
                    )
                  }
                  placeholder="City"
                />
                <Field
                  label="State"
                  value={sheet.draft.state}
                  onChange={(e) =>
                    setSheet((s) =>
                      s.open
                        ? { ...s, draft: { ...s.draft, state: e.target.value } }
                        : s
                    )
                  }
                  placeholder="State"
                />
                <Field
                  label="PIN code"
                  value={sheet.draft.postalCode}
                  onChange={(e) =>
                    setSheet((s) =>
                      s.open
                        ? {
                            ...s,
                            draft: {
                              ...s.draft,
                              postalCode: e.target.value,
                            },
                          }
                        : s
                    )
                  }
                  placeholder="6-digit PIN"
                />
                <Field
                  label="Country"
                  value={sheet.draft.country}
                  onChange={(e) =>
                    setSheet((s) =>
                      s.open
                        ? {
                            ...s,
                            draft: { ...s.draft, country: e.target.value },
                          }
                        : s
                    )
                  }
                  placeholder="Country"
                />
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={saveDraft}
                  className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200"
                >
                  Save address
                </button>
                <button
                  onClick={() => setSheet({ open: false })}
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
