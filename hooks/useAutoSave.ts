"use client";

import { useEffect, useRef, useState } from "react";
import { AUTO_SAVE_DELAY_MS, SAVE_STATUS_RESET_MS } from "@/lib/tool-defaults";

export type AutoSaveStatus = "idle" | "saving" | "saved";

export function useAutoSave<T>({
  value,
  onSave,
  enabled = true,
  delayMs = AUTO_SAVE_DELAY_MS,
  resetMs = SAVE_STATUS_RESET_MS,
}: {
  value: T;
  onSave: (value: T) => void | Promise<void>;
  enabled?: boolean;
  delayMs?: number;
  resetMs?: number;
}) {
  const [status, setStatus] = useState<AutoSaveStatus>("idle");
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const timeoutId = window.setTimeout(async () => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
      setStatus("saving");
      try {
        await onSave(value);
      } finally {
        setStatus("saved");
        resetTimerRef.current = window.setTimeout(() => {
          setStatus("idle");
        }, resetMs);
      }
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delayMs, enabled, onSave, resetMs, value]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  return status;
}
