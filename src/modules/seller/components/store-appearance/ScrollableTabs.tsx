import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

export interface TabItem {
  key: string;
  label: string;
}

interface Props {
  tabs: TabItem[];
  value: string;
  onChange: (k: string) => void;
  className?: string;
}

/**
 * Enterprise-polish scrollable tabs:
 * - Single row, no wrap
 * - Smooth wheel/drag scroll
 * - Auto-center active tab + animated underline
 * - Glass arrows with backdrop blur (desktop), hidden when not needed
 * - Edge fades
 * - Pill active state for better contrast
 * - A11y roles
 */
const ScrollableTabs: React.FC<Props> = ({
  tabs,
  value,
  onChange,
  className,
}) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  const recalcEdges = () => {
    const el = railRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const syncUnderline = () => {
    const el = railRef.current;
    if (!el) return;
    const btn = el.querySelector<HTMLButtonElement>(
      `[data-key="${CSS.escape(value)}"]`
    );
    if (!btn) return;
    const railRect = el.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const left = btnRect.left - railRect.left + el.scrollLeft;
    setUnderline({ left, width: btnRect.width });
  };

  const scrollByAmt = (dir: "left" | "right") => {
    const el = railRef.current;
    if (!el) return;
    const amt = Math.round(el.clientWidth * 0.8) * (dir === "left" ? -1 : 1);
    el.scrollBy({ left: amt, behavior: "smooth" });
  };

  // center active + underline on change
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const btn = el.querySelector<HTMLButtonElement>(
      `[data-key="${CSS.escape(value)}"]`
    );
    if (btn)
      btn.scrollIntoView({
        inline: "center",
        block: "nearest",
        behavior: "smooth",
      });
    syncUnderline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, tabs.map((t) => t.key).join("|")]);

  useLayoutEffect(() => {
    const onResize = () => {
      recalcEdges();
      syncUnderline();
    };
    recalcEdges();
    syncUnderline();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smooth horizontal wheel scroll
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
        recalcEdges();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel as any);
  }, []);

  // Drag to scroll (desktop)
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let startLeft = 0;

    const down = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX;
      startLeft = el.scrollLeft;
      el.classList.add("cursor-grabbing");
    };
    const move = (e: MouseEvent) => {
      if (!isDown) return;
      el.scrollLeft = startLeft - (e.pageX - startX);
      recalcEdges();
    };
    const up = () => {
      isDown = false;
      el.classList.remove("cursor-grabbing");
    };

    el.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      el.removeEventListener("mousedown", down);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  return (
    <div className={`relative ${className || ""}`}>
      {/* edge fades */}
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent transition-opacity ${
          canLeft ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent transition-opacity ${
          canRight ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* glass arrows */}
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollByAmt("left")}
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-8 w-8 items-center justify-center rounded-full border border-gray-200/60 bg-white/70 backdrop-blur shadow-sm transition
        hover:bg-white ${
          canLeft ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M15 6l-6 6 6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollByAmt("right")}
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-8 w-8 items-center justify-center rounded-full border border-gray-200/60 bg-white/70 backdrop-blur shadow-sm transition
        hover:bg-white ${
          canRight ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M9 6l6 6-6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* rail */}
      <div
        ref={railRef}
        className="no-scrollbar overflow-x-auto whitespace-nowrap scroll-smooth select-none px-1"
        onScroll={recalcEdges}
        role="tablist"
        aria-label="Appearance sections"
      >
        {/* subtle base line */}
        <div className="relative h-11">
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gray-200" />
          {/* animated underline */}
          <div
            className="absolute bottom-0 left-0 h-[2px] rounded-full bg-gradient-to-r from-blue-600 to-blue-500 transition-transform duration-200"
            style={{
              transform: `translateX(${underline.left}px)`,
              width: underline.width,
            }}
          />
          {/* tabs */}
          <div className="flex items-center gap-2">
            {tabs.map((t) => {
              const active = value === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  data-key={t.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => onChange(t.key)}
                  className={`inline-flex h-9 items-center px-3 md:px-3.5 rounded-full text-[12.5px] leading-none tracking-tight transition
                    ${
                      active
                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* utilities */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ScrollableTabs;
