import React from "react";

interface BadgeProps {
  variant?: "info" | "success" | "warning" | "error" | "purple" | "default";
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = "default", children, className = "" }) => {
  const styles = {
    default: "bg-white/5 text-gray-300 border-white/10",
    info: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    error: "bg-rose-500/15 text-rose-400 border-rose-500/25",
    purple: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
