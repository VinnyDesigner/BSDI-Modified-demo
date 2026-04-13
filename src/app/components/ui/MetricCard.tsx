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
  blobColor: string;
}> = {
  blue: {
    iconBg: "rgba(59, 130, 246, 0.1)",
    iconColor: "#2563EB",
    blobColor: "rgba(59, 130, 246, 0.05)",
  },
  yellow: {
    iconBg: "#FFF4E5",
    iconColor: "#B26A00",
    blobColor: "rgba(178, 106, 0, 0.05)",
  },
  green: {
    iconBg: "#E6F7EF",
    iconColor: "#1F8A5B",
    blobColor: "rgba(31, 138, 91, 0.05)",
  },
  red: {
    iconBg: "rgba(239, 68, 68, 0.1)",
    iconColor: "#DC2626",
    blobColor: "rgba(239, 68, 68, 0.05)",
  },
  purple: {
    iconBg: "rgba(139, 92, 246, 0.1)",
    iconColor: "#7C3AED",
    blobColor: "rgba(139, 92, 246, 0.05)",
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
        "relative flex items-center justify-between p-[24px] rounded-[24px] transition-all duration-300 cursor-default min-w-0 flex-1 h-[110px]",
        "bg-[#FFFFFF] border border-[#E5E7EB] shadow-[0px_1px_2px_rgba(0,0,0,0.04)]",
        "hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1",
        className
      )}
    >
      {/* Decorative Blob */}
      <div 
        className="absolute -right-4 -top-4 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-60 z-0"
        style={{ background: styles.blobColor }}
      />

      {/* Content Section */}
      <div className="relative z-10 flex flex-col gap-1 min-w-0 overflow-hidden">
        <span className="text-[13px] font-medium text-[#6B7280] tracking-tight truncate">
          {label}
        </span>
        
        <div className="flex items-baseline gap-2">
          <span className="text-[26px] font-extrabold text-[#111827] leading-none">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
          {trend && (
            <span className={`text-[12px] font-bold ${trend.isPositive ? 'text-[#059669]' : 'text-[#DC2626]'}`}>
              {trend.value}
            </span>
          )}
        </div>

        {statusText && (
          <span className="text-[11px] font-medium text-[#9CA3AF] truncate">
            {statusText}
          </span>
        )}
      </div>

      {/* Icon Wrapper */}
      <div
        className="relative z-10 flex items-center justify-center rounded-[18px] shrink-0 w-12 h-12 shadow-sm"
        style={{
          background: styles.iconBg,
          color: styles.iconColor,
        }}
      >
        <div className="transform transition-transform group-hover:scale-110 duration-300">
          {icon}
        </div>
      </div>
    </div>
  );
};
