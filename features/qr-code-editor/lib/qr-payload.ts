import type {
  QrCodeDoc,
  WifiEncryption,
} from "@/features/qr-code-editor/types/qr-code.types";
import { APP_NAME } from "@/lib/site";

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function escapeWifiValue(value: string): string {
  return value.replace(/[\\;,:"]/g, (m) => `\\${m}`);
}

function wifiType(encryption: WifiEncryption): string {
  if (encryption === "nopass") return "nopass";
  return encryption;
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatIcsUtcDateTime(date: Date): string {
  return `${date.getUTCFullYear()}${pad2(date.getUTCMonth() + 1)}${pad2(
    date.getUTCDate(),
  )}T${pad2(date.getUTCHours())}${pad2(date.getUTCMinutes())}${pad2(
    date.getUTCSeconds(),
  )}Z`;
}

function formatIcsDate(date: Date): string {
  return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(
    date.getDate(),
  )}`;
}

function parseLocalDateTime(input: string): Date | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function addDays(d: Date, days: number) {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

function buildGoogleCalendarDates({
  start,
  end,
  allDay,
}: {
  start: Date;
  end: Date;
  allDay: boolean;
}) {
  if (allDay) {
    const s = formatIcsDate(start);
    const e = formatIcsDate(end);
    return `${s}/${e}`;
  }
  return `${formatIcsUtcDateTime(start)}/${formatIcsUtcDateTime(end)}`;
}

function buildGoogleCalendarUrl(doc: QrCodeDoc): string {
  const start = parseLocalDateTime(doc.eventStart);
  const end = parseLocalDateTime(doc.eventEnd);
  if (!start || !end) return "";

  const dates = buildGoogleCalendarDates({
    start,
    end: doc.eventAllDay ? addDays(end, 1) : end,
    allDay: doc.eventAllDay,
  });

  const params = new URLSearchParams();
  params.set("action", "TEMPLATE");
  if (doc.eventTitle.trim()) params.set("text", doc.eventTitle.trim());
  if (doc.eventLocation.trim()) params.set("location", doc.eventLocation.trim());
  if (doc.eventDescription.trim())
    params.set("details", doc.eventDescription.trim());
  params.set("dates", dates);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildIcal(doc: QrCodeDoc): string {
  const start = parseLocalDateTime(doc.eventStart);
  const end = parseLocalDateTime(doc.eventEnd);
  if (!start || !end) return "";

  const uid = `${crypto.randomUUID()}@qr`;
  const dtstamp = formatIcsUtcDateTime(new Date());
  const prodIdApp = APP_NAME.replace(/[^a-z0-9-]/gi, "");

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${prodIdApp || "App"}//QR Code Generator//EN`,
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
  ];

  if (doc.eventAllDay) {
    const s = formatIcsDate(start);
    const e = formatIcsDate(addDays(end, 1));
    lines.push(`DTSTART;VALUE=DATE:${s}`);
    lines.push(`DTEND;VALUE=DATE:${e}`);
  } else {
    lines.push(`DTSTART:${formatIcsUtcDateTime(start)}`);
    lines.push(`DTEND:${formatIcsUtcDateTime(end)}`);
  }

  if (doc.eventTitle.trim()) lines.push(`SUMMARY:${escapeIcsText(doc.eventTitle.trim())}`);
  if (doc.eventLocation.trim())
    lines.push(`LOCATION:${escapeIcsText(doc.eventLocation.trim())}`);
  if (doc.eventDescription.trim())
    lines.push(`DESCRIPTION:${escapeIcsText(doc.eventDescription.trim())}`);

  lines.push("END:VEVENT", "END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}

export function buildQrPayload(doc: QrCodeDoc): string {
  switch (doc.type) {
    case "raw":
      return doc.rawText;
    case "url":
      return normalizeUrl(doc.url);
    case "phone": {
      const number = doc.phoneNumber.trim();
      if (!number) return "";
      return `tel:${number}`;
    }
    case "sms": {
      const number = doc.smsNumber.trim();
      const body = doc.smsBody.trim();
      if (!number && !body) return "";
      if (!body) return `sms:${number}`;
      const params = new URLSearchParams();
      params.set("body", body);
      return `sms:${number}?${params.toString()}`;
    }
    case "twitter": {
      const handle = doc.twitterHandle.trim().replace(/^@/, "");
      if (!handle) return "";
      return `https://twitter.com/${handle}`;
    }
    case "tweet": {
      const text = doc.tweetText.trim();
      const url = doc.tweetUrl.trim();
      if (!text && !url) return "";
      const params = new URLSearchParams();
      if (text) params.set("text", text);
      if (url) params.set("url", normalizeUrl(url));
      return `https://twitter.com/intent/tweet?${params.toString()}`;
    }
    case "wifi": {
      const ssid = doc.wifiSsid.trim();
      if (!ssid) return "";
      const t = wifiType(doc.wifiEncryption);
      const s = escapeWifiValue(ssid);
      const p = escapeWifiValue(doc.wifiPassword || "");
      const h = doc.wifiHidden ? "true" : "";
      const parts = [
        `WIFI:T:${t};`,
        `S:${s};`,
        doc.wifiEncryption === "nopass" ? "" : `P:${p};`,
        doc.wifiHidden ? `H:${h};` : "",
        ";",
      ];
      return parts.join("");
    }
    case "email": {
      const to = doc.emailTo.trim();
      const subject = doc.emailSubject.trim();
      const body = doc.emailBody.trim();
      if (!to && !subject && !body) return "";
      const params = new URLSearchParams();
      if (subject) params.set("subject", subject);
      if (body) params.set("body", body);
      const qs = params.toString();
      return `mailto:${to}${qs ? `?${qs}` : ""}`;
    }
    case "event":
      return doc.eventOutputFormat === "google"
        ? buildGoogleCalendarUrl(doc)
        : buildIcal(doc);
    case "upi": {
      const pa = doc.upiVpa.trim();
      const pn = doc.upiPayeeName.trim();
      const note = doc.upiNote.trim();
      const amount = Number(doc.upiAmount);
      if (!pa) return "";
      if (!Number.isFinite(amount) || amount <= 0) return "";
      const params = new URLSearchParams();
      params.set("pa", pa);
      if (pn) params.set("pn", pn);
      params.set("am", amount.toFixed(2));
      params.set("cu", "INR");
      if (note) params.set("tn", note);
      return `upi://pay?${params.toString()}`;
    }
    default:
      return "";
  }
}
