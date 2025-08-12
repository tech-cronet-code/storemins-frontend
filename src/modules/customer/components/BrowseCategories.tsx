// BrowseCategories.tsx

import React from "react";
import CategoryCard, { Category } from "./CategoryCard";

const sampleCategories: Category[] = [
  {
    id: "1",
    name: "Women Fashion",
    imageUrl: "/images/category-women-fashion.png",
    href: "/customer/category/women-fashion",
  },
  {
    id: "2",
    name: "Electronics",
    imageUrl: "/images/category-electronics.png",
    href: "/customer/category/electronics",
  },
  {
    id: "3",
    name: "Home & Living",
    imageUrl: "/images/category-home-living.png",
    href: "/customer/category/home-living",
  },
  {
    id: "4",
    name: "Accessories",
    imageUrl: "/images/category-accessories.png",
    href: "/customer/category/accessories",
  },
];

interface BrowseCategoriesProps {
  categories?: Category[];
}

const BrowseCategories: React.FC<BrowseCategoriesProps> = ({
  categories = sampleCategories,
}) => {
  return (
    <section className="max-w-screen-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Browse Categories</h2>
      <div className="flex flex-wrap gap-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} size={120} />
        ))}
      </div>
    </section>
  );
};

export default BrowseCategories;
