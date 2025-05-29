import {
    DndContext,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// ========== Types ==========
interface VariantItem {
    id: string;
    color: string;
    size: string;
    price: string;
    discountedPrice: string;
    sku: string;
    quantity: number;
    weight: string;
    weightUnit: string;
    gtin: string;
    googleCategory: string;
    image?: string;
}

interface Props {
  data: VariantItem[];
  onChange: (id: string, field: keyof VariantItem, value: string | number) => void;
  onReorder: (reordered: VariantItem[]) => void;
  selectedColors?: string[];
  selectedSizes?: string[];
}

const inputClass =
    "border border-gray-300 w-full px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-300";

// ========== Row ==========
const SortableRow: React.FC<{
    variant: VariantItem;
    onChange: Props["onChange"];
    onDelete: (id: string) => void;
}> = ({ variant, onChange, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: variant.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    const [menuOpen, setMenuOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <div ref={setNodeRef} style={style} className="flex border-b border-gray-200 bg-white relative">

            {/* Sticky Left Section */}
            <div className="lg:sticky left-0 z-10 bg-white flex items-center gap-3 w-full sm:min-w-[120px] md:min-w-[160px] lg:min-w-[180px] xl:min-w-[200px] px-4 py-4 border-r border-gray-200">
                <div className="text-gray-400 cursor-move hover:text-gray-600" {...listeners} {...attributes}>
                    <GripVertical size={16} />
                </div>
               <div className="relative w-12 h-12 rounded-md border border-gray-300 bg-white flex items-center justify-center hover:shadow-sm hover:border-gray-400 transition cursor-pointer overflow-hidden group">
  <label htmlFor={`upload-${variant.id}`} className="w-full h-full flex items-center justify-center">
    {variant.image ? (
      <img
        src={variant.image}
        alt="variant"
        className="w-full h-full object-cover"
      />
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-gray-400 group-hover:text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4v16m8-8H4"
        />
      </svg>
    )}
    <input
      id={`upload-${variant.id}`}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            onChange(variant.id, "image", reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      }}
    />
  </label>
</div>

                <div>
                    <p className={`text-sm font-medium ${variant.quantity > 0 ? "text-gray-800" : "text-gray-800 line-through"}`}>
                        {variant.color} | {variant.size}
                    </p>
                    <p className={`text-xs mt-1 ${variant.quantity > 0 ? "text-green-600" : "text-red-500"}`}>
                        {variant.quantity > 0 ? "In stock" : "Out of stock"}
                    </p>
                </div>
            </div>

            {/* Scrollable Fields */}
            <div
                className="grid w-full min-h-[92px]"
                style={{
                    gridTemplateColumns: "150px 160px 180px 150px 180px 160px 200px 60px",
                }}
            >
                <div className="p-4"><input className={inputClass} value={variant.price} placeholder="₹ 20000" onChange={(e) => onChange(variant.id, "price", e.target.value)} /></div>
                <div className="p-4"><input className={inputClass} value={variant.discountedPrice} placeholder="₹ 10000" onChange={(e) => onChange(variant.id, "discountedPrice", e.target.value)} /></div>
                <div className="p-4"><input className={inputClass} value={variant.sku} placeholder="Eg. 1000000001" onChange={(e) => onChange(variant.id, "sku", e.target.value)} /></div>
                <div className="p-4">
                    <input type="number" className={inputClass} value={variant.quantity} onChange={(e) => onChange(variant.id, "quantity", +e.target.value)} />
                    <p className="text-xs text-gray-500 mt-1">(in 1 warehouse)</p>
                </div>
                <div className="p-4">
                    <div className="flex items-center gap-2">
                        <input className="border border-gray-300 px-3 py-2 rounded text-sm w-[80px] focus:outline-none focus:ring-1 focus:ring-gray-300" value={variant.weight} onChange={(e) => onChange(variant.id, "weight", e.target.value)} />
                        <select className="border border-gray-300 px-2 py-[9px] rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" value={variant.weightUnit} onChange={(e) => onChange(variant.id, "weightUnit", e.target.value)}>
                            <option value="kg">kg</option>
                            <option value="g">g</option>
                            <option value="lb">lb</option>
                        </select>
                    </div>
                </div>
                <div className="p-4"><input className={inputClass} placeholder="Enter GTIN" value={variant.gtin} onChange={(e) => onChange(variant.id, "gtin", e.target.value)} /></div>
                <div className="p-4"><input className={inputClass} placeholder="Enter Category name" value={variant.googleCategory} onChange={(e) => onChange(variant.id, "googleCategory", e.target.value)} /></div>

                {/* Action Menu */}
                <div className="p-4 relative">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-500 hover:text-black">⋮</button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 min-w-[160px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => {
                                    setConfirmOpen(true);
                                    setMenuOpen(false);
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:bg-red-100 transition"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4 text-red-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                                Delete variant
                            </button>
                        </div>

                    )}

                    {confirmOpen && (
                        <div
                            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4"
                            onClick={() => {
                                setConfirmOpen(false);
                                document.body.style.overflow = "auto";
                            }}
                        >
                            {/* Stop click propagation inside modal */}
                            <div
                                className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 p-8"
                                onClick={(e) => e.stopPropagation()} // 👈 prevent outside click from closing if clicked inside
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
                                <p className="text-sm text-gray-700 mb-6">
                                    Are you sure you want to delete <b>{variant.color} | {variant.size}</b> variant?
                                </p>

                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => {
                                            setConfirmOpen(false);
                                            document.body.style.overflow = "auto";
                                        }}
                                        className="px-5 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDelete(variant.id);
                                            setConfirmOpen(false);
                                            document.body.style.overflow = "auto";
                                        }}
                                        className="px-5 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}








                </div>
            </div>
        </div>
    );
};

