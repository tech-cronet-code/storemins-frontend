// ============================================
// src/components/common/CollapsibleCard.tsx
// Reusable card with clickable header + chevron to collapse/expand
// ============================================
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface CollapsibleCardProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  right?: React.ReactNode; // header right actions (e.g., Add button)
  children: React.ReactNode;
  className?: string;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  title,
  subtitle,
  defaultOpen = true,
  right,
  children,
  className,
}) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  const toggle = () => setOpen((s) => !s);

  return (
    <div
      className={cx("rounded-2xl border border-gray-200 bg-white", className)}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-5 cursor-pointer select-none"
        onClick={toggle}
        role="button"
        aria-expanded={open}
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {right && (
            <div
              onClick={(e) => e.stopPropagation()} // keep header from toggling when clicking an action
            >
              {right}
            </div>
          )}
          <ChevronDown
            size={18}
            className={cx(
              "transition-transform text-gray-600",
              open ? "rotate-180" : undefined
            )}
          />
        </div>
      </div>

      {/* Body */}
      <div className={open ? "px-6 pb-6" : "hidden"}>{children}</div>
    </div>
  );
};

export default CollapsibleCard;
