import React from "react";
import { cn } from "./utils";

export type MetricCardVariant = "blue" | "yellow" | "green" | "red" | "purple";

interface MetricCardProps {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  variant?: MetricCardVariant;
  className?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  statusText?: string;
}

const variantStyles: Record<MetricCardVariant, {
  iconBg: string;
  iconColor: string;
  cardBg: string;
  glowColor: string;
}> = {
  blue: {
    iconBg: "#BFDBFE",
    iconColor: "#1E40AF",
    cardBg: "#EFF6FF",
    glowColor: "rgba(59, 130, 246, 0.2)",
  },
  yellow: {
    iconBg: "#FEF3C7",
    iconColor: "#92400E",
    cardBg: "#FFFBEB",
    glowColor: "rgba(245, 158, 11, 0.2)",
  },
  green: {
    iconBg: "#DCFCE7",
    iconColor: "#166534",
    cardBg: "#F0FDF4",
    glowColor: "rgba(34, 197, 94, 0.2)",
  },
  red: {
    iconBg: "#FEE2E2",
    iconColor: "#991B1B",
    cardBg: "#FEF2F2",
    glowColor: "rgba(239, 68, 68, 0.2)",
  },
  purple: {
    iconBg: "#F3E8FF",
    iconColor: "#6B21A8",
    cardBg: "#FAF5FF",
    glowColor: "rgba(168, 85, 247, 0.2)",
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  icon,
  variant = "blue",
  className,
  trend,
  statusText,
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "relative p-4 sm:p-6 rounded-[24px] transition-all duration-300 cursor-default min-w-0 flex-1",
        "border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] group",
        "hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1",
        className
      )}
      style={{ background: styles.cardBg }}
    >
      <div className="flex flex-col gap-2 sm:gap-4">
        {/* Label on top */}
        <span className="text-[10px] sm:text-[13px] font-bold text-[#64748B] uppercase tracking-wider opacity-80">
          {label}
        </span>
        
        {/* Value and Icon Row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-[22px] sm:text-[32px] font-extrabold text-[#1e293b] leading-tight">
                {typeof value === "number" ? value.toLocaleString() : value}
              </span>
              {trend && (
                <span className={`text-[10px] sm:text-[12px] font-bold ${trend.isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                  {trend.value}
                </span>
              )}
            </div>
            {statusText && (
              <span className="text-[9px] sm:text-[11px] font-medium text-[#94A3B8] truncate mt-0.5">
                {statusText}
              </span>
            )}
          </div>

          {/* Icon Beside Number on Mobile */}
          <div
            className="flex items-center justify-center rounded-full shrink-0 w-10 h-10 sm:w-14 sm:h-14 transition-all duration-300 group-hover:scale-110"
            style={{
              background: styles.iconBg,
              color: styles.iconColor,
              boxShadow: `0 4px 12px ${styles.glowColor}`,
            }}
          >
            <div className="[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-7 sm:[&_svg]:!h-7">
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
