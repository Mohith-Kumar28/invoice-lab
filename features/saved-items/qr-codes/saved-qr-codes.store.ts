import { createSavedItemsStore } from "@/features/saved-items/store/createSavedItemsStore";
import type { QrCodeDoc } from "@/features/qr-code-editor/types/qr-code.types";

export const useSavedQrCodesStore = createSavedItemsStore<QrCodeDoc>({
  storageKey: "invoice-forge-saved-qr-codes",
  isEmpty: (q) => {
    if (q.type === "raw") return !q.rawText?.trim();
    if (q.type === "url") return !q.url?.trim();
    if (q.type === "phone") return !q.phoneNumber?.trim();
    if (q.type === "sms") return !q.smsNumber?.trim() && !q.smsBody?.trim();
    if (q.type === "twitter") return !q.twitterHandle?.trim();
    if (q.type === "tweet") return !q.tweetText?.trim() && !q.tweetUrl?.trim();
    if (q.type === "wifi") return !q.wifiSsid?.trim();
    if (q.type === "email")
      return !q.emailTo?.trim() && !q.emailSubject?.trim() && !q.emailBody?.trim();
    if (q.type === "event")
      return !q.eventTitle?.trim() && !q.eventStart?.trim() && !q.eventEnd?.trim();
    if (q.type === "upi") return !q.upiVpa?.trim();
    return true;
  },
  prepare: (q, existing) => {
    const now = new Date();
    if (existing)
      return {
        ...q,
        createdAt: existing.createdAt,
        updatedAt: now,
      };
    return { ...q, createdAt: now, updatedAt: now };
  },
});
