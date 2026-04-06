"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

export function Slider({
  value,
  min,
  max,
  step,
  onValueChange,
  className,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (next: number) => void;
  className?: string;
}) {
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onValueChange(Number(e.target.value))}
      className={cn("w-full accent-primary", className)}
    />
  );
}

