// ShippingTaxSection.tsx
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ChevronDown, ChevronUp } from "lucide-react";

const ShippingTaxSection: React.FC = () => {
  const { register } = useFormContext();
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div
        className="flex items-center justify-between px-6 py-5 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">Shipping & Tax</h3>
          <p className="text-[14px] text-gray-500">
            Configure shipping options and tax rules to streamline your sales process.
          </p>
        </div>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {expanded && (
        <div className="border-t border-gray-200 px-6 pt-6 pb-6 space-y-6">
          {/* Shipping Weight (backend key: shippingWeight) */}
          <div>
            <label className="text-[14px] font-medium text-gray-700 mb-1 block">
              Shipment Weight
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="any"
                placeholder="Eg. 1.2"
                {...register("shippingWeight")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* purely UI; backend ignores the unit */}
              <select
                {...register("weightUnit")}
                defaultValue="kg"
                className="min-w-[80px] border border-gray-300 rounded-md px-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>

          {/* HSN Code */}
          <div>
            <label className="text-[14px] font-medium text-gray-700 mb-1 block">
              HSN Code
            </label>
            <input
              type="text"
              placeholder="Enter the HSN code"
              {...register("hsnCode")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[13px] text-gray-500 mt-1">
              Not sure about the code?{" "}
              <a href="#" className="text-[#0B5ED7] hover:underline font-medium">
                Search here
              </a>
            </p>
          </div>

          {/* GST (backend key: gstPercent) */}
          <div>
            <label className="text-[14px] font-medium text-gray-700 mb-1 block">
              GST
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="any"
                placeholder="Enter the GST percentage"
                {...register("gstPercent")}
                className="w-full border border-gray-300 rounded-l-md px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="border border-l-0 border-gray-300 px-3 py-2 rounded-r-md text-gray-600 bg-gray-100 text-[14px]">
                %
              </span>
            </div>
            <p className="text-[13px] text-gray-500 mt-1">
              Setup GST in store settings to enter GST percentage.{" "}
              <a href="#" className="text-[#0B5ED7] hover:underline font-medium">
                Set up GST
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingTaxSection;
