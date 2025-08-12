// ProductList.tsx

import React from "react";
import ProductCard, { Product } from "./ProductCard";

const sampleProducts: Product[] = [
  {
    id: "p1",
    name: "Floral Print Bollywood Lycra Blend Saree (Maroon, Black)",
    price: 10000,
    originalPrice: 20000,
    imageUrl: "",
    onAdd: (p) => alert(`Added ${p.name}`),
  },
  {
    id: "p2",
    name: "Casual Cotton Kurta Set",
    price: 799,
    imageUrl: "",
    onAdd: (p) => alert(`Added ${p.name}`),
  },
  // add more to test grid responsiveness
];

interface ProductListProps {
  products?: Product[];
}

const ProductList: React.FC<ProductListProps> = ({
  products = sampleProducts,
}) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products found.</p>
      </div>
    );
  }

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((p) => (
          <div key={p.id} className="h-full">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductList;
