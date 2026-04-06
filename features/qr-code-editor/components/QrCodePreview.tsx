"use client";

import * as React from "react";
import {
  Calendar,
  IndianRupee,
  Link2,
  Mail,
  MessageSquare,
  Phone,
  Share2,
  TextAlignStart,
  Wifi,
} from "lucide-react";
import { buildQrPayload } from "@/features/qr-code-editor/lib/qr-payload";
import { useQrCodeStore } from "@/features/qr-code-editor/store/qr-code.store";

type QRCodeStylingType = {
  append: (container: HTMLElement) => void;
  update: (options?: any) => void;
  download: (downloadOptions?: any) => Promise<void>;
};

function getTypeLabel(type: string) {
  if (type === "raw") return "Raw Data";
  if (type === "url") return "URL";
  if (type === "phone") return "Phone Number";
  if (type === "sms") return "SMS";
  if (type === "twitter") return "Twitter";
  if (type === "tweet") return "Tweet";
  if (type === "wifi") return "Wi‑Fi";
  if (type === "email") return "Email";
  if (type === "event") return "Event";
  if (type === "upi") return "UPI Payment";
  return "QR";
}

function getTypeIcon(type: string) {
  if (type === "url") return Link2;
  if (type === "phone") return Phone;
  if (type === "sms") return MessageSquare;
  if (type === "twitter" || type === "tweet") return Share2;
  if (type === "wifi") return Wifi;
  if (type === "email") return Mail;
  if (type === "event") return Calendar;
  if (type === "upi") return IndianRupee;
  return TextAlignStart;
}

function getDetailsValue(doc: {
  type: string;
  url: string;
  rawText: string;
  phoneNumber: string;
  smsNumber: string;
  smsBody: string;
  twitterHandle: string;
  tweetText: string;
  tweetUrl: string;
  wifiSsid: string;
  wifiPassword: string;
  emailTo: string;
  emailSubject: string;
  eventTitle: string;
  eventStart: string;
  eventEnd: string;
  upiVpa?: string;
  upiAmount?: string;
}) {
  if (doc.type === "url") return doc.url || "—";
  if (doc.type === "raw") return (doc.rawText || "").split("\n")[0] || "—";
  if (doc.type === "phone") return doc.phoneNumber || "—";
  if (doc.type === "sms") return doc.smsNumber || doc.smsBody || "—";
  if (doc.type === "twitter") return doc.twitterHandle || "—";
  if (doc.type === "tweet") return doc.tweetText || doc.tweetUrl || "—";
  if (doc.type === "wifi") {
    const name = doc.wifiSsid || "—";
    const pass = doc.wifiPassword ? "••••••••" : "No password";
    return `${name} • ${pass}`;
  }
  if (doc.type === "email") return doc.emailTo || doc.emailSubject || "—";
  if (doc.type === "event") {
    const base = doc.eventTitle || "Event";
    if (doc.eventStart && doc.eventEnd) return `${base} • ${doc.eventStart}`;
    return base;
  }
  if (doc.type === "upi") {
    const vpa = doc.upiVpa || "—";
    const amount = Number(doc.upiAmount);
    const amountText =
      Number.isFinite(amount) && amount > 0 ? `₹${amount.toFixed(2)}` : "₹—";
    return `${vpa} • ${amountText}`;
  }
  return "—";
}

function downloadBlob({
  blob,
  fileName,
}: {
  blob: Blob;
  fileName: string;
}) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  setTimeout(() => {
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 0);
}

function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width <= maxWidth) {
      line = next;
    } else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function extractSvgInner(svgText: string) {
  const match = svgText.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const open = svgText.match(/<svg([^>]*)>/i);
  const attrs = open?.[1] || "";
  const viewBoxMatch = attrs.match(/viewBox="([^"]+)"/i);
  return {
    inner: match?.[1] || svgText,
    viewBox: viewBoxMatch?.[1] || undefined,
  };
}

function wrapPlainText(text: string, maxChars: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length <= maxChars) line = next;
    else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

type IconNode = ReadonlyArray<
  readonly [
    "path" | "line" | "circle" | "rect",
    Record<string, string | number>,
  ]
>;

