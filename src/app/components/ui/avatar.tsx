"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "./utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  // Filter out Figma inspector props
  const { _fgT, _fgt, _fgS, _fgs, _fgB, _fgb, ...cleanProps } = props as any;
  
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...cleanProps}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  // Filter out Figma inspector props
  const { _fgT, _fgt, _fgS, _fgs, _fgB, _fgb, ...cleanProps } = props as any;
  
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...cleanProps}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  // Filter out Figma inspector props
  const { _fgT, _fgt, _fgS, _fgs, _fgB, _fgb, ...cleanProps } = props as any;
  
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...cleanProps}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };