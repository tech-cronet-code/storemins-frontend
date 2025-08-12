import React from "react";
import { Link } from "react-router-dom";

interface BreadcrumbsProps {
  items: Array<{ label: string; to?: string }>;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => (
  <nav className="text-sm text-gray-600 mb-4" aria-label="breadcrumb">
    {items.map((crumb, i) => (
      <span key={i}>
        {crumb.to ? (
          <Link to={crumb.to} className="hover:underline">
            {crumb.label}
          </Link>
        ) : (
          <span className="font-semibold">{crumb.label}</span>
        )}
        {i < items.length - 1 && " > "}
      </span>
    ))}
  </nav>
);

export default Breadcrumbs;
