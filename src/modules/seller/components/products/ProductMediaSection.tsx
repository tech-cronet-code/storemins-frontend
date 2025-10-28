import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Image as ImageIcon } from "lucide-react";
import { convertPath } from "../../../auth/utils/useImagePath";

// const LOG = "[ProductMediaSection]";
const MAX_IMAGES = 6;

type FileTile = { id: string; kind: "file"; url: string; file: File };
type UrlTile = { id: string; kind: "url"; url: string; token: string };
type Tile = FileTile | UrlTile;

const ProductMediaSection: React.FC = () => {
  const {
    register,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
    control,
  } = useFormContext();

  // watch values so we see reset() updates
  const media =
    (useWatch({ control, name: "media" }) as Array<{
      url: string;
      order?: number;
    }>) ?? [];
  const mediaUrls =
    (useWatch({ control, name: "mediaUrls" }) as string[]) ?? [];

  const mediaTokensFromMedia = (Array.isArray(media) ? media : [])
    .slice()
    .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
    .map((m) => m?.url)
    .filter(Boolean) as string[];

  const initialTokens: string[] = (
    mediaTokensFromMedia.length ? mediaTokensFromMedia : mediaUrls
  ).filter(Boolean);

  const [tiles, setTiles] = useState<Tile[]>([]);
  const { ref: rhfRef, ...imgReg } = register("images");
  const fileInput = useRef<HTMLInputElement | null>(null);

  // seed only once to avoid flicker / loops
  const didSeed = useRef(false);
  const hydrated = useRef(false); // avoid writing [] back before hydration

  const tokenToUrl = (token: string): string => {
    if (!token) return "";
    if (/^https?:\/\//i.test(token) || token.startsWith("/")) return token;
    try {
      const u = convertPath(token, "original/product") as string | undefined;
      if (u) return u;
    } catch {
      /* empty */
    }
    return `/image/original/product/${token}`;
  };

  // seed previews when tokens land
  useEffect(() => {
    if (didSeed.current) return;
    if (!initialTokens.length) return;
    didSeed.current = true;
    hydrated.current = true;

    const seeded: Tile[] = initialTokens.map((token) => ({
      id: crypto.randomUUID(),
      kind: "url",
      token,
      url: tokenToUrl(token),
    }));
    setTiles(seeded);
  }, [initialTokens]);

  // keep RHF in sync (FileList + kept tokens in current order)
  useEffect(() => {
    if (!hydrated.current && tiles.length === 0) return;

    const files = tiles.filter((t): t is FileTile => t.kind === "file");
    const keptTokens = tiles
      .filter((t): t is UrlTile => t.kind === "url")
      .map((t) => t.token);

    const dt = new DataTransfer();
    files.forEach((t) => dt.items.add(t.file));
    setValue("images", dt.files, { shouldDirty: true, shouldValidate: true });

    // 👇 critical: send these back on submit so BE keeps old ones
    setValue("mediaUrls", keptTokens, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (tiles.length > MAX_IMAGES) {
      setError("images", {
        type: "max",
        message: `You can upload up to ${MAX_IMAGES} images.`,
      });
    } else {
      clearErrors("images");
    }
  }, [tiles, setValue, setError, clearErrors]);

  // cleanup blob URLs
  useEffect(
    () => () => {
      tiles.forEach((t) => t.kind === "file" && URL.revokeObjectURL(t.url));
    },
    [tiles]
  );

  const addFiles = (files: File[]) => {
    if (!files.length) return;
    hydrated.current = true;
    setTiles((cur) => {
      const next: Tile[] = [...cur];
      for (const f of files) {
        if (!f.type.startsWith("image/")) continue;
        if (next.length >= MAX_IMAGES) break;
        next.push({
          id: crypto.randomUUID(),
          kind: "file",
          file: f,
          url: URL.createObjectURL(f),
        });
      }
      return next;
    });
  };

  const onPick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    addFiles(Array.from(e.target.files ?? []));
    if (fileInput.current) fileInput.current.value = "";
  };

  const onDrop: React.DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files ?? []));
  };

  // drag-sort
  const dragFrom = useRef<number | null>(null);
  const onTileDragStart = (i: number) => (dragFrom.current = i);
  const onTileDrop = (to: number) => {
    const from = dragFrom.current;
    dragFrom.current = null;
    if (from == null || from === to) return;
    setTiles((cur) => {
      const copy = [...cur];
      const [m] = copy.splice(from, 1);
      copy.splice(to, 0, m);
      return copy;
    });
  };

  const removeAt = (i: number) => {
    hydrated.current = true;
    setTiles((cur) => {
      const copy = [...cur];
      const [rm] = copy.splice(i, 1);
      if (rm && rm.kind === "file") URL.revokeObjectURL(rm.url);
      return copy;
    });
  };

  const remaining = useMemo(
    () => Math.max(0, MAX_IMAGES - tiles.length),
    [tiles.length]
  );

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 sm:p-6">
      <h3 className="text-base font-semibold text-gray-900">Product Media</h3>
      <p className="text-sm text-gray-500 mt-1 mb-4">
        Upload up to {MAX_IMAGES} images. Drag tiles to change their order.
      </p>

      {/* compact uploader tile */}
      <label
        htmlFor="images"
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className={[
          "inline-flex items-center justify-center",
          "rounded-md cursor-pointer transition",
          "border border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50",
          "w-28 sm:w-32 md:w-36 lg:w-40", // smaller widths than before
          "aspect-[4/5]", // keep proportion consistent
        ].join(" ")}
      >
        <div className="flex flex-col items-center text-gray-600 px-3 text-center">
          <ImageIcon className="w-7 h-7 mb-2" />
          <span className="text-sm">Upload images</span>
          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            {...imgReg}
            ref={(el) => {
              rhfRef(el);
              fileInput.current = el;
            }}
            onChange={onPick}
            className="hidden"
          />
        </div>
      </label>

      {typeof errors.images?.message === "string" && (
        <p className="text-xs text-red-500 mt-2">{errors.images.message}</p>
      )}

      {/* responsive grid of thumbnails */}
      <div
        className={[
          "mt-4 grid gap-3",
          // Fluid columns: tile min width increases with screen size
          "[grid-template-columns:repeat(auto-fill,minmax(6.25rem,1fr))]", // ~100px
          "sm:[grid-template-columns:repeat(auto-fill,minmax(7.5rem,1fr))]", // ~120px
          "md:[grid-template-columns:repeat(auto-fill,minmax(8.75rem,1fr))]", // ~140px
          "lg:[grid-template-columns:repeat(auto-fill,minmax(10rem,1fr))]", // ~160px
        ].join(" ")}
      >
        {tiles.map((t, i) => (
          <div
            key={t.id}
            className="relative group rounded-lg overflow-hidden border bg-gray-50 w-full aspect-[4/5] flex-none"
            draggable
            onDragStart={() => onTileDragStart(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onTileDrop(i)}
            title="Drag to sort"
          >
            {t.url ? (
              <img
                src={t.url}
                alt={`preview-${i}`}
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
                onError={(e) => {
                  if (t.kind === "url") {
                    const el = e.currentTarget as HTMLImageElement;
                    const fallback = `/image/original/product/${t.token}`;
                    if (el.src !== fallback) el.src = fallback;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full grid place-items-center bg-white">
                <div className="h-6 w-6 rounded-full animate-pulse bg-gray-300" />
              </div>
            )}

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 z-10 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/95 text-gray-700 shadow hover:bg-red-50"
              title="Remove"
              aria-label="Remove"
            >
              ×
            </button>

            <div className="pointer-events-none absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/30 text-white text-[11px] font-medium">
              Drag to sort
            </div>
          </div>
        ))}

        {/* placeholders keep grid shape and stay responsive */}
        {Array.from({ length: remaining }).map((_, k) => (
          <div
            key={`ph-${k}`}
            className="rounded-lg border border-dashed border-gray-300 bg-gray-50 w-full aspect-[4/5]"
          />
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Recommended size:{" "}
        <span className="font-medium text-gray-600">1000px × 1248px</span>
      </p>
    </div>
  );
};

export default ProductMediaSection;
