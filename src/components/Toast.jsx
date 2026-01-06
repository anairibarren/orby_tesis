import React, { useEffect } from "react";
import { Icon } from "@iconify/react";

const VARIANTS = {
  success: { icon: "mdi:check-circle", color: "#30B94F" },
  warning: { icon: "mdi:alert-circle", color: "#CBA21A" },
  error: { icon: "mdi:close-circle", color: "#912A2A" }
};

export default function Toast({ open, variant = "success", message = "", onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), 2500);
    return () => clearTimeout(t);
  }, [open, onClose]);

  const v = VARIANTS[variant] ?? VARIANTS.success;

  return (
    <div
      className={[
        "fixed top-4 left-1/2 -translate-x-1/2 z-[9999]",
        "w-[92%] max-w-md",
        "transition-all duration-300 ease-out",
        open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      ].join(" ")}
    >
      <div
        className="rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-3"
        style={{ backgroundColor: "#262626" }}
      >
        <Icon icon={v.icon} className="w-6 h-6" style={{ color: v.color }} />
        <p className="text-white font-medium text-[15px] leading-snug">{message}</p>

        <button
          onClick={onClose}
          className="ml-auto text-white/70 hover:text-white transition"
          aria-label="Cerrar"
        >
          <Icon icon="mdi:close" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
