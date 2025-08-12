import React, { useState } from "react";
import { UserRoleName } from "../../auth/constants/userRoles";
import CustomerLayout from "../../customer/components/CustomerLayout";
import Breadcrumbs from "../components/FilterSidebar/Breadcrumbs";
import FilterSidebar from "../components/FilterSidebar/FilterSidebar";
import ProductGrid from "../components/ProductGrid";
import SortSelect from "../components/SortSelect";
import { CartProduct } from "../components/CartItem";

const sampleProducts: CartProduct[] = [
  {
    id: "p1",
    name: "Floral Print Bollywood Lycra Blend Saree",
    imageUrl: "https://via.placeholder.com/240x240?text=Saree",
    price: 268,
    originalPrice: 499,
    size: "Free",
    color: { id: "maroon", name: "Maroon", hex: "#800000" },
    quantity: 1,
  },
  {
    id: "p2",
    name: "Casual Cotton Kurta Set",
    imageUrl: "https://via.placeholder.com/240x240?text=Kurta",
    price: 799,
    originalPrice: 999,
    size: "M",
    color: { id: "blue", name: "Blue", hex: "#1E40AF" },
    quantity: 1,
  },
  {
    id: "p3",
    name: "Elegant Georgette Anarkali Gown",
    imageUrl: "https://via.placeholder.com/240x240?text=Gown",
    price: 1200,
    originalPrice: 1500,
    size: "L",
    color: { id: "green", name: "Green", hex: "#059669" },
    quantity: 1,
  },
  {
    id: "p4",
    name: "Denim Blue Palazzo Pant",
    imageUrl: "https://via.placeholder.com/240x240?text=Palazzo",
    price: 499,
    originalPrice: undefined,
    size: "S",
    color: { id: "denim", name: "Denim", hex: "#3B82F6" },
    quantity: 1,
  },
  {
    id: "p5",
    name: "Chiffon Printed Dupatta",
    imageUrl: "https://via.placeholder.com/240x240?text=Dupatta",
    price: 349,
    originalPrice: 499,
    size: "Free",
    color: { id: "yellow", name: "Yellow", hex: "#FBBF24" },
    quantity: 1,
  },
  {
    id: "p6",
    name: "Silk Blend Festive Lehenga",
    imageUrl: "https://via.placeholder.com/240x240?text=Lehenga",
    price: 2999,
    originalPrice: 3999,
    size: "XL",
    color: { id: "pink", name: "Pink", hex: "#EC4899" },
    quantity: 1,
  },
];

const CategoryPage: React.FC = () => {
  // ─── Filtering state ───────────────────────
  const [priceRange, setPriceRange] = useState({ min: 0, max: 3000 });
  const [sizes, setSizes] = useState<{ [key: string]: boolean }>({
    Free: false,
    S: false,
    M: false,
    L: false,
    XL: false,
  });
  const [colors, setColors] = useState<{ [key: string]: boolean }>({
    maroon: false,
    blue: false,
    green: false,
    denim: false,
    yellow: false,
    pink: false,
  });

  // ─── Sorting ────────────────────────────────
  const [sort, setSort] = useState("featured");

  // ─── Cart ──────────────────────────────────
  const [cart, setCart] = useState<CartProduct[]>([]);

  // ─── Handlers ──────────────────────────────
  const applyPrice = (min: number, max: number) => setPriceRange({ min, max });
  const clearPrice = () => setPriceRange({ min: 0, max: 3000 });

  const toggleSize = (val: string) =>
    setSizes((s) => ({ ...s, [val]: !s[val] }));
  const clearSizes = () =>
    setSizes({ Free: false, S: false, M: false, L: false, XL: false });

  const toggleColor = (val: string) =>
    setColors((c) => ({ ...c, [val]: !c[val] }));
  const clearColors = () =>
    setColors({
      maroon: false,
      blue: false,
      green: false,
      denim: false,
      yellow: false,
      pink: false,
    });

  const clearAll = () => {
    clearPrice();
    clearSizes();
    clearColors();
  };

  const addToCart = (p: CartProduct) => setCart((c) => [...c, p]);

  // ─── Derive filtered products ───────────────
  let visible = sampleProducts.filter(
    (p) => p.price >= priceRange.min && p.price <= priceRange.max
  );

  const activeSizes = Object.entries(sizes)
    .filter(([, checked]) => checked)
    .map(([size]) => size);
  if (activeSizes.length) {
    visible = visible.filter((p) => activeSizes.includes(p.size as string));
  }

  const activeColors = Object.entries(colors)
    .filter(([, checked]) => checked)
    .map(([clr]) => clr);
  if (activeColors.length) {
    visible = visible.filter((p) => activeColors.includes(p.color?.id || ""));
  }

  // ─── Sort visible products ──────────────────
  visible = [...visible];
  switch (sort) {
    case "newest":
      visible.reverse();
      break;
    case "price_desc":
      visible.sort((a, b) => b.price - a.price);
      break;
    case "price_asc":
      visible.sort((a, b) => a.price - b.price);
      break;
    case "alpha_asc":
      visible.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "alpha_desc":
      visible.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "featured":
    default:
      visible = sampleProducts.filter((p) =>
        visible.some((v) => v.id === p.id)
      );
      break;
  }

  return (
    <CustomerLayout role={UserRoleName.CUSTOMER}>
      <div className="flex gap-8 px-4 py-8 lg:px-12 lg:py-12 max-w-[1200px] mx-auto">
        <FilterSidebar
          price={priceRange}
          onPriceApply={applyPrice}
          onClearPrice={clearPrice}
          sizes={Object.entries(sizes).map(([v, checked]) => ({
            label: v,
            value: v,
            count: sampleProducts.filter((p) => p.size === v).length,
            checked,
          }))}
          onToggleSize={toggleSize}
          onClearSizes={clearSizes}
          colors={Object.entries(colors).map(([v, checked]) => ({
            label: v.charAt(0).toUpperCase() + v.slice(1),
            value: v,
            count: sampleProducts.filter((p) => p.color?.id === v).length,
            checked,
          }))}
          onToggleColor={toggleColor}
          onClearColors={clearColors}
          onClearAll={clearAll}
        />

        <div className="flex-1 space-y-6">
          <Breadcrumbs
            items={[{ label: "Home", to: "/" }, { label: "Women’s Wear" }]}
          />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-semibold">Women’s Wear</h1>
            <SortSelect value={sort} onChange={setSort} />
          </div>

          <ProductGrid products={visible} onAddToCart={addToCart} />

          {visible.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No products match your filters.
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CategoryPage;
