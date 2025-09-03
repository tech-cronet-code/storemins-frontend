import React from "react";

type ExistingDoc = { key: string; url: string; title: string };

type Props = {
  existing?: ExistingDoc[];
  files: File[];
  max: number;
  onDrop: (files: File[]) => void; // drag files from OS
  onRemove: (file: File) => void; // remove new
  onRemoveExisting?: (key: string) => void; // remove existing
  onReorder?: (fromIndex: number, toIndex: number) => void; // DnD within grid
};

const ACCEPT_HINT =
  ".pdf / .doc / .docx / .ppt / .pptx / .xls / .xlsx / .csv / .txt / .zip";

const FileIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    aria-hidden
  >
    <path d="M6 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    <path d="M14 2v6h6" />
  </svg>
);

const fileKey = (f: File) => `${f.name}__${f.size}__${f.lastModified}`;

const DigitalAssetDocsGrid: React.FC<Props> = ({
  existing = [],
  files,
  max,
  onDrop,
  onRemove,
  onRemoveExisting,
  onReorder,
}) => {
  const docs = files.filter(
    (f) => !f.type.startsWith("image/") && !f.type.startsWith("video/")
  );
  const room = Math.max(0, max - (existing.length + docs.length));

  // dnd state
  const [dragCount, setDragCount] = React.useState(0);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const isDragging = dragCount > 0;

  const tiles = React.useMemo(
    () => [
      ...existing.map((e) => ({
        kind: "existing" as const,
        id: e.key,
        data: e,
      })),
      ...docs.map((f) => ({ kind: "new" as const, id: fileKey(f), data: f })),
    ],
    [existing, docs]
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
      className={[
        "rounded-2xl border p-4 sm:p-5 space-y-3 shadow-sm bg-white",
        isDragging ? "ring-2 ring-blue-400" : "",
      ].join(" ")}
      aria-labelledby="da-docs"
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
          <h3 id="da-docs" className="font-semibold text-base sm:text-lg">
            Digital asset — Files
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500">
            Other files sent after purchase (max {max}).
          </p>
        </div>
        <span className="text-[11px] sm:text-xs text-gray-500">
          {existing.length + docs.length}/{max}
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
          <div
            key={t.id}
            className={[
              "relative w-full aspect-square rounded-xl border border-gray-200 bg-gray-50 p-2",
              "flex flex-col items-center justify-center",
              "transition ring-offset-2",
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
            title={
              t.kind === "existing"
                ? (t.data as ExistingDoc).title
                : (t.data as File).name
            }
          >
            <div className="flex-1 grid place-items-center pointer-events-none">
              <FileIcon />
            </div>
            <div className="mt-1 text-[10px] sm:text-[11px] truncate text-gray-800 w-full text-center">
              {t.kind === "existing"
                ? (t.data as ExistingDoc).title
                : (t.data as File).name}
            </div>

            {t.kind === "existing" ? (
              onRemoveExisting && (
                <button
                  type="button"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    onRemoveExisting((t.data as ExistingDoc).key);
                  }}
                  className="absolute top-1 right-1 rounded-md bg-white/80 hover:bg-white border px-1 text-xs"
                  aria-label="Remove existing file"
                >
                  ✕
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  onRemove(t.data as File);
                }}
                className="absolute top-1 right-1 rounded-md bg-white/80 hover:bg-white border px-1 text-xs"
                aria-label="Remove file"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {Array.from({ length: room }).map((_, i) => (
          <div
            key={`ph-doc-${i}`}
            className="w-full aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50"
            aria-hidden="true"
            title="Drag and drop files here"
          />
        ))}
      </div>

      <p className="text-[11px] sm:text-xs text-gray-500">
        Supported: <b>{ACCEPT_HINT}</b>
      </p>
    </section>
  );
};

export default React.memo(DigitalAssetDocsGrid);
