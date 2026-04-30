import React from "react";
import { cn } from "./ui/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  children,
  className
}) => {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between mb-4", className)}>
      <div className="flex flex-col">
        <h1 className="text-[22px] font-semibold text-[#DC2626] leading-[28px] mb-1 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-[14px] font-normal text-[#6B7280] leading-[20px] mb-2 md:mb-4">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 md:mt-0 mt-2 mb-4 justify-start md:justify-end">
          {children}
        </div>
      )}
    </div>
  );
};
