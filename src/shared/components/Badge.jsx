// src/shared/components/Badge.jsx
import React from "react";

const variantClasses = {
  default: "bg-gray-100 text-gray-800",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
};

function Badge({ children, variant = "default", className = "" }) {
  const base =
    "inline-flex items-center px-2 py-[2px] rounded-full text-[10px] font-medium";
  const color = variantClasses[variant] || variantClasses.default;

  return (
    <span className={`${base} ${color} ${className}`.trim()}>{children}</span>
  );
}

export default Badge;
