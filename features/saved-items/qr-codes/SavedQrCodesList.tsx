"use client";

import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQrCodeStore } from "@/features/qr-code-editor/store/qr-code.store";
import { SavedItemsList } from "@/features/saved-items/components/SavedItemsList";
import { useSavedQrCodesStore } from "@/features/saved-items/qr-codes/saved-qr-codes.store";
import type { QrCodeDoc } from "@/features/qr-code-editor/types/qr-code.types";

function getTitle(item: QrCodeDoc) {
  if (item.type === "url") return "URL";
  if (item.type === "upi") return "UPI Payment";
  if (item.type === "raw") return "Raw Data";
  if (item.type === "phone") return "Phone";
  if (item.type === "sms") return "SMS";
  if (item.type === "twitter") return "Twitter";
  if (item.type === "tweet") return "Tweet";
  if (item.type === "wifi") return "Wi‑Fi";
  if (item.type === "email") return "Email";
  if (item.type === "event") return "Event";
  return "QR";
}

function getSubtitle(item: QrCodeDoc) {
  if (item.type === "url") return item.url || "—";
  if (item.type === "upi") return item.upiVpa || "—";
  if (item.type === "raw") return (item.rawText || "").split("\n")[0] || "—";
  if (item.type === "phone") return item.phoneNumber || "—";
  if (item.type === "sms") return item.smsNumber || item.smsBody || "—";
  if (item.type === "twitter") return item.twitterHandle || "—";
  if (item.type === "tweet") return item.tweetText || item.tweetUrl || "—";
  if (item.type === "wifi") return item.wifiSsid || "—";
  if (item.type === "email") return item.emailTo || item.emailSubject || "—";
  if (item.type === "event") return item.eventTitle || "—";
  return "—";
}

export function SavedQrCodesList({ onSelect }: { onSelect?: () => void }) {
  const { items, deleteItem, clearAll } = useSavedQrCodesStore();
  const setDoc = useQrCodeStore((s) => s.setDoc);

  return (
    <SavedItemsList
      title="Saved QRs"
      emptyTitle="No saved QRs yet."
      emptyDescription="QRs will auto-save here as you edit them."
      confirmClearAll="Are you sure you want to delete all saved QRs?"
      onClearAll={clearAll}
      isEmpty={items.length === 0}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-2 p-4 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0">
              <p className="font-bold text-base text-foreground">
                {getTitle(item)}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2 break-words">
                {getSubtitle(item)}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm text-muted-foreground mt-0.5">
                {item.updatedAt
                  ? format(new Date(item.updatedAt), "MMM d, yyyy")
                  : "—"}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
            <div className="text-xs text-muted-foreground">
              {item.logoDataUrl ? "Logo" : "No Logo"}
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setDoc(item);
                  onSelect?.();
                }}
                className="h-8"
              >
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => deleteItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </SavedItemsList>
  );
}
