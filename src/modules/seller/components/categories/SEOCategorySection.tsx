// SEOCategorySection.tsx
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

const SEOCategorySection: React.FC<{ serverSeoImageUrl?: string }> = ({
  serverSeoImageUrl,
}) => {
  const { register, watch, setValue } = useFormContext();
  const [expanded, setExpanded] = useState(true);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fileList: FileList | undefined = watch("seoImage");
  useEffect(() => {
    if (fileList && fileList[0]) {
      const url = URL.createObjectURL(fileList[0]);
      setLocalPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } else {
      if (localPreview) URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
    }
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileList?.length]);

  const hasImage = Boolean(localPreview || serverSeoImageUrl);

  const handleReplaceClick = () => fileInputRef.current?.click();
  const handleRemoveClick = () => {
    // Only removes the *newly selected* local image; removing a server image
    // would require a backend flag/endpoint which we haven’t implemented.
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setValue("seoImage", undefined as any, { shouldValidate: true });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div
        className="flex justify-between items-center px-5 py-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-800">
            StoreMins SEO
          </h3>
          <p className="text-sm text-gray-500">
            Optimize your category with meta tags.
          </p>
        </div>
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {expanded && (
        <div className="px-5 pb-6 space-y-5">
          {/* Title */}
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
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Meta Description
            </label>
            <textarea
              rows={3}
              {...register("seoDescription")}
              placeholder="Enter description"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Keywords (comma separated)
            </label>
            <input
              type="text"
              {...register("seoKeywords")}
              placeholder="e.g. clothing, mens t-shirt, cotton"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* SEO Image */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Seo Image
            </label>

            <div className="flex flex-col md:flex-row gap-4 border border-gray-300 rounded-md p-4 bg-white">
              {/* File input (hidden) */}
              <input
                type="file"
                id="seoImage"
                {...register("seoImage")}
                ref={fileInputRef}
                className="hidden"
              />

              {/* Add image button — hidden when an image exists */}
              {!hasImage && (
                <label
                  htmlFor="seoImage"
                  className="bg-[#FAFAFA] border border-dashed border-gray-300 rounded-md w-full sm:w-[200px] h-[112px] flex flex-col items-center justify-center text-center text-sm text-blue-600 cursor-pointer"
                >
                  + Add image
                  <p className="text-xs text-gray-400 mt-1">
                    (Recommended: 1200 × 628 px)
                  </p>
                </label>
              )}

              {/* Preview + actions */}
              <div className="text-sm flex-1">
                <p className="text-[#3C3C3C] font-medium text-sm mb-2">
                  Preview
                </p>
                {hasImage ? (
                  <>
                    <img
                      src={localPreview || serverSeoImageUrl!}
                      alt="SEO preview"
                      className="max-w-xs rounded border border-gray-200 mb-3"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleReplaceClick}
                        className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
                      >
                        Replace image
                      </button>

                      {/* Only show Remove when the preview is from a newly chosen file */}
                      {localPreview && (
                        <button
                          type="button"
                          onClick={handleRemoveClick}
                          className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-gray-500">No image selected.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOCategorySection;
