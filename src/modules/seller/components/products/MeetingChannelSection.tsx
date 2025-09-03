// ============================================
// src/modules/seller/components/products/meeting/MeetingChannelSection.tsx
// Collapsible card; grid of channel tiles; centered modal with readonly Name for base channels
// ============================================
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Video,
  Phone,
  MessageCircle,
  FileText,
  Plus,
  Link as LinkIcon,
} from "lucide-react";
import CollapsibleCard from "./CollapsibleCard";
import { createPortal } from "react-dom";

interface Tile {
  key: string;
  label: string;
  icon?: React.ReactNode;
}
interface CustomChannel {
  label: string;
  url: string;
}
type ModalMode = "base" | "custom-new" | "custom-edit";

const MeetingChannelSection: React.FC = () => {
  const { setValue, watch } = useFormContext<any>();
  const selected = watch("meetingChannel");
  const custom: CustomChannel | undefined = watch("customChannel"); // single custom only
  const channelLinks: Record<string, string> = watch("channelLinks") || {}; // per-channel saved links

  const baseTiles: Tile[] = useMemo(
    () => [
      { key: "gmeet", label: "G-Meet", icon: <Video size={18} /> },
      { key: "zoom", label: "ZOOM", icon: <Video size={18} /> },
      { key: "whatsapp", label: "WhatsApp", icon: <MessageCircle size={18} /> },
      { key: "phone", label: "Phone call", icon: <Phone size={18} /> },
      { key: "form", label: "Form", icon: <FileText size={18} /> },
      { key: "endn", label: "Endn" },
      { key: "hshd", label: "Hshd" },
    ],
    []
  );

  // ---------- Modal state ----------
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("base");
  const [nameReadonly, setNameReadonly] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});

  const openForBase = (t: Tile) => {
    setMode("base");
    setNameReadonly(true);
    setName(t.label);
    setUrl(channelLinks[t.key] || "");
    setActiveKey(t.key);
    setErrors({});
    setModalOpen(true);
  };

  const openAddOrEditCustom = () => {
    setMode(custom ? "custom-edit" : "custom-new");
    setNameReadonly(false);
    setName(custom?.label ?? "");
    setUrl(custom?.url ?? "");
    setActiveKey("custom");
    setErrors({});
    setModalOpen(true);
  };

  const chooseCustomTile = () => {
    if (!custom) return;
    setValue("meetingChannel", custom.label, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("meetingChannelUrl", custom.url, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const normalizeUrl = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return trimmed;
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  const validate = (n: string, u: string) => {
    const next: { name?: string; url?: string } = {};
    if (!n.trim()) next.name = "Channel name is required.";
    const norm = normalizeUrl(u);
    try {
      new URL(norm || "");
    } catch {
      next.url = "Enter a valid URL (e.g., https://example.com)";
    }
    setErrors(next);
    return Object.keys(next).length === 0 ? norm : null;
  };

  const saveModal = () => {
    const norm = validate(name, url);
    if (!norm) return;

    if (mode === "base" && activeKey) {
      // Save link per base channel + select it
      setValue(
        "channelLinks",
        { ...(channelLinks || {}), [activeKey]: norm },
        { shouldDirty: true }
      );
      setValue("meetingChannel", name, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("meetingChannelUrl", norm, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } else {
      // custom-new / custom-edit
      const payload: CustomChannel = { label: name.trim(), url: norm };
      setValue("customChannel", payload, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("customChannels", [payload.label], { shouldDirty: true }); // backward compat
      setValue("meetingChannel", payload.label, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("meetingChannelUrl", payload.url, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    setModalOpen(false);
  };

  // ----- Modal helpers: ESC close, focus trap, body scroll lock -----
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => firstInputRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [modalOpen]);

  // ---------- UI ----------
  const tiles: Tile[] = [
    ...baseTiles,
    ...(custom?.label
      ? [{ key: "custom", label: custom.label, icon: <LinkIcon size={18} /> }]
      : []),
  ];

  return (
    <section id="meeting-channel" className="scroll-mt-24">
      <CollapsibleCard
        title="Meeting channel"
        subtitle="Where will the meeting happen"
      >
        <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-3xl">
          {tiles.map((t) => {
            const savedUrl =
              t.key === "custom" ? custom?.url : channelLinks?.[t.key];
            const isSelected = selected === t.label;
            const onTileClick =
              t.key === "custom" ? chooseCustomTile : () => openForBase(t);

            return (
              <button
                key={t.key}
                type="button"
                onClick={onTileClick}
                className={
                  "relative rounded-2xl border px-3 py-4 text-left shadow-sm transition " +
                  (isSelected
                    ? "border-indigo-600 ring-2 ring-indigo-600/30"
                    : "border-gray-200 hover:border-gray-300")
                }
                aria-pressed={isSelected}
              >
                <div
                  className="absolute top-2 right-2 h-4 w-4 rounded-full border-2"
                  style={{
                    borderColor: isSelected ? "rgb(79 70 229)" : "#e5e7eb",
                  }}
                >
                  {isSelected && (
                    <div className="m-[2px] h-2 w-2 rounded-full bg-indigo-600" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                    {t.icon ?? <Video size={18} />}
                  </div>
                  <div className="font-medium text-gray-800">{t.label}</div>
                </div>
                {savedUrl && (
                  <div className="mt-2 text-xs text-gray-500 truncate">
                    {savedUrl}
                  </div>
                )}
              </button>
            );
          })}

          {/* Add/Edit single custom channel */}
          <button
            type="button"
            onClick={openAddOrEditCustom}
            className="relative rounded-2xl border border-dashed border-orange-300 px-3 py-4 text-left shadow-sm hover:border-orange-400"
            aria-haspopup="dialog"
            aria-controls="add-channel-modal"
          >
            <div className="absolute top-2 right-2 h-4 w-4 rounded-full border-2 border-gray-200"></div>
            <div className="flex items-center gap-2 text-orange-600">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
                <Plus size={18} />
              </div>
              <div className="font-medium">
                {custom ? "Edit channel" : "+ Add channel"}
              </div>
            </div>
          </button>
        </div>

        {selected && (
          <div className="mt-3 text-sm text-gray-600">
            Selected:{" "}
            <span className="font-medium text-gray-800">{selected}</span>
          </div>
        )}
      </CollapsibleCard>

      {/* Centered Modal */}
      {modalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 grid place-items-center p-4"
            aria-labelledby="add-channel-title"
            role="dialog"
            aria-modal="true"
            id="add-channel-modal"
          >
            {/* overlay */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
              onClick={() => setModalOpen(false)}
            />

            {/* dialog */}
            <div
              ref={dialogRef}
              className="relative w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-black/5 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <h2
                  id="add-channel-title"
                  className="font-semibold text-gray-900"
                >
                  {mode === "base"
                    ? "Add meeting link"
                    : mode === "custom-edit"
                    ? "Edit communication channel"
                    : "Add a communication channel"}
                </h2>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full p-2 hover:bg-gray-100"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Name (readonly for base tiles) */}
              <label className="block">
                <span className="text-sm text-gray-600">Channel Name</span>
                <input
                  ref={firstInputRef}
                  className={
                    "mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 " +
                    (nameReadonly
                      ? "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed focus:ring-0"
                      : errors.name
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-indigo-500")
                  }
                  placeholder="e.g., Teams, Skype"
                  value={name}
                  readOnly={nameReadonly}
                  onChange={(e) => !nameReadonly && setName(e.target.value)}
                />
                {!nameReadonly && errors.name && (
                  <div className="mt-1 text-xs text-red-500">{errors.name}</div>
                )}
              </label>

              {/* Link */}
              <label className="block mt-3">
                <span className="text-sm text-gray-600">Link</span>
                <input
                  className={
                    "mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 " +
                    (errors.url
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-indigo-500")
                  }
                  placeholder="https://example.com/meeting/123"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  inputMode="url"
                  autoComplete="url"
                />
                {errors.url && (
                  <div className="mt-1 text-xs text-red-500">{errors.url}</div>
                )}
              </label>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveModal}
                  className="px-6 py-2 rounded-xl bg-gray-800 text-white hover:bg-gray-900"
                >
                  {mode === "base" ? "Save & Select" : custom ? "Save" : "Add"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default MeetingChannelSection;
