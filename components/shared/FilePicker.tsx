"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

type FilePickerProps = {
  accept: string;
  onFile: (file: File) => void;
  fileLabel: string;
};

export function FilePicker({ accept, onFile, fileLabel }: FilePickerProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [name, setName] = React.useState<string>("");

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setName(file.name);
          onFile(file);
          e.currentTarget.value = "";
        }}
      />
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
        {name || fileLabel}
      </div>
    </div>
  );
}
