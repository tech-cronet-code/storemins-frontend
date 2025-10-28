/* src/pages/orders/DeliveryTimeModal.tsx */
import React, { useState } from "react";
import { X } from "lucide-react";

type Payload = {
  preset?:
    | "10-30m"
    | "30-60m"
    | "1-2h"
    | "2-4h"
    | "4-8h"
    | "8-24h"
    | "2-3d"
    | "4-6d"
    | "7-10d"
    | "10+d";
  date?: string; // yyyy-mm-dd
  time?: string; // HH:mm
};

const Chip = ({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-3 h-9 rounded-full border text-sm ${
      active
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white border-slate-300 hover:bg-slate-50"
    }`}
  >
    {children}
  </button>
);

const DeliveryTimeModal: React.FC<{
  onClose: () => void;
  onConfirm: (payload: Payload) => void;
}> = ({ onClose, onConfirm }) => {
  const [preset, setPreset] = useState<Payload["preset"]>();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 p-3">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-[16px] font-semibold">Choose Delivery Time</div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 inline-flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Fast */}
          <div>
            <div className="text-[13px] font-semibold text-emerald-600 mb-2">
              Fast
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip
                active={preset === "10-30m"}
                onClick={() => setPreset("10-30m")}
              >
                10-30 mins
              </Chip>
              <Chip
                active={preset === "30-60m"}
                onClick={() => setPreset("30-60m")}
              >
                30-60 mins
              </Chip>
              <Chip
                active={preset === "1-2h"}
                onClick={() => setPreset("1-2h")}
              >
                1-2 hrs
              </Chip>
            </div>
          </div>

          {/* Medium */}
          <div>
            <div className="text-[13px] font-semibold text-amber-600 mb-2">
              Medium
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip
                active={preset === "2-4h"}
                onClick={() => setPreset("2-4h")}
              >
                2-4 hrs
              </Chip>
              <Chip
                active={preset === "4-8h"}
                onClick={() => setPreset("4-8h")}
              >
                4-8 hrs
              </Chip>
              <Chip
                active={preset === "8-24h"}
                onClick={() => setPreset("8-24h")}
              >
                8-24 hrs
              </Chip>
            </div>
          </div>

          {/* Will take time */}
          <div>
            <div className="text-[13px] font-semibold text-rose-600 mb-2">
              Will Take Time
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip
                active={preset === "2-3d"}
                onClick={() => setPreset("2-3d")}
              >
                2-3 days
              </Chip>
              <Chip
                active={preset === "4-6d"}
                onClick={() => setPreset("4-6d")}
              >
                4-6 days
              </Chip>
              <Chip
                active={preset === "7-10d"}
                onClick={() => setPreset("7-10d")}
              >
                7-10 days
              </Chip>
              <Chip
                active={preset === "10+d"}
                onClick={() => setPreset("10+d")}
              >
                10+ days
              </Chip>
            </div>
          </div>

          {/* Custom date/time */}
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <div>
              <div className="text-[13px] text-slate-600 mb-1">Select Date</div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm"
              />
            </div>
            <div>
              <div className="text-[13px] text-slate-600 mb-1">
                Select Time (Optional)
              </div>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-lg border border-slate-200 text-slate-700 text-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ preset, date, time })}
            className="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTimeModal;
