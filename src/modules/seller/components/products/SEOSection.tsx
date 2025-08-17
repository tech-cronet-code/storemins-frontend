import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ChevronDown, ChevronUp } from "lucide-react";

const BOX_W = 320;   // 👈 set your exact placeholder width (e.g., 200)
const BOX_H = 168;   // 👈 and height (e.g., 112)

const SEOSection: React.FC = () => {
  const { register, watch, setValue } = useFormContext();

  const [expanded, setExpanded] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // RHF values we may receive
  const fileField = watch("seoImage"); // FileList/File when user picks
  const urlFromSeo = watch("seoMetaData?.imageUrl"); // if you store it here
  const urlLoose   = watch("seoImageUrl");           // or here (whichever you use)

  // Build preview: prefer newly picked file > existing URL
  useEffect(() => {
    // cleanup previous object URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    // 1) user-picked file (FileList or File)
    if (fileField instanceof FileList && fileField[0]) {
      const f = fileField[0];
      const url = URL.createObjectURL(f);
      objectUrlRef.current = url;
      setPreviewUrl(url);
      setImageName(f.name);
      return;
    }
    if (fileField instanceof File) {
      const url = URL.createObjectURL(fileField);
      objectUrlRef.current = url;
      setPreviewUrl(url);
      setImageName(fileField.name);
      return;
    }

    // 2) existing URL (from defaults)
    const existing = urlFromSeo || urlLoose || null;
    setPreviewUrl(existing);
    setImageName(existing ? existing.split("/").pop() || null : null);
  }, [fileField, urlFromSeo, urlLoose]);

  // Wire up RHF's register but override onChange to update preview instantly
  const reg = register("seoImage");
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    reg.onChange(e); // keep RHF in sync
    const f = e.target.files?.[0];
    if (f) {
      // ensure RHF stores the FileList so it goes to FormData
      setValue("seoImage", e.target.files as unknown as FileList, {
        shouldDirty: true,
        shouldValidate: true,
      });
      // preview handled by effect
    }
  };

  const clearImage = () => {
    if (inputRef.current) inputRef.current.value = "";
    setValue("seoImage", null, { shouldDirty: true, shouldValidate: true });
    // if you also want to tell backend to clear existing SEO image, set a flag:
    // setValue("seoImageClear", true, { shouldDirty: true });
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreviewUrl(null);
    setImageName(null);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      {/* Header */}
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

          {/* SEO image picker + preview in SAME BOX */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Social sharing image</label>

            <div className="flex items-start gap-4">
              {/* Box */}
              <div
                style={{ width: BOX_W, height: BOX_H }}
                className="relative rounded-md border border-dashed border-gray-300 bg-[#FAFAFA] overflow-hidden"
              >
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  id="seoImage"
                  {...reg}
                  ref={(el) => {
                    reg.ref(el);
                    inputRef.current = el;
                  }}
                  onChange={onFileChange}
                  className="hidden"
                />

                {/* If preview -> show it filling the box */}
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="SEO preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); clearImage(); }}
                      className="absolute top-1 right-1 z-10 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/95 text-gray-700 shadow hover:bg-red-50"
                      title="Remove"
                    >
                      ×
                    </button>
                    {/* transparent click layer to open picker when clicking image */}
                    <label htmlFor="seoImage" className="absolute inset-0 cursor-pointer" />
                  </>
                ) : (
                  // Empty state (centered)
                  <label
                    htmlFor="seoImage"
                    className="absolute inset-0 flex flex-col items-center justify-center text-center text-sm text-blue-600 cursor-pointer"
                  >
                    + Add image
                    <span className="text-xs text-gray-400 mt-1">(Recommended: 1200 × 628 px)</span>
                  </label>
                )}
              </div>

              {/* Meta preview text */}
              <div className="text-sm">
                <p className="text-[#3C3C3C] font-medium text-sm mb-1">Product Page Title</p>
                <p className="text-xs text-[#6F6F6F] break-words">
                  https://storemins.io/your-store/products/your-slug
                </p>
                <p className="text-xs text-[#A0A0A0] mt-1">Meta Description</p>
                {imageName && (
                  <p className="text-xs mt-2 text-gray-500 italic">({imageName} selected)</p>
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
