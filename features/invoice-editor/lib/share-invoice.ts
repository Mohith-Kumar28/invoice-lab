import LZString from "lz-string";
import type { Invoice } from "@/types/invoice.types";

function replacer(_key: string, value: unknown) {
  if (value instanceof Date) return value.toISOString();
  return value;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function reviveDates(obj: Record<string, unknown>) {
  const parseDate = (v: unknown) => {
    if (typeof v !== "string") return v;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? v : d;
  };

  obj.issueDate = parseDate(obj.issueDate);
  obj.dueDate = parseDate(obj.dueDate);
  obj.deliveryDate = parseDate(obj.deliveryDate);
  obj.createdAt = parseDate(obj.createdAt);
  obj.updatedAt = parseDate(obj.updatedAt);
  if (Array.isArray(obj.partialPayments)) {
    obj.partialPayments = obj.partialPayments.map((p) => {
      if (!isRecord(p)) return p;
      return { ...p, date: parseDate(p.date) };
    });
  }
  return obj;
}

export function invoiceToSharePayload(invoice: Partial<Invoice>) {
  const cloneRaw: unknown = JSON.parse(JSON.stringify(invoice, replacer));
  const clone: Record<string, unknown> = isRecord(cloneRaw) ? cloneRaw : {};

  delete clone.id;
  delete clone.createdAt;
  delete clone.updatedAt;

  if (isRecord(clone.from)) delete clone.from.logo;
  if (isRecord(clone.to)) delete clone.to.logo;
  delete clone.signature;
  delete clone.upiQr;
  delete clone.pdfBrand;

  if (isRecord(clone.bankDetails)) {
    delete clone.bankDetails.logo;
  }

  delete clone.attachments;

  return clone;
}

export function encodeInvoiceToUrlParam(invoice: Partial<Invoice>) {
  const payload = invoiceToSharePayload(invoice);
  const json = JSON.stringify(payload);
  return LZString.compressToEncodedURIComponent(json);
}

export function decodeInvoiceFromUrlParam(
  encoded: string,
): Partial<Invoice> | null {
  const json = LZString.decompressFromEncodedURIComponent(encoded);
  if (!json) return null;
  const parsed: unknown = JSON.parse(json);
  if (!isRecord(parsed)) return null;
  return reviveDates(parsed) as Partial<Invoice>;
}
