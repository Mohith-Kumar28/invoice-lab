"use client";

import { Trash2 } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";

export function ImagePicker({
  accept,
  value,
  onChange,
  fileLabel,
  maxSizeBytes,
  onError,
}: {
  accept: string;
  value?: string;
  onChange: (next?: string) => void;
  fileLabel: string;
  maxSizeBytes?: number;
  onError?: (message: string) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [name, setName] = React.useState<string>("");

  return (
    <div className="flex items-center gap-4">
      {value ? (
        <div className="w-16 h-16 rounded-md overflow-hidden border bg-white flex items-center justify-center">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        </div>
      ) : null}

      <div className="flex-1 min-w-0">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setName(file.name);
            if (maxSizeBytes && file.size > maxSizeBytes) {
              onError?.("File is too large.");
              e.currentTarget.value = "";
              return;
            }
            const reader = new FileReader();
            reader.onerror = () => {
              onError?.("Failed to read file.");
            };
            reader.onload = () => {
              const result = reader.result;
              if (typeof result === "string") onChange(result);
              else onError?.("Invalid file contents.");
            };
            reader.readAsDataURL(file);
            e.currentTarget.value = "";
          }}
        />
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="bg-primary/10 text-primary hover:bg-primary/20"
            onClick={() => inputRef.current?.click()}
          >
            Choose
          </Button>
          <div className="text-sm text-muted-foreground truncate min-w-0">
            {name || (value ? "Image selected" : fileLabel)}
          </div>
        </div>
      </div>

      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => {
            setName("");
            onChange(undefined);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}

