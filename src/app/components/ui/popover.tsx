"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "./utils";

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root {...props} />;
}

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> & Record<string, any>
>((allProps, ref) => {
  // Create a new props object without Figma inspector properties
  const cleanProps: any = {};
  const figmaProps = ['_fgT', '_fgt', '_fgS', '_fgs', '_fgB', '_fgb'];
  
  for (const key in allProps) {
    if (!figmaProps.includes(key) && Object.prototype.hasOwnProperty.call(allProps, key)) {
      cleanProps[key] = (allProps as any)[key];
    }
  }
  
  return <PopoverPrimitive.Trigger ref={ref} {...cleanProps} />;
});
PopoverTrigger.displayName = "PopoverTrigger";

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

const PopoverAnchor = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Anchor>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor> & Record<string, any>
>((allProps, ref) => {
  // Create a new props object without Figma inspector properties
  const cleanProps: any = {};
  const figmaProps = ['_fgT', '_fgt', '_fgS', '_fgs', '_fgB', '_fgb'];
  
  for (const key in allProps) {
    if (!figmaProps.includes(key) && Object.prototype.hasOwnProperty.call(allProps, key)) {
      cleanProps[key] = (allProps as any)[key];
    }
  }
  
  return <PopoverPrimitive.Anchor ref={ref} data-slot="popover-anchor" {...cleanProps} />;
});
PopoverAnchor.displayName = "PopoverAnchor";

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
