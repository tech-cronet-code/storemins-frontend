  import React from "react";
  import { CartProduct } from "./CartItem";
  import CategoryProductCard from "./CategoryProductCard";

  interface ProductGridProps {
    products: CartProduct[];
    onAddToCart: (product: CartProduct) => void;
  }

  const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => (
        <CategoryProductCard key={p.id} {...p} onAdd={() => onAddToCart(p)} />
      ))}
    </div>
  );

  export default ProductGrid;
