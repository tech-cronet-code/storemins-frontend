import React from "react";

export interface CheckboxOption {
  label: string;
  value: string;
  count: number;
  checked: boolean;
}

interface CheckboxFilterProps {
  title: string;
  options: CheckboxOption[];
  onToggle: (value: string) => void;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  title,
  options,
  onToggle,
}) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-medium">{title}</h3>
      <button className="text-xs text-blue-600 hover:underline">Clear</button>
    </div>
    <ul className="space-y-1">
      {options.map((o) => (
        <li key={o.value} className="flex items-center text-sm">
          <input
            id={o.value}
            type="checkbox"
            checked={o.checked}
            onChange={() => onToggle(o.value)}
            className="mr-2"
          />
          <label htmlFor={o.value}>
            {o.label} <span className="text-gray-500">({o.count})</span>
          </label>
        </li>
      ))}
    </ul>
  </div>
);

export default CheckboxFilter;
