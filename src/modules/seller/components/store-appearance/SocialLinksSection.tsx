import React, { useState } from "react";
import { X } from "lucide-react";

// Static list of all social platforms
const allPlatforms = [
  { id: "facebook", label: "Facebook", icon: "📘" },
  { id: "youtube", label: "Youtube", icon: "📺" },
  { id: "instagram", label: "Instagram", icon: "📸" },
  { id: "linkedin", label: "Linkedin", icon: "💼" },
  { id: "pinterest", label: "Pinterest", icon: "📌" },
  { id: "twitter", label: "Twitter", icon: "🐦" },
  { id: "telegram", label: "Telegram", icon: "✈️" },
  { id: "threads", label: "Threads", icon: "🧵" },
  { id: "whatsapp", label: "Whatsapp", icon: "💬" },
];

const SocialLinksSection: React.FC = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "youtube",
    "instagram",
    "whatsapp",
    "linkedin",
    "facebook",
  ]);

  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);

  const handleLinkChange = (id: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [id]: value }));
  };

  const handleRemovePlatform = (id: string) => {
    setSelectedPlatforms((prev) => prev.filter((p) => p !== id));
    setSocialLinks((prev) => {
      const newLinks = { ...prev };
      delete newLinks[id];
      return newLinks;
    });
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 lg:p-8 space-y-4">
        {/* Heading */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Social Media Links
          </h3>
          <p className="text-sm text-gray-500">
            Social Media links will be shown in the website
          </p>
        </div>

        {/* Selected Platforms */}
        {selectedPlatforms.map((id) => {
          const platform = allPlatforms.find((p) => p.id === id);
          return (
            <div key={id} className="flex items-center gap-2">
              <div className="text-xl w-7">{platform?.icon}</div>
              <input
                type="text"
                value={socialLinks[id] || ""}
                onChange={(e) => handleLinkChange(id, e.target.value)}
                placeholder={`Enter ${platform?.label} link`}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={() => handleRemovePlatform(id)}>
                <X className="text-gray-500 hover:text-red-500" size={16} />
              </button>
            </div>
          );
        })}

        {/* Add Links */}
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add Links
        </button>
      </div>

      {/* Select Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 transition-all"
          onClick={() => setShowModal(false)} // outside click
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-[90%] max-w-md relative animate-slideIn"
            onClick={(e) => e.stopPropagation()} // stop close on content click
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Select</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-4">
              {allPlatforms.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => togglePlatform(platform.id)}
                    className={`relative flex flex-col items-center justify-center gap-1 rounded-lg border p-3 text-xs transition-all duration-150 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="text-2xl">{platform.icon}</div>
                    <span className="text-[13px] font-medium">
                      {platform.label}
                    </span>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Optional footer */}
            {/* <div className="pt-6 text-center text-xs text-gray-400">Choose multiple platforms</div> */}

            {/* Animation */}
            <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.25s ease-out;
        }
      `}</style>
          </div>
        </div>
      )}

      {/* 🔁 For API: log this to see what will be submitted */}
      {/* <pre>{JSON.stringify(socialLinks, null, 2)}</pre> */}
    </>
  );
};

export default SocialLinksSection;