// ========== Table ==========
const EditVariantTable: React.FC<Props> = ({
  data,
  onChange,
  onReorder,
  selectedColors = [],
  selectedSizes = [],
}) => {

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollShadowRef = useRef<HTMLDivElement>(null);
    const sensors = useSensors(useSensor(PointerSensor));
    const [variantList, setVariantList] = useState(data);

    useEffect(() => {
        const sync = () => {
            if (scrollShadowRef.current && scrollContainerRef.current) {
                scrollShadowRef.current.scrollLeft = scrollContainerRef.current.scrollLeft;
            }
        };
        scrollContainerRef.current?.addEventListener("scroll", sync);
        return () => scrollContainerRef.current?.removeEventListener("scroll", sync);
    }, []);

    const handleBottomScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = (e.target as HTMLDivElement).scrollLeft;
        }
    };

    const handleDelete = (id: string) => {
        const scrollY = window.scrollY; // ✅ store scroll before delete
        const updated = variantList.filter(v => v.id !== id);
        setVariantList(updated);
        onReorder(updated);
        // ✅ wait for next tick and restore scroll
        setTimeout(() => {
            window.scrollTo(0, scrollY);
        }, 0);
    };


    const handleReorder = (newOrder: VariantItem[]) => {
        setVariantList(newOrder);
        onReorder(newOrder);
    };

    return (
        <div className="relative">
            {/* Top Filter Block */}
{(selectedColors.length > 0 || selectedSizes.length > 0) && (
  <div className="flex items-center flex-wrap gap-4 mb-4 px-4">
    <span className="text-base font-medium text-gray-700">Color Picker & Size:</span>

    {/* Colors */}
    {selectedColors.map((color, index) => (
      <span
        key={`color-${index}`}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-base font-medium"
      >
        <span
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: color }}
        ></span>
        <span className="capitalize">{color}</span>
      </span>
    ))}

    {/* Sizes */}
    {selectedSizes.map((size, index) => (
      <span
        key={`size-${index}`}
        className="px-4 py-2 bg-gray-100 rounded-full text-base font-medium"
      >
        {size}
      </span>
    ))}
  </div>
)}

            {/* Scrollable Table */}
            <div ref={scrollContainerRef} className="w-full overflow-x-auto">
                <div className="min-w-[1500px] flex flex-col rounded">
                    <div className="flex sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
                        <div className="sticky left-0 z-20 bg-gray-50 min-w-[260px] px-4 py-3 text-sm font-semibold border-r border-gray-200">
                            Variant
                        </div>
                        <div
                            className="grid text-sm font-semibold w-full"
                            style={{
                                gridTemplateColumns:
                                    "150px 160px 180px 150px 180px 160px 200px 60px",
                            }}
                        >
                            <div className="px-4 py-3">Price</div>
                            <div className="px-4 py-3">Discounted Price</div>
                            <div className="px-4 py-3">SKU ID</div>
                            <div className="px-4 py-3">Quantity</div>
                            <div className="px-4 py-3">Weight</div>
                            <div className="px-4 py-3">GTIN</div>
                            <div className="px-4 py-3">Google Category</div>
                            <div className="px-4 py-3">Action</div>
                        </div>
                    </div>

                    {/* Rows */}
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
                        const { active, over } = e;
                        if (active.id !== over?.id) {
                            const oldIndex = variantList.findIndex((item) => item.id === active.id);
                            const newIndex = variantList.findIndex((item) => item.id === over?.id);
                            const reordered = arrayMove(variantList, oldIndex, newIndex);
                            handleReorder(reordered);
                        }
                    }}>
                        <SortableContext items={variantList.map((v) => v.id)} strategy={verticalListSortingStrategy}>
                            {variantList.map((variant) => (
                                <SortableRow key={variant.id} variant={variant} onChange={onChange} onDelete={handleDelete} />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            </div>

            {/* Sticky Bottom Scrollbar */}
           <div className="sticky bottom-0 left-0 z-10 border-t border-gray-100">
                <div
                    ref={scrollShadowRef}
                    className="overflow-x-scroll w-full h-[20px] scrollbar-thick"
                    onScroll={handleBottomScroll}
                    style={{
                        scrollbarColor: '#d1d5db #fff', // Tailwind's gray-300 on white
                        scrollbarWidth: 'auto',
                    }}
                >
                    <div className="min-w-[1500px] h-[20px]" />
                </div>
            </div>
        </div>
    );
};

export default EditVariantTable;
