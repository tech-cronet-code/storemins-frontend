import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ChevronDown, ChevronUp } from "lucide-react";

const SEOSection: React.FC = () => {
  const { register } = useFormContext();
  const [expanded, setExpanded] = useState(true);
  const [imageName, setImageName] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageName(e.target.files[0].name);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      {/* Toggle Header */}
      <div
        className="flex justify-between items-center px-5 py-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-800">
            StoreMins SEO
          </h3>
          <p className="text-sm text-gray-500">
            Optimize your product with meta tags to boost visibility on search engines.
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="text-black" size={18} />
        ) : (
          <ChevronDown className="text-black" size={18} />
        )}
      </div>

      {expanded && (
        <div className="px-5 pb-6 space-y-5">
          {/* Title Field */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Title Tag
            </label>
            <input
              type="text"
              {...register("seoTitle")}
              placeholder="Enter title tag"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-blue-600 mt-1 cursor-pointer hover:underline">
              Generate Title
            </p>
          </div>

          {/* Description Field */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Meta Description Tag
            </label>
            <textarea
              rows={3}
              {...register("seoDescription")}
              placeholder="Enter description"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-blue-600 mt-1 cursor-pointer hover:underline">
              Generate Meta Description
            </p>
          </div>

          {/* Social Sharing Image Preview */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Social sharing image preview
            </label>
            <div className="flex flex-col md:flex-row gap-4 border border-gray-300 rounded-md p-4 bg-white">
              {/* Upload Box */}
              <div>
                <input
                  type="file"
                  id="seoImage"
                  {...register("seoImage")}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="seoImage"
                  className="bg-[#FAFAFA] border border-dashed border-gray-300 rounded-md w-full sm:w-[200px] h-[112px] flex flex-col items-center justify-center text-center text-sm text-blue-600 cursor-pointer"
                >
                  + Add image
                  <p className="text-xs text-gray-400 mt-1">
                    (Recommended: 1200 × 628 px)
                  </p>
                </label>
              </div>

              {/* Preview Text */}
              <div className="text-sm flex-1">
                <p className="text-[#3C3C3C] font-medium text-sm mb-1">
                  Product Page Title
                </p>
                <p className="text-xs text-[#6F6F6F] break-words">
                  https://storemins.io/your-store/products//
                </p>
                <p className="text-xs text-[#A0A0A0] mt-1">Meta Description</p>
                {imageName && (
                  <p className="text-xs mt-1 text-gray-400 italic">
                    ({imageName} selected)
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOSection;
