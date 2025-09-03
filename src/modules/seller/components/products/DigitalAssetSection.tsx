import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { showToast } from "../../../../common/utils/showToast";
import DigitalAssetDocsGrid from "./DigitalAssetDocsGrid";
import type { DigitalProductFormValues } from "../../Schemas/digitalProductSchema";
import { convertPath } from "../../../auth/utils/useImagePath";
import DigitalAssetImagesGrid from "./DigitalAssetImagesGrid";

/** Debug flag: toggle logs */
const DEBUG = false;

/* ---- limits & accepts ---- */
const IMAGES_MAX = 10;
const DOCS_MAX = 10;
const SIZE_CAP_MB = 30;
const SIZE_CAP = SIZE_CAP_MB * 1024 * 1024;
const ACCEPT_DOCS = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt,.zip";

/* ---- tiny icons ---- */
const ChevronDownIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const ImageIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M4 5h16v14H4z" />
    <path d="M4 16l4-4 3 3 4-4 5 5" />
    <circle cx="8.5" cy="8.5" r="1.5" />
  </svg>
);
const VideoIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="3" y="5" width="14" height="14" rx="2" />
    <path d="M17 8l4-2v12l-4-2z" />
  </svg>
);
const FileIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M6 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    <path d="M14 2v6h6" />
  </svg>
);

/* ---- helpers ---- */
const isValidUrl = (s: string) => {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
};
const fileKey = (f: File) => `${f.name}__${f.size}__${f.lastModified}`;
const uniqueMerge = (base: File[], add: File[]) => {
  const seen = new Set(base.map(fileKey));
  return [...base, ...add.filter((f) => !seen.has(fileKey(f)))];
};
const isImageExt = (s: string) =>
  /\.(webp|png|jpe?g|gif|bmp|svg|avif)$/i.test(s);

