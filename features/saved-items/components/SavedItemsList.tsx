"use client";

import type * as React from "react";
import { Button } from "@/components/ui/button";

export function SavedItemsList({
  title,
  emptyTitle,
  emptyDescription,
  clearAllLabel = "Clear All",
  confirmClearAll,
  isEmpty,
  onClearAll,
  children,
}: {
  title: string;
  emptyTitle: string;
  emptyDescription?: string;
  clearAllLabel?: string;
  confirmClearAll?: string;
  isEmpty: boolean;
  onClearAll: () => void;
  children: React.ReactNode;
}) {
  if (isEmpty) {
    return (
      <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full min-h-[200px]">
        <p>{emptyTitle}</p>
        {emptyDescription ? (
          <p className="text-sm mt-2">{emptyDescription}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between p-4 border-b shrink-0">
        <h3 className="font-semibold text-lg">{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => {
            if (confirmClearAll && !window.confirm(confirmClearAll)) return;
            onClearAll();
          }}
        >
          {clearAllLabel}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">{children}</div>
    </div>
  );
}
