// src/components/PaymentMethods.tsx
import React from "react";
import { FiTruck } from "react-icons/fi";

export type PaymentMethod = "cod";

interface PaymentMethodsProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  onPlaceOrder: () => void;
}

const methods: {
  id: PaymentMethod;
  label: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "cod",
    label: "Cash on delivery",
    title: "Pay on delivery (Cash/Card/UPI)",
    desc: "Pay in cash or pay in person at the time of delivery with GPay/PayTM/PhonePe.",
    icon: <FiTruck className="text-xl" />,
  },
];

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selected,
  onSelect,
  onPlaceOrder,
}) => (
  <div className="border border-gray-300 rounded-lg overflow-hidden flex">
    {/* Tabs */}
    <div className="w-1/3 flex flex-col border-r border-gray-300">
      {methods.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m.id)}
          className={`flex items-center gap-2 px-4 py-3 text-sm transition ${
            selected === m.id
              ? "bg-blue-50 border-l-4 border-blue-600"
              : "hover:bg-gray-50"
          }`}
        >
          {m.icon}
          <span>{m.label}</span>
        </button>
      ))}
    </div>
    {/* Content */}
    <div className="flex-1 p-6">
      {methods
        .filter((m) => m.id === selected)
        .map((m) => (
          <div key={m.id}>
            <h3 className="text-lg font-semibold mb-2">{m.title}</h3>
            <p className="text-gray-600 mb-4">{m.desc}</p>
            <button
              onClick={onPlaceOrder}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-md font-medium transition"
            >
              Place order
            </button>
          </div>
        ))}
    </div>
  </div>
);

export default PaymentMethods;