const ICON_NODES: Record<string, IconNode> = {
  url: [
    ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2" }],
    ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2" }],
    ["line", { x1: "8", x2: "16", y1: "12", y2: "12" }],
  ],
  phone: [
    [
      "path",
      {
        d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      },
    ],
  ],
  sms: [
    [
      "path",
      {
        d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      },
    ],
  ],
  twitter: [
    ["circle", { cx: "18", cy: "5", r: "3" }],
    ["circle", { cx: "6", cy: "12", r: "3" }],
    ["circle", { cx: "18", cy: "19", r: "3" }],
    ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49" }],
    ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49" }],
  ],
  tweet: [
    ["circle", { cx: "18", cy: "5", r: "3" }],
    ["circle", { cx: "6", cy: "12", r: "3" }],
    ["circle", { cx: "18", cy: "19", r: "3" }],
    ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49" }],
    ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49" }],
  ],
  wifi: [
    ["path", { d: "M12 20h.01" }],
    ["path", { d: "M2 8.82a15 15 0 0 1 20 0" }],
    ["path", { d: "M5 12.859a10 10 0 0 1 14 0" }],
    ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0" }],
  ],
  email: [
    ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" }],
    ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }],
  ],
  event: [
    ["path", { d: "M8 2v4" }],
    ["path", { d: "M16 2v4" }],
    ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
    ["path", { d: "M3 10h18" }],
  ],
  upi: [
    ["path", { d: "M6 3h12" }],
    ["path", { d: "M6 8h12" }],
    ["path", { d: "m6 13 8.5 8" }],
    ["path", { d: "M6 13h3" }],
    ["path", { d: "M9 13c6.667 0 6.667-10 0-10" }],
  ],
  raw: [
    ["path", { d: "M21 5H3" }],
    ["path", { d: "M15 12H3" }],
    ["path", { d: "M17 19H3" }],
  ],
};

