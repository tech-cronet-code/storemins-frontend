import { Search } from "lucide-react";
import { useState } from "react";
import FilterDropdown from "../products/FilterDropdown";

const OrderFilterBar = () => {
//   const [categorySelected, setCategorySelected] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [stock, setStock] = useState("");
  const [paymentMode, setPaymentMode] = useState("Default");
  const [sortBy, setSortBy] = useState("Recently Added");

  const resetFilters = () => {
    // setCategorySelected([]);
    setStatus("");
    setStock("");
    setPaymentMode("Default");
    setSortBy("Recently Added");
  };

  return (
    <div className="w-full bg-white rounded-md border border-gray-100 px-3 py-4">
      <div className="flex flex-wrap lg:flex-nowrap gap-3 lg:gap-x-4 items-center justify-start">
        {/* Search */}
        <div className="flex items-center border border-gray-300 rounded-md px-3 w-full sm:w-[210px] lg:w-[280px]">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Enter Product Name"
            className="outline-none px-2 py-2 text-sm w-full"
          />
        </div>

        {/* Category */}
        {/* <div className="w-full sm:w-[150px] lg:w-[150px] shrink-0">
          <CategoryDropdown
            selected={categorySelected}
            setSelected={setCategorySelected}
          />
        </div> */}

        {/* Status */}
        <div className="w-full sm:w-[130px] lg:w-[110px] shrink-0">
          <FilterDropdown
            label="Status"
            value={status}
            options={["Online", "Offline"]}
            onChange={setStatus}
          />
        </div>

        {/* Stock (narrower) */}
        <div className="w-full sm:w-[120px] lg:w-[100px]">
          <FilterDropdown
            label="Stock"
            value={stock}
            options={["Out of stock", "In stock", "Custom"]}
            onChange={setStock}
          />
        </div>

        {/* Payment Mode (narrower) */}
        <div className="w-full sm:w-[130px] lg:w-[110px]">
          <FilterDropdown
            label="Payment Mode"
            value={paymentMode}
            options={["Default", "COD Only", "Prepaid Only"]}
            onChange={setPaymentMode}
          />
        </div>

        {/* Sort By */}
        <div className="w-full sm:w-[160px] lg:w-[140px]">
          <FilterDropdown
            label="Sort By"
            value={sortBy}
            options={[
              "Recently Added",
              "Price: High to Low",
              "Price: Low to High",
              "Alphabetically",
              "Quantity: High to Low",
              "Quantity: Low to High",
            ]}
            onChange={setSortBy}
          />
        </div>

        {/* Clear */}
        <div className="w-full sm:w-auto">
          <button
            onClick={resetFilters}
            className="text-sm font-medium text-blue-600 hover:underline whitespace-nowrap"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFilterBar;
