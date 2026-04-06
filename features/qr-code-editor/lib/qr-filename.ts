import type { QrCodeDoc } from "@/features/qr-code-editor/types/qr-code.types";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function safeNumber(n: number) {
  if (!Number.isFinite(n)) return "";
  return String(n);
}

export function buildQrFileName(doc: QrCodeDoc) {
  const prefix = "qr";
  if (doc.type === "url") {
    try {
      const u = new URL(doc.url.trim().startsWith("http") ? doc.url.trim() : `https://${doc.url.trim()}`);
      const host = slugify(u.host);
      return host ? `${prefix}-url-${host}` : `${prefix}-url`;
    } catch {
      const s = slugify(doc.url || "");
      return s ? `${prefix}-url-${s}` : `${prefix}-url`;
    }
  }
  if (doc.type === "wifi") {
    const s = slugify(doc.wifiSsid || "");
    return s ? `${prefix}-wifi-${s}` : `${prefix}-wifi`;
  }
  if (doc.type === "email") {
    const s = slugify(doc.emailTo || "");
    return s ? `${prefix}-email-${s}` : `${prefix}-email`;
  }
  if (doc.type === "phone") {
    const s = slugify(doc.phoneNumber || "");
    return s ? `${prefix}-phone-${s}` : `${prefix}-phone`;
  }
  if (doc.type === "sms") {
    const s = slugify(doc.smsNumber || "");
    return s ? `${prefix}-sms-${s}` : `${prefix}-sms`;
  }
  if (doc.type === "twitter") {
    const s = slugify((doc.twitterHandle || "").replace(/^@/, ""));
    return s ? `${prefix}-twitter-${s}` : `${prefix}-twitter`;
  }
  if (doc.type === "tweet") {
    const t = slugify(doc.tweetText || "");
    return t ? `${prefix}-tweet-${t}` : `${prefix}-tweet`;
  }
  if (doc.type === "event") {
    const t = slugify(doc.eventTitle || "");
    return t ? `${prefix}-event-${t}` : `${prefix}-event`;
  }
  if (doc.type === "upi") {
    const vpa = slugify(doc.upiVpa || "");
    const amt = safeNumber(Number(doc.upiAmount));
    if (vpa && amt) return `${prefix}-upi-${vpa}-${amt}`;
    if (vpa) return `${prefix}-upi-${vpa}`;
    return `${prefix}-upi`;
  }
  if (doc.type === "raw") {
    const first = slugify((doc.rawText || "").split("\n")[0] || "");
    return first ? `${prefix}-raw-${first}` : `${prefix}-raw`;
  }
  return `${prefix}-${slugify(doc.type) || "code"}`;
}

