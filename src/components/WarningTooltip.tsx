"use client";

import { useState, useRef, useEffect } from "react";
import { StockWarning } from "@/data/nasdaq100Additions";

interface WarningTooltipProps {
  warning: StockWarning;
}

export default function WarningTooltip({ warning }: WarningTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="text-amber-500 hover:text-amber-400 text-lg font-bold cursor-pointer ml-2"
        aria-label={warning.title}
        title={warning.title}
      >
        &#9888;
      </button>
      {open && (
        <div className="absolute z-50 left-0 top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 text-sm text-gray-200">
          <div className="font-semibold text-amber-400 mb-1">
            {warning.title}
          </div>
          <div className="text-gray-300 leading-relaxed">
            {warning.description}
          </div>
          <div className="absolute -top-1.5 left-3 w-3 h-3 bg-gray-800 border-l border-t border-gray-600 rotate-45" />
        </div>
      )}
    </div>
  );
}
