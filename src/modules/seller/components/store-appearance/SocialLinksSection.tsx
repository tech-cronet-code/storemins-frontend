import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { X } from "lucide-react";
import { SocialMediaLink } from "../../types/storeTypes";
import { storeSettingsSchema } from "../../Schemas/storeSettingsSchema";
import { z } from "zod";


type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;

/* -------- supported platforms -------- */
const allPlatforms = [
  { id: "facebook",  label: "Facebook",  icon: "📘" },
  { id: "youtube",   label: "Youtube",   icon: "📺" },
  { id: "instagram", label: "Instagram", icon: "📸" },
  { id: "linkedin",  label: "Linkedin",  icon: "💼" },
  { id: "pinterest", label: "Pinterest", icon: "📌" },
  { id: "twitter",   label: "Twitter",   icon: "🐦" },
  { id: "telegram",  label: "Telegram",  icon: "✈️" },
  { id: "threads",   label: "Threads",   icon: "🧵" },
  { id: "whatsapp",  label: "Whatsapp",  icon: "💬" },
];

const SocialLinksSection: React.FC = () => {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<StoreSettingsInput>();

  const { fields, append, remove } = useFieldArray<
    StoreSettingsInput,
    "socialMediaLinks",
    "id"
  >({
    control,
    name: "socialMediaLinks",
  });

  const [showModal, setShowModal] = useState(false);

  /* selected platform IDs */
  const currentPlatforms =
    (watch("socialMediaLinks") as SocialMediaLink[])?.map((l) => l.platform) ??
    [];

  const togglePlatform = (platformId: string) => {
    const idx = fields.findIndex((f) => f.platform === platformId);
    if (idx !== -1) remove(idx);
    else append({ platform: platformId, url: "", icon: "" });
  };

  /* ---------------- UI ---------------- */
  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 lg:p-8 space-y-4">
        <header>
          <h3 className="text-lg font-semibold text-gray-800">
            Social Media Links
          </h3>
          <p className="text-sm text-gray-500">
            These links will appear on your public store page
          </p>
        </header>

        {fields.map((field, index) => {
          const platform = allPlatforms.find((p) => p.id === field.platform);
          const errMsg =
            errors.socialMediaLinks?.[index]?.url?.message as string | undefined;

          return (
            <div key={field.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl w-7">{platform?.icon}</span>

                <input
                  {...register(`socialMediaLinks.${index}.url` as const)}
                  placeholder={`Enter ${platform?.label} link`}
                  className={`flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none ${
                    errMsg
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />

                <button type="button" onClick={() => remove(index)}>
                  <X className="text-gray-500 hover:text-red-500" size={16} />
                </button>
              </div>

              {errMsg && (
                <p className="text-xs text-red-600 ml-9">{errMsg}</p>
              )}
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add Links
        </button>
      </div>

      {/* ---------- platform picker modal ---------- */}
      {showModal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/20"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-[90%] max-w-md relative animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Select Platforms
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </header>

            <div className="grid grid-cols-3 gap-4">
              {allPlatforms.map((p) => {
                const isSel = currentPlatforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatform(p.id)}
                    className={`relative flex flex-col items-center justify-center gap-1 rounded-lg border p-3 text-xs transition-all ${
                      isSel
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <span className="text-[13px] font-medium">{p.label}</span>
                    {isSel && (
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white" />
                    )}
                  </button>
                );
              })}
            </div>

            <style>{`
              @keyframes slideIn {
                from { transform: translateY(30px); opacity: 0; }
                to   { transform: translateY(0); opacity: 1; }
              }
              .animate-slideIn { animation: slideIn .25s ease-out; }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialLinksSection;
