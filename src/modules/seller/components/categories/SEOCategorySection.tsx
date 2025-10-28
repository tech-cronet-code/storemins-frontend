import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

const SEOCategorySection: React.FC<{ serverSeoImageUrl?: string }> = ({
  serverSeoImageUrl,
}) => {
  const { control, register, setValue } = useFormContext();
  const [expanded, setExpanded] = useState(true);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // helper: create/release object URLs
  const setPreviewFromFile = (file?: File | null) => {
    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  // when unmounting, cleanup
  useEffect(() => {
    return () => {
      setLocalPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, []);

  const openPicker = () => {
    // clear value so picking the same file again still triggers onChange
    if (fileInputRef.current) fileInputRef.current.value = "";
    fileInputRef.current?.click();
  };

  const removeLocal = () => {
    setPreviewFromFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    // clear RHF value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue("seoImage", undefined as any, { shouldDirty: true, shouldValidate: true });
  };

  const hasImage = Boolean(localPreview || serverSeoImageUrl);

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div
        className="flex justify-between items-center px-5 py-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-800">StoreMins SEO</h3>
          <p className="text-sm text-gray-500">Optimize your category with meta tags.</p>
        </div>
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {expanded && (
        <div className="px-5 pb-6 space-y-5">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Title Tag</label>
            <input
              type="text"
              {...register("seoTitle")}
              placeholder="Enter title tag"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Meta Description</label>
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
            <label className="text-sm font-medium text-gray-700 block mb-2">Seo Image</label>

            <div className="flex flex-col md:flex-row gap-4 border border-gray-300 rounded-md p-4 bg-white">
              {/* The file input is controlled by Controller so RHF always receives a FileList */}
              <Controller
                name="seoImage"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      type="file"
                      id="seoImage"
                      accept="image/*"
                      ref={(el) => {
                        fileInputRef.current = el;
                        // RHF wants the ref too:
                        // @ts-expect-error RHF accepts HTMLInputElement here
                        field.ref = el;
                      }}
                      className="hidden"
                      onChange={(e) => {
                        const fl = (e.target as HTMLInputElement).files ?? null;
                        // push FileList (or null) into RHF
                        field.onChange(fl);
                        // update local preview
                        setPreviewFromFile(fl && fl.length ? fl[0] : null);
                      }}
                    />

                    {/* Add image (hidden when we have preview or server image) */}
                    {!hasImage && (
                      <label
                        htmlFor="seoImage"
                        onClick={(e) => {
                          e.preventDefault();
                          openPicker();
                        }}
                        className="bg-[#FAFAFA] border border-dashed border-gray-300 rounded-md w-full sm:w-[200px] h-[112px] flex flex-col items-center justify-center text-center text-sm text-blue-600 cursor-pointer"
                      >
                        + Add image
                        <p className="text-xs text-gray-400 mt-1">(Recommended: 1200 × 628 px)</p>
                      </label>
                    )}
                  </>
                )}
              />

              {/* Preview & actions */}
              <div className="text-sm flex-1">
                <p className="text-[#3C3C3C] font-medium text-sm mb-2">Preview</p>
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
                        onClick={openPicker}
                        className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
                      >
                        Replace image
                      </button>
                      {localPreview && (
                        <button
                          type="button"
                          onClick={removeLocal}
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