/* token → URL */
const tokenToImageUrl = (token: string): string => {
  if (!token) return "";
  if (/^https?:\/\//i.test(token) || token.startsWith("/")) return token;
  try {
    const u = convertPath(token, "original/product/digital") as
      | string
      | undefined;
    if (u) return u;
  } catch (e) {
    if (DEBUG) console.warn("convertPath(image) failed", token, e);
  }
  return `/image/original/product/digital/${token}`;
};
const tokenToFileUrl = (token: string): string => {
  if (!token) return "";
  if (/^https?:\/\//i.test(token) || token.startsWith("/")) return token;
  return `/image/original/product/digital/${token}`;
};

const DigitalAssetSection: React.FC = () => {
  const { control, setValue } = useFormContext<DigitalProductFormValues>();

  /* --------- COLLAPSE STATE --------- */
  const [expanded, setExpanded] = React.useState(true);
  const toggleExpanded = () => setExpanded((v) => !v);

  /* --------- LINKS (supports array or single) --------- */
  const urlsArray = useWatch({ control, name: "digitalAssetUrls" as any }) as
    | string[]
    | undefined;
  const urlSingle = useWatch({ control, name: "digitalAssetUrl" as any }) as
    | string
    | null
    | undefined;

  const linkList = React.useMemo<string[]>(() => {
    if (Array.isArray(urlsArray)) return urlsArray;
    if (typeof urlSingle === "string" && urlSingle.trim())
      return [urlSingle.trim()];
    return [];
  }, [urlsArray, urlSingle]);

  /* --------- EXISTING DIGITAL ASSETS (from server) --------- */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const existingDigitalAssets =
    (useWatch({ control, name: "digitalAssetExisting" as any }) as
      | any[]
      | undefined) ?? [];

  /* --------- ORDER (persisted in RHF) --------- */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const existingOrder =
    (useWatch({ control, name: "digitalAssetExistingOrder" as any }) as
      | string[]
      | undefined) ?? [];

  // initialize order once
  React.useEffect(() => {
    if (!existingDigitalAssets?.length) return;
    if (existingOrder.length) return;
    const initial = existingDigitalAssets.map((a: any) =>
      String(a.fileId || a.title)
    );
    setValue("digitalAssetExistingOrder" as any, initial, {
      shouldDirty: false,
    });
  }, [existingDigitalAssets]); // eslint-disable-line

  const byOrder = React.useCallback(
    (aKey: string, bKey: string) => {
      const ai = existingOrder.indexOf(aKey);
      const bi = existingOrder.indexOf(bKey);
      const A = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
      const B = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
      return A - B;
    },
    [existingOrder]
  );

  // Track removals (key = fileId or title fallback) and mirror fileIds list
  const [removedExistingKeys, setRemovedExistingKeys] = React.useState<
    Set<string>
  >(new Set());
  const removeExistingByKey = (key: string) => {
    setRemovedExistingKeys((prev) => {
      const next = new Set(prev);
      next.add(key);
      const removedFileIds = Array.from(next).filter((k) =>
        /^[0-9a-f-]{10,}$/i.test(k)
      );
      setValue("digitalAssetRemovedIds" as any, removedFileIds, {
        shouldDirty: true,
      });
      return next;
    });
  };

  // Derive ALL existing (images/docs)
  const existingImgsAll = React.useMemo(
    () =>
      (existingDigitalAssets || [])
        .filter((a: any) => a?.title && isImageExt(String(a.title)))
        .map((a: any) => ({
          key: String(a.fileId || a.title),
          url: tokenToImageUrl(String(a.title)),
          title: String(a.title),
          fileId: a.fileId ?? null,
        })),
    [existingDigitalAssets]
  );

  const existingDocsAll = React.useMemo(
    () =>
      (existingDigitalAssets || [])
        .filter((a: any) => a?.title && !isImageExt(String(a.title)))
        .map((a: any) => ({
          key: String(a.fileId || a.title),
          url: tokenToFileUrl(String(a.title)),
          title: String(a.title),
          fileId: a.fileId ?? null,
        })),
    [existingDigitalAssets]
  );

  // Sorted & filtered for display
  const existingImgs = React.useMemo(
    () =>
      existingImgsAll
        .slice()
        .sort((a, b) => byOrder(a.key, b.key))
        .filter((x) => !removedExistingKeys.has(x.key)),
    [existingImgsAll, removedExistingKeys, byOrder]
  );
  const existingDocs = React.useMemo(
    () =>
      existingDocsAll
        .slice()
        .sort((a, b) => byOrder(a.key, b.key))
        .filter((x) => !removedExistingKeys.has(x.key)),
    [existingDocsAll, removedExistingKeys, byOrder]
  );

  /* --------- FILES (instant preview) --------- */
  const rhfFileList = useWatch({ control, name: "digitalAssetFile" }) as
    | FileList
    | File[]
    | undefined;
  const [files, setFiles] = React.useState<File[]>([]);
  React.useEffect(() => {
    if (!rhfFileList) setFiles([]);
    else
      setFiles(
        Array.isArray(rhfFileList) ? rhfFileList : Array.from(rhfFileList)
      );
  }, [rhfFileList]);

  /* hidden picker (off-screen, not display:none) */
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [pickTarget, setPickTarget] = React.useState<"images" | "docs">(
    "images"
  );

  /* modal open/close (with animation) */
  const [modalOpen, setModalOpen] = React.useState(false);
  const [anim, setAnim] = React.useState(false);
  const openModal = React.useCallback(() => {
    setModalOpen(true);
    requestAnimationFrame(() => setAnim(true));
  }, []);
  const closeModal = React.useCallback(() => {
    setAnim(false);
    setTimeout(() => setModalOpen(false), 180);
  }, []);
  React.useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeModal();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [modalOpen, closeModal]);

  /* RHF sync for files */
  const writeFiles = (next: File[]) => {
    setFiles(next);
    const dt = new DataTransfer();
    next.forEach((f) => dt.items.add(f));
    setValue("digitalAssetFile", dt.files as any, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("digitalAssetMode", "upload" as any, { shouldDirty: true });
  };

  const removeFile = (target: File) =>
    writeFiles(files.filter((f) => fileKey(f) !== fileKey(target)));

  const triggerPick = (target: "images" | "docs") => {
    setPickTarget(target);
    const el = inputRef.current;
    if (!el) return;
    el.accept = target === "images" ? "image/*" : ACCEPT_DOCS;
    el.value = "";
    el.click();
  };

  const onPicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.currentTarget.files
      ? Array.from(e.currentTarget.files)
      : [];
    if (!chosen.length) return;

    const tooBig = chosen.find((f) => f.size > SIZE_CAP);
    if (tooBig) {
      showToast({
        type: "error",
        message: `File "${tooBig.name}" exceeds ${SIZE_CAP_MB} MB.`,
        showClose: true,
      });
      e.currentTarget.value = "";
      return;
    }

    const currentImages = files.filter((f) => f.type.startsWith("image/"));
    const currentDocs = files.filter(
      (f) => !f.type.startsWith("image/") && !f.type.startsWith("video/")
    );

    if (pickTarget === "images") {
      const add = chosen.filter((f) => f.type.startsWith("image/"));
      const room = Math.max(
        0,
        IMAGES_MAX - (existingImgs.length + currentImages.length)
      );
      writeFiles(uniqueMerge(files, add.slice(0, room)));
    } else {
      const add = chosen.filter(
        (f) => !f.type.startsWith("image/") && !f.type.startsWith("video/")
      );
      const room = Math.max(
        0,
        DOCS_MAX - (existingDocs.length + currentDocs.length)
      );
      writeFiles(uniqueMerge(files, add.slice(0, room)));
    }
    e.currentTarget.value = "";
  };

  /* drag & drop into grids */
  const onDropImages = (dropped: File[]) => {
    if (!dropped.length) return;
    const tooBig = dropped.find((f) => f.size > SIZE_CAP);
    if (tooBig)
      return showToast({
        type: "error",
        message: `File "${tooBig.name}" exceeds ${SIZE_CAP_MB} MB.`,
        showClose: true,
      });
    const currentImages = files.filter((f) => f.type.startsWith("image/"));
    const room = Math.max(
      0,
      IMAGES_MAX - (existingImgs.length + currentImages.length)
    );
    const add = dropped
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, room);
    if (add.length) writeFiles(uniqueMerge(files, add));
  };
  const onDropDocs = (dropped: File[]) => {
    if (!dropped.length) return;
    const tooBig = dropped.find((f) => f.size > SIZE_CAP);
    if (tooBig)
      return showToast({
        type: "error",
        message: `File "${tooBig.name}" exceeds ${SIZE_CAP_MB} MB.`,
        showClose: true,
      });
    const currentDocs = files.filter(
      (f) => !f.type.startsWith("image/") && !f.type.startsWith("video/")
    );
    const room = Math.max(
      0,
      DOCS_MAX - (existingDocs.length + currentDocs.length)
    );
    const add = dropped
      .filter(
        (f) => !f.type.startsWith("image/") && !f.type.startsWith("video/")
      )
      .slice(0, room);
    if (add.length) writeFiles(uniqueMerge(files, add));
  };

  /* links add/remove (stores both: array + single for compat) */
  const [showLink, setShowLink] = React.useState(false);
  const setLinks = (arr: string[]) => {
    const next = Array.from(new Set(arr.map((u) => u.trim()))).filter(Boolean);
    setValue("digitalAssetUrls" as any, next, { shouldDirty: true });
    setValue("digitalAssetUrl" as any, next[0] ?? null, { shouldDirty: true });
  };
  const addLink = (s: string) => {
    const v = s.trim();
    if (!v) return;
    if (!isValidUrl(v))
      return showToast({
        type: "error",
        message: "Enter a valid URL.",
        showClose: true,
      });
    setLinks([...(linkList || []), v]);
  };
  const removeLink = (u: string) =>
    setLinks((linkList || []).filter((x) => x !== u));

  /* ---- Reorder handlers (Images / Docs) ---- */
  const onReorderImages = (from: number, to: number) => {
    const newImages = files.filter((f) => f.type.startsWith("image/"));
    const combined = [
      ...existingImgs.map((e) => ({ kind: "existing" as const, id: e.key })),
      ...newImages.map((f) => ({
        kind: "new" as const,
        id: fileKey(f),
        file: f,
      })),
    ];
    const moved = combined.splice(from, 1)[0];
    combined.splice(to, 0, moved);

    const nextExistingOrder = combined
      .filter((t) => t.kind === "existing")
      .map((t) => t.id);
    const nextNewImages = combined
      .filter((t) => t.kind === "new")
      .map((t) => (t as any).file as File);

    setValue("digitalAssetExistingOrder" as any, nextExistingOrder, {
      shouldDirty: true,
    });

    const docs = files.filter(
      (f) => !f.type.startsWith("image/") && !f.type.startsWith("video/")
    );
    writeFiles([...nextNewImages, ...docs]);
  };

  const onReorderDocs = (from: number, to: number) => {
    const newDocs = files.filter(
      (f) => !f.type.startsWith("image/") && !f.type.startsWith("video/")
    );
    const combined = [
      ...existingDocs.map((e) => ({ kind: "existing" as const, id: e.key })),
      ...newDocs.map((f) => ({
        kind: "new" as const,
        id: fileKey(f),
        file: f,
      })),
    ];
    const moved = combined.splice(from, 1)[0];
    combined.splice(to, 0, moved);

    const nextExistingDocKeys = combined
      .filter((t) => t.kind === "existing")
      .map((t) => t.id);
    // merge with current image existing keys to retain whole set
    const imgKeys = existingImgs.map((e) => e.key);
    const mergedOrder = [...imgKeys, ...nextExistingDocKeys];
    setValue("digitalAssetExistingOrder" as any, mergedOrder, {
      shouldDirty: true,
    });

    const imagesOnly = files.filter((f) => f.type.startsWith("image/"));
    const nextNewDocs = combined
      .filter((t) => t.kind === "new")
      .map((t) => (t as any).file as File);
    writeFiles([...imagesOnly, ...nextNewDocs]);
  };

  const contentId = React.useId();

  return (
    <section
      className="rounded-lg border border-gray-200 bg-white shadow-sm hover:border-gray-300 transition-colors"
      aria-labelledby="digital-asset-heading"
    >
      {/* HEADER */}
      <button
        type="button"
        className="w-full flex items-start gap-2 px-4 py-3 text-left"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={toggleExpanded}
      >
        <div className="flex-1">
          <h3
            id="digital-asset-heading"
            className="text-sm font-semibold text-gray-900"
          >
            Digital Asset
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Automatically sent to customer after purchase
          </p>
        </div>
        <ChevronDownIcon
          className={[
            "ml-2 h-4 w-4 shrink-0 transition-transform duration-200",
            expanded ? "rotate-180" : "rotate-0",
          ].join(" ")}
        />
      </button>

      <div className="h-px w-full bg-gray-100" />

      {/* BODY */}
      <div
        id={contentId}
        role="region"
        className={`${expanded ? "block" : "hidden"} px-4 py-4 space-y-4`}
      >
        {/* CTA row */}
        <button
          type="button"
          onClick={() => {
            setPickTarget("images");
            openModal();
          }}
          className="w-full rounded-lg border-2 border-dashed border-rose-200 bg-rose-50/40 text-rose-700 hover:bg-rose-50 px-3 py-3 text-sm font-medium"
        >
          Upload a digital asset
        </button>
        <div className="text-center text-xs">
          Or{" "}
          <button
            type="button"
            onClick={() => setShowLink((v) => !v)}
            className="text-blue-600 hover:underline font-medium"
          >
            Add a link
          </button>
        </div>

        {/* LINKS: always visible chips */}
        {linkList.length > 0 && (
          <div className="max-w-xl mx-auto">
            <div className="text-xs text-gray-600 mb-1">
              Links sent after purchase
            </div>
            <div className="flex flex-wrap gap-2">
              {linkList.map((u) => (
                <span
                  key={u}
                  className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] bg-white"
                  title={u}
                >
                  <a
                    href={u}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline truncate max-w-[260px]"
                  >
                    {u}
                  </a>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-red-600"
                    onClick={() => removeLink(u)}
                    aria-label="Remove link"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* link input (inline, optional) */}
        {showLink && (
          <div className="max-w-xl mx-auto mt-3">
            <LinkInput onAdd={addLink} />
          </div>
        )}

        {/* hidden file input used by CTA & modal */}
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={onPicked}
          className="absolute -z-10 w-px h-px opacity-0 pointer-events-none"
          style={{ left: -99999, top: -99999, position: "fixed" }}
          accept={pickTarget === "images" ? "image/*" : ACCEPT_DOCS}
        />

        {/* Grids – existing inside grids, with remove & reordering */}
        <DigitalAssetImagesGrid
          existing={existingImgs}
          files={files}
          max={IMAGES_MAX}
          onDrop={onDropImages}
          onRemove={removeFile}
          onRemoveExisting={removeExistingByKey}
          onReorder={onReorderImages}
        />
        <DigitalAssetDocsGrid
          existing={existingDocs}
          files={files}
          max={DOCS_MAX}
          onDrop={onDropDocs}
          onRemove={removeFile}
          onRemoveExisting={removeExistingByKey}
          onReorder={onReorderDocs}
        />

        {/* Upload modal */}
        {modalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-asset-title"
            className="fixed inset-0 z-[120] flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div
              className={[
                "absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity",
                anim ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
            <div
              tabIndex={-1}
              className={[
                "relative w-full max-w-sm rounded-xl bg-white shadow-2xl outline-none overflow-hidden transition-[transform,opacity] duration-200",
                anim ? "opacity-100 scale-100" : "opacity-0 scale-95",
              ].join(" ")}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="bg-violet-100 px-3 py-2.5 text-sm font-semibold text-gray-700"
                id="upload-asset-title"
              >
                Upload a digital asset
              </div>

              <div className="divide-y">
                <button
                  type="button"
                  onClick={() => {
                    triggerPick("images");
                    closeModal();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                    <ImageIcon />
                  </span>
                  <span className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      Upload images
                    </div>
                    <div className="text-xs text-gray-500">
                      JPEG/PNG • up to {SIZE_CAP_MB} MB
                    </div>
                  </span>
                </button>

                <button
                  type="button"
                  disabled
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left opacity-60 cursor-not-allowed"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                    <VideoIcon />
                  </span>
                  <span className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      Upload a video
                    </div>
                    <div className="text-xs text-gray-500">
                      MP4/MOV • up to {SIZE_CAP_MB} MB
                    </div>
                    <div className="text-[11px] text-gray-400 italic">
                      Coming soon
                    </div>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerPick("docs");
                    closeModal();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                    <FileIcon />
                  </span>
                  <span className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      Upload a file
                    </div>
                    <div className="text-xs text-gray-500">
                      {ACCEPT_DOCS} • up to {SIZE_CAP_MB} MB
                    </div>
                  </span>
                </button>
              </div>

              <div className="px-3 py-2.5 flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-xs px-2.5 py-1.5 rounded-md border hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(DigitalAssetSection);

/* -------- link input (inline) -------- */
const LinkInput: React.FC<{ onAdd: (url: string) => void }> = ({ onAdd }) => {
  const [val, setVal] = React.useState("");
  const add = () => {
    onAdd(val);
    setVal("");
  };
  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };
  return (
    <div className="flex gap-2">
      <input
        type="url"
        placeholder="File link"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={onKey}
        className="w-full border rounded-md px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={add}
        className="px-2.5 py-1.5 rounded-md border bg-white hover:bg-gray-50 text-xs"
      >
        Add
      </button>
    </div>
  );
};
