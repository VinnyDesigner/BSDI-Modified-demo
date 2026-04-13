import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-[14px] font-[500] transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-sm",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F9FAFB] shadow-sm",
        secondary: "bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[36px] px-4",
        sm: "h-8 rounded-[8px] gap-1.5 px-3",
        lg: "h-10 rounded-[12px] px-6",
        icon: "size-9 rounded-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  // Filter out Figma inspector props
  const { _fgT, _fgt, _fgS, _fgs, _fgB, _fgb, ...cleanProps } = props as any;
  
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...cleanProps}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };