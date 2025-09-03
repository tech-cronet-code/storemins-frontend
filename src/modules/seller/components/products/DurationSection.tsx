// ============================================
// src/modules/seller/components/products/meeting/DurationSection.tsx
// Collapsible card; only "mins" unit (hrs removed)
// ============================================
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import CollapsibleCard from "./CollapsibleCard";

const DurationSection: React.FC = () => {
  const { register, setValue } = useFormContext<any>();

  // Force unit to mins (since UI has only mins)
  useEffect(() => {
    setValue("meetingDurationUnit", "mins", { shouldDirty: false, shouldValidate: false });
  }, [setValue]);

  return (
    <section id="meeting-duration" className="scroll-mt-24">
      <CollapsibleCard title="Duration" subtitle="How long will the meeting last?">
        <div className="grid grid-cols-[1fr_auto] gap-4 max-w-2xl">
          {/* Duration input */}
          <label className="block">
            <span className="sr-only">Duration</span>
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
              <input
                type="number"
                placeholder="Duration"
                min={0}
                className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                {...register("meetingDuration", { valueAsNumber: true })}
              />
            </div>
          </label>

          {/* Units (mins only) */}
          <div className="flex flex-col">
            <div className="text-[11px] -mb-2 ml-3 text-gray-400">Units</div>
            <div className="rounded-xl border border-indigo-600/80 ring-2 ring-indigo-600/30 px-6 py-3 shadow-sm select-none">
              <span className="text-gray-800">mins</span>
            </div>
          </div>
        </div>
      </CollapsibleCard>
    </section>
  );
};

export default DurationSection;