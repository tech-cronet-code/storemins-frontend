// OutOfStockBanner.tsx
import React from "react";

const OutOfStockBanner: React.FC = () => (
  <div className="my-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-center text-red-700 font-medium">
    This product is out of stock.
  </div>
);

export default OutOfStockBanner;
