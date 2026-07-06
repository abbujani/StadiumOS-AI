import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  heavy?: boolean;
  glow?: boolean;
  hoverGlow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  heavy = false,
  glow = false,
  hoverGlow = false,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`rounded-xl transition-all duration-300 ${
        heavy ? "glass-panel-heavy" : "glass-panel"
      } ${
        glow ? "shadow-[0_0_20px_rgba(139,92,246,0.15)] border-purple-500/30" : ""
      } ${
        hoverGlow
          ? "hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] hover:border-blue-500/30 hover:-translate-y-0.5"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default GlassCard;
