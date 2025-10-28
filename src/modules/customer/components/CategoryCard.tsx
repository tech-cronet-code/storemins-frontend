// CategoryCard.tsx
import React from "react";
import { Link } from "react-router-dom";

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  href?: string;
}

interface CategoryCardProps {
  category: Category;
  size?: number; // width/height in px, default 140
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  size = 140,
}) => {
  return (
    <div style={{ width: size }} className="flex flex-col items-center">
      <Link
        to={category.href || "#"}
        className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition relative"
        aria-label={category.name}
      >
        <div
          className="flex items-center justify-center bg-gray-100 p-2 rounded-lg"
          style={{ width: size, height: size }}
        >
          <img
            src={category.imageUrl}
            alt={category.name}
            className="object-contain max-w-full max-h-full"
            loading="lazy"
            onError={(e) => {
              const el = e.currentTarget;
              el.src =
                "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
      </Link>
      <div className="mt-2 text-center">
        <span className="text-sm font-medium text-gray-800">
          {category.name}
        </span>
      </div>
    </div>
  );
};

export default CategoryCard;
