"use client";

import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ColorPickerField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              id={id}
              type="button"
              variant="outline"
              className="w-full justify-start text-left font-normal px-3"
            >
              <div
                className="w-4 h-4 rounded-full border border-border mr-2"
                style={{ backgroundColor: value }}
              />
              <span className="font-mono text-sm uppercase text-muted-foreground">
                {value}
              </span>
            </Button>
          }
        />
        <PopoverContent className="w-auto p-3 flex flex-col gap-3" align="start">
          <HexColorPicker color={value} onChange={onChange} />
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground text-xs font-semibold">
              HEX
            </div>
            <Input
              className="h-8 font-mono text-xs uppercase"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

