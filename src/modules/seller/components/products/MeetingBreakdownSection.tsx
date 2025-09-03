// ---------- MeetingBreakdownSection.tsx ----------
import { useFormContext } from "react-hook-form";
import CollapsibleCard from "./CollapsibleCard";
import { useState } from "react";

const MeetingBreakdownSection: React.FC = () => {
  const { register } = useFormContext<any>();
  const [showExample, setShowExample] = useState(true);

  return (
    <section id="meeting-breakdown" className="scroll-mt-24">
      <CollapsibleCard
        title="Meeting breakdown"
        subtitle="Share the meeting format"
        defaultOpen
      >
        {/* Inline editor (no bottom sheet, no Add button) */}
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex gap-2 border-b px-3 py-2 text-gray-600 text-sm">
            <button
              type="button"
              className="px-2 py-1 rounded hover:bg-gray-100 font-semibold"
            >
              B
            </button>
            <button
              type="button"
              className="px-2 py-1 rounded hover:bg-gray-100"
            >
              • List
            </button>
            <button
              type="button"
              className="px-2 py-1 rounded hover:bg-gray-100"
            >
              1. List
            </button>
          </div>
          <textarea
            rows={8}
            placeholder="Type here..."
            className="w-full resize-y bg-white px-4 py-3 outline-none placeholder:text-gray-400"
            {...register("meetingBreakdown")}
          />
        </div>

        {showExample && (
          <div className="mt-3 rounded-xl bg-purple-50 p-4 text-sm text-gray-700 relative">
            <div className="font-medium mb-1">Example for career guidance:</div>
            <ul className="list-disc pl-5 space-y-0.5 text-gray-600">
              <li>Introductions: 5–10 minutes</li>
              <li>Career Goals Discussion: 15–20 mins</li>
              <li>Skills Assessment: 15–20 mins</li>
              <li>Career Planning: 10–15 mins</li>
            </ul>
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
              onClick={() => setShowExample(false)}
              aria-label="Dismiss example"
            >
              ✕
            </button>
          </div>
        )}
      </CollapsibleCard>
    </section>
  );
};

export default MeetingBreakdownSection;
