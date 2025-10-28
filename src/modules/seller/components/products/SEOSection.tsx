// components/ProductForm/SEOSection.tsx
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { convertPath } from "../../../auth/utils/useImagePath";

const BOX_W = 320;
const BOX_H = 168;

const SEOSection: React.FC = () => {
  const { control, register, setValue, watch } = useFormContext();

  const [expanded, setExpanded] = useState(true);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [localFileName, setLocalFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const rawSeoImageUrl =
    (watch("seoImageUrl") as string | undefined) ??
    (watch("seoMetaData.imageUrl") as string | undefined);

  const serverSeoImageUrl = useMemo(() => {
    if (!rawSeoImageUrl) return undefined;
    if (/^https?:\/\//i.test(rawSeoImageUrl) || rawSeoImageUrl.startsWith("/")) {
      return rawSeoImageUrl; // already a full/absolute url
    }
    try {
      // our BE serves: /files/original/:token
      return convertPath(rawSeoImageUrl, "original/product/seo");
    } catch {
      return undefined;
    }
  }, [rawSeoImageUrl]);

  const setPreviewFromFile = (file?: File | null) => {
    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
    setLocalFileName(file?.name ?? null);
  };

  useEffect(() => {
    return () => {
      setLocalPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, []);

  const openPicker = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    if (localPreview) {
      setPreviewFromFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      // clear RHF file field
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue("seoImage", undefined as any, { shouldDirty: true, shouldValidate: true });
      return;
    }
    if (serverSeoImageUrl) {
      // clear both flat + nested keys
      setValue("seoImageUrl", "", { shouldDirty: true, shouldValidate: true });
      setValue("seoMetaData.imageUrl", "", { shouldDirty: true, shouldValidate: true });
    }
  };

  const hasAnyImage = Boolean(localPreview || serverSeoImageUrl);

  

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div
        className="flex justify-between items-center px-5 py-4 cursor-pointer"
        onClick={() => setExpanded((x) => !x)}
      >
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-800">StoreMins SEO</h3>
          <p className="text-sm text-gray-500">Optimize your product for search and sharing.</p>
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
            <label className="text-sm font-medium text-gray-700 block mb-1">Meta Description Tag</label>
            <textarea
              rows={3}
              {...register("seoDescription")}
              placeholder="Enter description"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Social image */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Social sharing image</label>

            <div className="flex items-start gap-4">
              {/* Uploader area */}
              <div
                className="relative rounded-md border border-dashed border-gray-300 bg-[#FAFAFA] overflow-hidden"
                style={{ width: BOX_W, height: BOX_H }}
              >
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
                          // @ts-expect-error RHF accepts HTMLInputElement
                          field.ref = el;
                        }}
                        className="hidden"
                        onChange={(e) => {
                          const fl = (e.target as HTMLInputElement).files ?? null;
                          field.onChange(fl);
                          if (fl && fl.length) {
                            // clear both url fields when user picks a new file
                            setValue("seoImageUrl", "", { shouldDirty: true });
                            setValue("seoMetaData.imageUrl", "", { shouldDirty: true });
                            setPreviewFromFile(fl[0]); // instant preview
                          } else {
                            setPreviewFromFile(null);
                          }
                        }}
                      />

                      {!hasAnyImage ? (
                        <label
                          htmlFor="seoImage"
                          onClick={(e) => {
                            e.preventDefault();
                            openPicker();
                          }}
                          className="absolute inset-0 flex flex-col items-center justify-center text-center text-sm text-blue-600 cursor-pointer"
                        >
                          + Add image
                          <span className="text-xs text-gray-400 mt-1">(Recommended: 1200 × 628 px)</span>
                        </label>
                      ) : (
                        <>
                          <img
                            src={localPreview || (serverSeoImageUrl as string)}
                            alt="SEO preview"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <label htmlFor="seoImage" className="absolute inset-0 cursor-pointer" />
                        </>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Right side meta / actions */}
              <div className="text-sm">
                <p className="text-[#3C3C3C] font-medium text-sm mb-1">Product Page Title</p>
                <p className="text-xs text-[#6F6F6F] break-words">
                  https://storemins.io/your-store/products/your-slug
                </p>
                <p className="text-xs text-[#A0A0A0] mt-1">Meta Description</p>

                {hasAnyImage && (
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={openPicker}
                      className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
                    >
                      Replace image
                    </button>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {localFileName && (
                  <p className="text-xs mt-2 text-gray-500 italic">({localFileName} selected)</p>
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
