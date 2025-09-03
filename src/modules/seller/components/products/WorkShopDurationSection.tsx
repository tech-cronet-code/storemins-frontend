// src/modules/seller/components/products/WorkShopDurationSection.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  Check,
  CalendarDays,
  CalendarRange,
  Calendar,
  ListChecks,
} from "lucide-react";
import CollapsibleCard from "./CollapsibleCard";

type UnitKey = "days" | "weeks" | "months" | "sessions";

const UNITS: {
  key: UnitKey;
  labelPlural: string;
  labelSingular: string;
  hint: string;
}[] = [
  {
    key: "days",
    labelPlural: "Days",
    labelSingular: "Day",
    hint: "Good for short workshops",
  },
  {
    key: "weeks",
    labelPlural: "Weeks",
    labelSingular: "Week",
    hint: "Multi-week programs",
  },
  {
    key: "months",
    labelPlural: "Months",
    labelSingular: "Month",
    hint: "Long-term plans",
  },
  {
    key: "sessions",
    labelPlural: "Sessions",
    labelSingular: "Session",
    hint: "Count by sessions",
  },
];

const ICON: Record<UnitKey, React.ReactNode> = {
  days: <CalendarDays size={18} />,
  weeks: <CalendarRange size={18} />,
  months: <Calendar size={18} />,
  sessions: <ListChecks size={18} />,
};

const WorkShopDurationSection: React.FC = () => {
  const { register, setValue, control } = useFormContext<any>();

  // RHF fields
  const qty = useWatch({ control, name: "workshopDuration" }) as
    | number
    | string
    | undefined;
  const unitKey =
    (useWatch({ control, name: "workshopDurationUnit" }) as
      | UnitKey
      | undefined) ?? "days";

  // Modal state
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusIdx, setFocusIdx] = useState<number>(() =>
    Math.max(
      0,
      UNITS.findIndex((u) => u.key === unitKey)
    )
  );

  // Ensure a default value exists (safe for create & edit)
  useEffect(() => {
    if (unitKey == null)
      setValue("workshopDurationUnit", "days", { shouldDirty: false });
  }, [unitKey, setValue]);

  // Label for trigger button (singular/plural)
  const unitLabel = useMemo(() => {
    const meta = UNITS.find((u) => u.key === unitKey) ?? UNITS[0];
    const n = Number(qty);
    if (!Number.isFinite(n)) return meta.labelPlural;
    return n === 1 ? meta.labelSingular : meta.labelPlural;
  }, [qty, unitKey]);

  // Open modal: prime focus index & lock scroll
  useEffect(() => {
    if (!open) return;
    setFocusIdx(
      Math.max(
        0,
        UNITS.findIndex((u) => u.key === unitKey)
      )
    );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      } else if (
        (e.key === "ArrowDown" || e.key === "ArrowUp") &&
        dialogRef.current
      ) {
        e.preventDefault();
        setFocusIdx((idx) => {
          const next =
            e.key === "ArrowDown"
              ? (idx + 1) % UNITS.length
              : (idx - 1 + UNITS.length) % UNITS.length;
          optionRefs.current[next]?.focus();
          return next;
        });
      } else if (e.key === "Enter" && focusIdx >= 0) {
        e.preventDefault();
        const chosen = UNITS[focusIdx];
        if (chosen) {
          setValue("workshopDurationUnit", chosen.key, {
            shouldDirty: true,
            shouldValidate: true,
          });
          setOpen(false);
        }
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);

    const t = setTimeout(() => {
      const target = optionRefs.current[focusIdx] || dialogRef.current;
      target?.focus();
    }, 0);

    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const choose = (key: UnitKey) => {
    setValue("workshopDurationUnit", key, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setOpen(false);
  };

  return (
    <section id="workshop-duration" className="scroll-mt-24">
      <CollapsibleCard
        title="Workshop duration"
        subtitle="How long the workshop runs"
        defaultOpen
      >
        <div className="mt-1 grid max-w-xl grid-cols-2 gap-3">
          {/* Duration input */}
          <label className="block">
            <span className="text-sm text-gray-600">Duration</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("workshopDuration")}
              onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
            />
          </label>

          {/* Unit picker (modal trigger) */}
          <label className="block">
            <span className="text-sm text-gray-600">Day</span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-1 flex w-full items-center justify-between rounded-xl border border-gray-300 px-3 py-2 text-left outline-none transition hover:border-gray-400 focus:ring-2 focus:ring-indigo-500"
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls="unit-modal"
            >
              <span className="inline-flex items-center gap-2">
                <span className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-700">
                  {unitLabel}
                </span>
                <span className="text-xs text-gray-500">Change</span>
              </span>
              <ChevronDown className="shrink-0 opacity-70" size={18} />
            </button>
          </label>
        </div>
      </CollapsibleCard>

      {/* Centered Modal */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 grid place-items-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="unit-modal-title"
            id="unit-modal"
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
              onClick={() => setOpen(false)}
            />

            {/* Dialog */}
            <div
              ref={dialogRef}
              className="relative w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-black/5 transition-all duration-150 ease-out motion-safe:animate-[modalIn_.15s_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >
              <style>
                {`
                  @keyframes modalIn {
                    from { opacity: 0; transform: translateY(6px) scale(.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                  }
                `}
              </style>

              <div className="mb-2 flex items-center justify-between">
                <h2
                  id="unit-modal-title"
                  className="text-base font-semibold text-gray-900"
                >
                  Choose a unit type
                </h2>
                <button
                  type="button"
                  className="rounded-full p-2 hover:bg-gray-100"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                >
                  ✕
                </button>
              </div>

              <p className="mb-3 text-sm text-gray-500">
                Pick how you want to measure this workshop’s duration.
              </p>

              <div
                role="listbox"
                aria-activedescendant={`unit-opt-${focusIdx}`}
                className="space-y-2"
              >
                {UNITS.map((u, idx) => {
                  const active = u.key === unitKey;
                  return (
                    <button
                      key={u.key}
                      id={`unit-opt-${idx}`}
                      ref={(el) => (optionRefs.current[idx] = el)}
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={
                        "group flex w-full items-center justify-between rounded-xl border p-3 text-left transition " +
                        (active
                          ? "border-indigo-600 ring-2 ring-indigo-600/25"
                          : "border-gray-200 hover:border-gray-300")
                      }
                      onClick={() => choose(u.key)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                          {ICON[u.key]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {u.labelPlural}
                          </div>
                          <div className="text-xs text-gray-500">{u.hint}</div>
                        </div>
                      </div>
                      <div
                        className={
                          "flex h-5 w-5 items-center justify-center rounded-full border-2 " +
                          (active ? "border-indigo-600" : "border-gray-300")
                        }
                        aria-hidden="true"
                      >
                        {active && (
                          <Check size={14} className="text-indigo-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-gray-900 px-5 py-2 text-sm text-white hover:bg-black"
                >
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default WorkShopDurationSection;
