import React from "react";

type ExistingImage = { key: string; url: string; title: string };

type Props = {
  existing?: ExistingImage[];
  files: File[];
  max: number;
  onDrop: (files: File[]) => void;          // drag files from OS
  onRemove: (file: File) => void;           // remove new
  onRemoveExisting?: (key: string) => void; // remove existing
  onReorder?: (fromIndex: number, toIndex: number) => void; // DnD within grid
};

const fileKey = (f: File) => `${f.name}__${f.size}__${f.lastModified}`;

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
  const tiles = React.useMemo(
    () => [
      ...existing.map((e) => ({ kind: "existing" as const, id: e.key, data: e })),
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

  return (
    <section
      className={["rounded-2xl border p-5 space-y-3 shadow-sm bg-white", isDragging ? "ring-2 ring-blue-400" : ""].join(" ")}
      aria-labelledby="da-imgs"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }}
      onDragEnter={() => setDragCount((c) => c + 1)}
      onDragLeave={() => setDragCount((c) => Math.max(0, c - 1))}
      onDrop={handleDropIntoGrid}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 id="da-imgs" className="font-semibold text-lg">Digital asset — Images</h3>
          <p className="text-xs text-gray-500">Images sent after purchase (max {max}).</p>
        </div>
        <span className="text-xs text-gray-500">{existing.length + images.length}/{max}</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5 select-none">
        {tiles.map((t, idx) => {
          const isExisting = t.kind === "existing";
          return (
            <div
              key={t.id}
              className={[
                "relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg border overflow-hidden bg-gray-50",
                dragIndex === idx ? "ring-2 ring-blue-400" : "",
              ].join(" ")}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", String(idx));
                e.dataTransfer.effectAllowed = "move";
                setDragIndex(idx);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDrop={(e) => {
                e.preventDefault();
                dropOnTile(idx);
              }}
              title={isExisting ? (t.data as any).title : (t.data as File).name}
            >
              {isExisting ? (
                <>
                  <img src={(t.data as any).url} alt={(t.data as any).title} className="h-full w-full object-contain bg-white" />
                  {onRemoveExisting && (
                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onRemoveExisting((t.data as any).key);
                      }}
                      className="absolute top-1 right-1 rounded-md bg-white/80 hover:bg-white border px-1.5 text-xs"
                      aria-label="Remove existing image"
                    >
                      ✕
                    </button>
                  )}
                </>
              ) : (
                <>
                  <img src={URL.createObjectURL(t.data as File)} alt="" className="h-full w-full object-contain bg-white pointer-events-none" />
                  <button
                    type="button"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onRemove(t.data as File);
                    }}
                    className="absolute top-1 right-1 rounded-md bg-white/80 hover:bg-white border px-1.5 text-xs"
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          );
        })}

        {Array.from({ length: room }).map((_, i) => (
          <div
            key={`ph-img-${i}`}
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
            aria-hidden="true"
            title="Drag and drop images here"
          />
        ))}
      </div>

      <p className="text-xs text-gray-500">Recommended size: <b>1000px × 1248px</b></p>
    </section>
  );
};

export default React.memo(DigitalAssetImagesGrid);
