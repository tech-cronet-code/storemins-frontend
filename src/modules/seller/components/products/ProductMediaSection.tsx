import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Image as ImageIcon } from "lucide-react";

const TILE_W = 120; // tweak to your exact size
const TILE_H = 150;
const MAX_IMAGES = 6;

type Tile = { id: string; url: string; file: File };

const ProductMediaSection: React.FC = () => {
  const { register, setValue, setError, clearErrors, formState: { errors } } = useFormContext();

  const [tiles, setTiles] = useState<Tile[]>([]);
  const dragFrom = useRef<number | null>(null);

  // hook to RHF but we manage value manually
  const { ref: rhfRef, ...imgReg } = register("images");

  // sync RHF value (keeps visual order -> upload order)
  useEffect(() => {
    const dt = new DataTransfer();
    tiles.forEach(t => dt.items.add(t.file));
    setValue("images", dt.files, { shouldDirty: true, shouldValidate: true });
    if (tiles.length > MAX_IMAGES) {
      setError("images", { type: "max", message: `You can upload up to ${MAX_IMAGES} images.` });
    } else clearErrors("images");
  }, [tiles, setValue, setError, clearErrors]);

  // clean URLs on unmount
  useEffect(() => () => tiles.forEach(t => URL.revokeObjectURL(t.url)), [tiles]);

  const addFiles = (files: File[]) => {
    if (!files.length) return;
    const next = [...tiles];
    for (const f of files) {
      if (!f.type.startsWith("image/")) continue;
      if (next.length >= MAX_IMAGES) break;
      next.push({ id: crypto.randomUUID(), url: URL.createObjectURL(f), file: f });
    }
    setTiles(next);
    if (tiles.length + files.length > MAX_IMAGES)
      setError("images", { type: "max", message: `You can upload up to ${MAX_IMAGES} images.` });
    else clearErrors("images");
  };

  const onPick: React.ChangeEventHandler<HTMLInputElement> = e => {
    addFiles(Array.from(e.target.files ?? []));
    e.target.value = ""; // allow picking same files again
  };

  const onDropUpload: React.DragEventHandler<HTMLLabelElement> = e => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files ?? []));
  };

  const removeAt = (i: number) => {
    setTiles(cur => {
      const copy = [...cur];
      const [rm] = copy.splice(i, 1);
      if (rm) URL.revokeObjectURL(rm.url);
      return copy;
    });
  };

  const onTileDragStart = (i: number) => (dragFrom.current = i);
  const onTileDrop = (to: number) => {
    const from = dragFrom.current;
    dragFrom.current = null;
    if (from == null || from === to) return;
    setTiles(cur => {
      const copy = [...cur];
      const [m] = copy.splice(from, 1);
      copy.splice(to, 0, m);
      return copy;
    });
  };

  const remaining = Math.max(0, MAX_IMAGES - tiles.length);

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6">
      <h3 className="text-base font-semibold text-gray-900">Product Media</h3>
      <p className="text-sm text-gray-500 mt-1 mb-4">
        Upload up to {MAX_IMAGES} images. Drag tiles to change their order.
      </p>

      {/* Uploader (video removed) */}
      <label
        htmlFor="images"
        onDrop={onDropUpload}
        onDragOver={e => e.preventDefault()}
        className="inline-flex items-center justify-center w-40 h-28 border border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
      >
        <div className="flex flex-col items-center text-gray-600">
          <ImageIcon className="w-7 h-7 mb-2" />
          <span className="text-sm">Upload images</span>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            {...imgReg}
            ref={rhfRef}
            onChange={onPick}
            className="hidden"
          />
        </div>
      </label>

      {typeof errors.images?.message === "string" && (
        <p className="text-xs text-red-500 mt-2">{errors.images.message}</p>
      )}

      {/* One-line strip */}
      <div className="mt-4 flex flex-nowrap items-center gap-3 overflow-x-auto">
        {tiles.map((t, i) => (
          <div
            key={t.id}
            style={{ width: TILE_W, height: TILE_H }}
            className="relative group flex-none rounded-lg overflow-hidden border bg-gray-50"
            draggable
            onDragStart={() => onTileDragStart(i)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onTileDrop(i)}
            title="Drag to sort"
          >
            <img
              src={t.url}
              alt={`preview-${i}`}
              className="w-full h-full object-cover select-none pointer-events-none"
              draggable={false}
            />

            {/* Remove (fixed) */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }} // block drag
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 z-10 pointer-events-auto inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/95 text-gray-700 shadow hover:bg-red-50"
              aria-label="Remove image"
              title="Remove"
            >
              ×
            </button>

            {/* Hover hint (doesn't steal clicks) */}
            <div className="pointer-events-none absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/30 text-white text-[11px] font-medium">
              Drag to sort
            </div>
          </div>
        ))}

        {/* Placeholders to keep a single line look */}
        {Array.from({ length: remaining }).map((_, k) => (
          <div
            key={`ph-${k}`}
            style={{ width: TILE_W, height: TILE_H }}
            className="flex-none rounded-lg border border-dashed border-gray-300 bg-gray-50"
          />
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Recommended size: <span className="font-medium text-gray-600">1000px × 1248px</span>
      </p>
    </div>
  );
};

export default ProductMediaSection;