function iconSvg({
  type,
  size,
  stroke,
  strokeWidth,
}: {
  type: string;
  size: number;
  stroke: string;
  strokeWidth: number;
}) {
  const nodes = ICON_NODES[type] || ICON_NODES.raw;
  const body = nodes
    .map(([tag, attrs]) => {
      const attrText = Object.entries(attrs)
        .map(([k, v]) => `${k}="${String(v)}"`)
        .join(" ");
      return `<${tag} ${attrText} />`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

function base64EncodeUtf8(input: string) {
  const utf8 = encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(Number.parseInt(p1, 16)),
  );
  return btoa(utf8);
}

export function QrCodePreview() {
  const doc = useQrCodeStore((s) => s.doc);
  const registerDownloadApi = useQrCodeStore((s) => s.registerDownloadApi);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const qrRef = React.useRef<QRCodeStylingType | null>(null);
  const sizeRef = React.useRef<number>(doc.style.size);
  const docRef = React.useRef(doc);

  const payload = React.useMemo(() => buildQrPayload(doc), [doc]);
  const typeLabel = React.useMemo(() => getTypeLabel(doc.type), [doc.type]);
  const TypeIcon = React.useMemo(() => getTypeIcon(doc.type), [doc.type]);
  const detailsValue = React.useMemo(() => getDetailsValue(doc), [doc]);
  const previewPad = React.useMemo(
    () => clamp(Math.round((doc.style.size || 320) * 0.12), 28, 56),
    [doc.style.size],
  );

  const options = React.useMemo(() => {
    const cornersSquareType =
      doc.style.cornersSquareType === "none"
        ? undefined
        : doc.style.cornersSquareType;
    const cornersDotType =
      doc.style.cornersDotType === "none" ? undefined : doc.style.cornersDotType;

    const logoMargin = doc.logoDataUrl ? 8 : 0;

    return {
      width: doc.style.size,
      height: doc.style.size,
      type: doc.style.renderType,
      margin: doc.style.margin,
      shape: doc.style.shape,
      data: payload || " ",
      image: doc.logoDataUrl,
      qrOptions: {
        errorCorrectionLevel: doc.style.errorCorrectionLevel,
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: doc.style.logoSize,
        margin: logoMargin,
        crossOrigin: "anonymous",
        saveAsBlob: true,
      },
      dotsOptions: {
        color: doc.style.dotsColor,
        type: doc.style.dotsType,
      },
      backgroundOptions: {
        color: doc.style.backgroundColor,
      },
      cornersSquareOptions: cornersSquareType
        ? {
            color: doc.style.cornersSquareColor,
            type: cornersSquareType,
          }
        : undefined,
      cornersDotOptions: cornersDotType
        ? {
            color: doc.style.cornersDotColor,
            type: cornersDotType,
          }
        : undefined,
    };
  }, [doc, payload]);

  React.useEffect(() => {
    sizeRef.current = doc.style.size;
  }, [doc.style.size]);

  React.useEffect(() => {
    docRef.current = doc;
  }, [doc]);

  React.useEffect(() => {
    let mounted = true;
    async function init() {
      if (!containerRef.current) return;
      if (qrRef.current) return;
      const mod = await import("qr-code-styling");
      if (!mounted) return;
      const QRCodeStyling = mod.default;
      const instance: QRCodeStylingType = new QRCodeStyling(options);
      qrRef.current = instance;
      containerRef.current.innerHTML = "";
      instance.append(containerRef.current);
      registerDownloadApi({
        download: async ({ extension, size, name }) => {
          const currentSize = sizeRef.current;
          const exportSize = Number.isFinite(size) ? size : currentSize;
          if (exportSize !== currentSize) {
            instance.update({ width: exportSize, height: exportSize });
          }
          const d = docRef.current;
          const includeDetails = !!d.showActionDetails;
          const outExt = extension === "jpeg" ? "jpg" : extension;

          if (!includeDetails) {
            const raw: Blob = await (instance as any).getRawData(extension);
            downloadBlob({
              blob: raw,
              fileName: `${name || "qr-code"}.${outExt}`,
            });
            if (exportSize !== currentSize) {
              instance.update({ width: currentSize, height: currentSize });
            }
            return;
          }

          const pad = clamp(Math.round(exportSize * 0.12), 32, 72);
          const scale = exportSize / 512;
          const radius = clamp(Math.round(exportSize * 0.08), 18, 40);
          const cardWidth = exportSize + pad * 2;

          const label = getTypeLabel(d.type);
          const detail = getDetailsValue(d);
          const title = (d.captionTitle || "").trim();
          const description = (d.captionDescription || "").trim();

          const border = "#DDD6FE";
          const cardBg = "#F5F3FF";
          const innerBg = "#ffffff";
          const detailsBg = "#F8FAFF";

          if (extension === "svg") {
            const svgBlob: Blob = await (instance as any).getRawData("svg");
            const svgText = await svgBlob.text();
            const { inner, viewBox } = extractSvgInner(svgText);
            const sanitizedInner = inner
              .replace(/xlink:href=/g, "href=")
              .replace(/xmlns:xlink="[^"]*"/g, "");
            const qrViewBox = viewBox || `0 0 ${exportSize} ${exportSize}`;

            const maxChars = Math.round(44 * clamp(scale, 0.75, 1.5));
            const descLines = description
              ? wrapPlainText(description, maxChars).slice(0, 3)
              : [];

            const detailStartY = pad + exportSize + 28;
            const detailsPadding = Math.round(20 * scale);
            const detailsHeight =
              Math.round(18 * scale) +
              Math.round(18 * scale) +
              (title ? Math.round(26 * scale) : 0) +
              (descLines.length ? descLines.length * Math.round(18 * scale) + Math.round(6 * scale) : 0) +
              detailsPadding * 2;
            const cardHeight = detailStartY + detailsHeight + pad;

            const safe = (s: string) =>
              s
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

            const iconSize = clamp(Math.round(18 * scale), 14, 26);
            const iconStroke = clamp(1.75 * scale, 1.4, 2.2);
            const iconX = pad + detailsPadding;
            const textX = iconX + iconSize + Math.round(10 * scale);
            const labelSize = clamp(Math.round(14 * scale), 12, 18);
            const detailSize = clamp(Math.round(13 * scale), 11, 18);
            const titleSize = clamp(Math.round(18 * scale), 14, 24);
            const descSize = clamp(Math.round(13 * scale), 11, 18);
            const y = detailStartY + detailsPadding + Math.round(16 * scale);
            const line1 = Math.round(22 * scale);

            const titleSvg = title
              ? `<text x="${textX}" y="${y + Math.round(44 * scale)}" font-family="system-ui, -apple-system, Segoe UI, Roboto" font-size="${titleSize}" font-weight="700" fill="rgba(0,0,0,0.85)">${safe(
                  title,
                )}</text>`
              : "";

            const descSvg = descLines
              .map((line, i) => {
                const yy = y + Math.round(72 * scale) + i * Math.round(18 * scale);
                return `<text x="${textX}" y="${yy}" font-family="system-ui, -apple-system, Segoe UI, Roboto" font-size="${descSize}" font-weight="400" fill="rgba(0,0,0,0.6)">${safe(
                  line,
                )}</text>`;
              })
              .join("");

            const svgOut = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <rect x="0.5" y="0.5" width="${cardWidth - 1}" height="${cardHeight - 1}" rx="${radius}" fill="${cardBg}" stroke="${border}" />
  <rect x="${pad}" y="${pad}" width="${exportSize}" height="${exportSize}" rx="${clamp(Math.round(radius * 0.7), 12, 28)}" fill="${innerBg}" stroke="${border}" />
  <g transform="translate(${pad} ${pad})">
    <svg width="${exportSize}" height="${exportSize}" viewBox="${qrViewBox}" preserveAspectRatio="xMidYMid meet">
      ${sanitizedInner}
    </svg>
  </g>
  <line x1="${pad}" y1="${pad + exportSize + 16}" x2="${cardWidth - pad}" y2="${pad + exportSize + 16}" stroke="${border}" stroke-width="1" />
  <rect x="${pad + 14}" y="${pad + exportSize + 28}" width="${cardWidth - (pad + 14) * 2}" height="${detailsHeight}" rx="${clamp(Math.round(radius * 0.7), 12, 24)}" fill="${detailsBg}" stroke="${border}" />
  <g transform="translate(${iconX} ${y - iconSize + 4})">
    ${iconSvg({ type: d.type, size: iconSize, stroke: "rgba(0,0,0,0.85)", strokeWidth: iconStroke })}
  </g>
  <text x="${textX}" y="${y}" font-family="system-ui, -apple-system, Segoe UI, Roboto" font-size="${labelSize}" font-weight="700" fill="rgba(0,0,0,0.85)">${safe(
              `${label}`,
            )}</text>
  <text x="${textX}" y="${y + line1}" font-family="system-ui, -apple-system, Segoe UI, Roboto" font-size="${detailSize}" font-weight="400" fill="rgba(0,0,0,0.6)">${safe(
              detail,
            )}</text>
  ${titleSvg}
  ${descSvg}
</svg>`;

            downloadBlob({
              blob: new Blob([svgOut], { type: "image/svg+xml" }),
              fileName: `${name || "qr-code"}.svg`,
            });

            if (exportSize !== currentSize) {
              instance.update({ width: currentSize, height: currentSize });
            }
            return;
          }

          const qrBlob: Blob = await (instance as any).getRawData("png");
          const qrImg = await loadImageFromBlob(qrBlob);
          const canvas = document.createElement("canvas");
          canvas.width = cardWidth;

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          ctx.font = `${clamp(Math.round(13 * scale), 11, 18)}px system-ui, -apple-system, Segoe UI, Roboto`;
          const maxTextWidth = cardWidth - pad * 2 - 40;
          const descLines = description
            ? wrapText(ctx, description, maxTextWidth).slice(0, 3)
            : [];

          const detailsPadding = Math.round(20 * scale);
          const detailsHeight =
            Math.round(18 * scale) +
            Math.round(18 * scale) +
            (title ? Math.round(26 * scale) : 0) +
            (descLines.length ? descLines.length * Math.round(18 * scale) + Math.round(6 * scale) : 0) +
            detailsPadding * 2;

          const dividerY = pad + exportSize + 16;
          const detailsY = pad + exportSize + 28;
          canvas.height = detailsY + detailsHeight + pad;

          ctx.fillStyle = cardBg;
          drawRoundedRect(ctx, 0, 0, canvas.width, canvas.height, radius);
          ctx.fill();
          ctx.strokeStyle = border;
          ctx.lineWidth = 1;
          ctx.stroke();

          const innerRadius = clamp(Math.round(radius * 0.7), 12, 28);
          ctx.fillStyle = innerBg;
          drawRoundedRect(ctx, pad, pad, exportSize, exportSize, innerRadius);
          ctx.fill();
          ctx.strokeStyle = border;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.drawImage(qrImg, pad, pad, exportSize, exportSize);

          ctx.strokeStyle = border;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pad, dividerY);
          ctx.lineTo(cardWidth - pad, dividerY);
          ctx.stroke();

          const detailsX = pad + 14;
          const detailsW = cardWidth - detailsX * 2;
          const detailsRadius = clamp(Math.round(radius * 0.7), 12, 24);
          ctx.fillStyle = detailsBg;
          drawRoundedRect(ctx, detailsX, detailsY, detailsW, detailsHeight, detailsRadius);
          ctx.fill();
          ctx.strokeStyle = border;
          ctx.lineWidth = 1;
          ctx.stroke();

          let y = detailsY + detailsPadding + 16;
          const textX = detailsX + detailsPadding;

          const iconSize = clamp(Math.round(18 * scale), 14, 26);
          const iconStroke = clamp(1.75 * scale, 1.4, 2.2);
          const icon = iconSvg({
            type: d.type,
            size: iconSize,
            stroke: "rgba(0,0,0,0.85)",
            strokeWidth: iconStroke,
          });
          const iconBlob = new Blob([icon], { type: "image/svg+xml" });
          const iconImg = await loadImageFromBlob(iconBlob);
          ctx.drawImage(iconImg, textX, y - iconSize + 4, iconSize, iconSize);

          ctx.fillStyle = "rgba(0,0,0,0.85)";
          ctx.font = `700 ${clamp(Math.round(14 * scale), 12, 18)}px system-ui, -apple-system, Segoe UI, Roboto`;
          ctx.fillText(label, textX + iconSize + Math.round(10 * scale), y);
          y += 22;

          ctx.fillStyle = "rgba(0,0,0,0.6)";
          ctx.font = `400 ${clamp(Math.round(13 * scale), 11, 18)}px system-ui, -apple-system, Segoe UI, Roboto`;
          ctx.fillText(detail, textX, y);
          y += 22;

          if (title) {
            ctx.fillStyle = "rgba(0,0,0,0.85)";
            ctx.font = `800 ${clamp(Math.round(18 * scale), 14, 24)}px system-ui, -apple-system, Segoe UI, Roboto`;
            ctx.fillText(title, textX, y + Math.round(6 * scale));
            y += Math.round(30 * scale);
          }

          if (descLines.length) {
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.font = `400 ${clamp(Math.round(13 * scale), 11, 18)}px system-ui, -apple-system, Segoe UI, Roboto`;
            for (const line of descLines) {
              ctx.fillText(line, textX, y + Math.round(4 * scale));
              y += Math.round(18 * scale);
            }
          }

          const mime = extension === "jpeg" ? "image/jpeg" : "image/png";
          const quality = extension === "jpeg" ? 0.92 : undefined;
          const dataUrl = canvas.toDataURL(mime, quality as any);
          const res = await fetch(dataUrl);
          const outBlob = await res.blob();
          downloadBlob({
            blob: outBlob,
            fileName: `${name || "qr-code"}.${outExt}`,
          });

          if (exportSize !== currentSize) {
            instance.update({ width: currentSize, height: currentSize });
          }
        },
      });
    }

    init();
    return () => {
      mounted = false;
    };
  }, [options, registerDownloadApi]);

  React.useEffect(() => {
    const qr = qrRef.current;
    if (!qr) return;
    qr.update(options);
  }, [options]);

  React.useEffect(() => {
    return () => {
      registerDownloadApi(undefined);
    };
  }, [registerDownloadApi]);

  return (
    <div className="w-full h-full flex flex-col bg-background">
      <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
        <div
          className="w-full max-w-lg rounded-3xl border shadow-sm"
          style={{
            backgroundColor: "#F5F3FF",
            borderColor: "#DDD6FE",
            padding: previewPad,
          }}
        >
          <div className="flex items-center justify-center">
            <div
              className="rounded-2xl border bg-white flex items-center justify-center"
              style={{
                borderColor: "#DDD6FE",
                padding: 0,
              }}
            >
              <div ref={containerRef} />
            </div>
          </div>
          {doc.showActionDetails ? (
            <div className="mt-4">
              <div className="my-4 border-t" style={{ borderColor: "#DDD6FE" }} />
              <div
                className="rounded-2xl border p-5"
                style={{ backgroundColor: "#F8FAFF", borderColor: "#DDD6FE" }}
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <TypeIcon className="h-4 w-4 text-foreground" />
                  <div className="text-base">{typeLabel}</div>
                </div>
                <div className="mt-1 text-sm text-muted-foreground break-words">
                  {detailsValue}
                </div>
                {(doc.captionTitle || "").trim() ? (
                  <div className="mt-2 text-base font-bold">
                    {(doc.captionTitle || "").trim()}
                  </div>
                ) : null}
                {(doc.captionDescription || "").trim() ? (
                  <div className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                    {(doc.captionDescription || "").trim()}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
