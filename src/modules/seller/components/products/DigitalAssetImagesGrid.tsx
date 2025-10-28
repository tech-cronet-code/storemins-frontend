import React from "react";

type ExistingImage = { key: string; url: string; title: string };

type Props = {
  existing?: ExistingImage[];
  files: File[];
  max: number;
  onDrop: (files: File[]) => void; // drag files from OS
  onRemove: (file: File) => void; // remove new
  onRemoveExisting?: (key: string) => void; // remove existing
  onReorder?: (fromIndex: number, toIndex: number) => void; // DnD within grid
};

const fileKey = (f: File) => `${f.name}__${f.size}__${f.lastModified}`;

// Clean up object URLs to avoid memory leaks
const useObjectURL = (file: File | null) => {
  const [url, setUrl] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!file) return;
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return url;
};

type TileData =
  | { kind: "existing"; id: string; data: ExistingImage }
  | { kind: "new"; id: string; data: File };

function ImageTile({
  tile,
  isDraggingHere,
  idx,
  onDragStart,
  onDropOn,
  onRemove,
  onRemoveExisting,
}: {
  tile: TileData;
  isDraggingHere: boolean;
  idx: number;
  onDragStart: (idx: number, e: React.DragEvent<HTMLDivElement>) => void;
  onDropOn: (idx: number, e: React.DragEvent<HTMLDivElement>) => void;
  onRemove: (file: File) => void;
  onRemoveExisting?: (key: string) => void;
}) {
  const isExisting = tile.kind === "existing";
  const file = isExisting ? null : (tile.data as File);
  const objUrl = useObjectURL(file);

  // Only use a real URL; otherwise keep it null to avoid empty src warnings
  const src: string | null = isExisting
    ? (tile.data as ExistingImage).url || null
    : objUrl || null;

  const alt = isExisting ? (tile.data as ExistingImage).title : "";

  return (
    <div
      className={[
        "relative w-full aspect-square rounded-xl border overflow-hidden bg-gray-50",
        "transition ring-offset-2",
        isDraggingHere ? "ring-2 ring-blue-400" : "",
      ].join(" ")}
      draggable
      onDragStart={(e) => onDragStart(idx, e)}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={(e) => onDropOn(idx, e)}
      title={
        isExisting
          ? (tile.data as ExistingImage).title
          : (tile.data as File).name
      }
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-contain bg-white pointer-events-none"
          loading="lazy"
        />
      ) : (
        // Lightweight placeholder while object URL is being created
        <div className="h-full w-full grid place-items-center bg-white">
          <div className="h-6 w-6 rounded-full animate-pulse bg-gray-300" />
        </div>
      )}

      {isExisting ? (
        onRemoveExisting && (
          <button
            type="button"
            onClick={(ev) => {
              ev.stopPropagation();
              onRemoveExisting((tile.data as ExistingImage).key);
            }}
            className="absolute top-1 right-1 rounded-md bg-white/80 hover:bg-white border px-1.5 text-xs"
            aria-label="Remove existing image"
          >
            ✕
          </button>
        )
      ) : (
        <button
          type="button"
          onClick={(ev) => {
            ev.stopPropagation();
            onRemove(tile.data as File);
          }}
          className="absolute top-1 right-1 rounded-md bg-white/80 hover:bg-white border px-1.5 text-xs"
          aria-label="Remove image"
        >
          ✕
        </button>
      )}
    </div>
  );
}

const DigitalAssetImagesGrid: React.FC<Props> = ({
  existing = [],
  files,
  max,
  onDrop,
  onRemove,
  onRemoveExisting,
  onReorder,
}) => {
  const images = files.filter((f) => f.type.startsWith("image/"));
  const room = Math.max(0, max - (existing.length + images.length));

  // dnd state
  const [dragCount, setDragCount] = React.useState(0);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const isDragging = dragCount > 0;

  // combined tiles
  const tiles: TileData[] = React.useMemo(
    () => [
      ...existing.map((e) => ({
        kind: "existing" as const,
        id: e.key,
        data: e,
      })),
      ...images.map((f) => ({ kind: "new" as const, id: fileKey(f), data: f })),
    ],
    [existing, images]
  );

  const handleDropIntoGrid = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCount(0);
    onDrop(Array.from(e.dataTransfer.files || []));
  };

  const dropOnTile = (toIdx: number) => {
    if (dragIndex == null || toIdx === dragIndex) return;
    onReorder?.(dragIndex, toIdx);
    setDragIndex(null);
  };

  const handleTileDragStart = (
    idx: number,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.dataTransfer.setData("text/plain", String(idx));
    e.dataTransfer.effectAllowed = "move";
    setDragIndex(idx);
  };

  const handleTileDrop = (idx: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dropOnTile(idx);
  };

  return (
    <section
      className={[
        "rounded-2xl border p-4 sm:p-5 space-y-3 shadow-sm bg-white",
        isDragging ? "ring-2 ring-blue-400" : "",
      ].join(" ")}
      aria-labelledby="da-imgs"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }}
      onDragEnter={() => setDragCount((c) => c + 1)}
      onDragLeave={() => setDragCount((c) => Math.max(0, c - 1))}
      onDrop={handleDropIntoGrid}
    >
      <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
        <div>
          <h3 id="da-imgs" className="font-semibold text-base sm:text-lg">
            Digital asset — Images
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500">
            Images sent after purchase (max {max}).
          </p>
        </div>
        <span className="text-[11px] sm:text-xs text-gray-500">
          {existing.length + images.length}/{max}
        </span>
      </div>

      {/* Fully responsive, fluid columns */}
      <div
        className={[
          "grid gap-2 sm:gap-2.5 md:gap-3 lg:gap-3.5 select-none",
          "[grid-template-columns:repeat(auto-fill,minmax(5.5rem,1fr))]",
          "sm:[grid-template-columns:repeat(auto-fill,minmax(6.25rem,1fr))]",
          "md:[grid-template-columns:repeat(auto-fill,minmax(7rem,1fr))]",
          "lg:[grid-template-columns:repeat(auto-fill,minmax(8rem,1fr))]",
        ].join(" ")}
      >
        {tiles.map((t, idx) => (
          <ImageTile
            key={t.id}
            tile={t}
            idx={idx}
            isDraggingHere={dragIndex === idx}
            onDragStart={handleTileDragStart}
            onDropOn={handleTileDrop}
            onRemove={onRemove}
            onRemoveExisting={onRemoveExisting}
          />
        ))}

        {Array.from({ length: room }).map((_, i) => (
          <div
            key={`ph-img-${i}`}
            className="w-full aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50"
            aria-hidden="true"
            title="Drag and drop images here"
          />
        ))}
      </div>

      <p className="text-[11px] sm:text-xs text-gray-500">
        Recommended size: <b>1000px × 1248px</b>
      </p>
    </section>
  );
};

export default React.memo(DigitalAssetImagesGrid);
