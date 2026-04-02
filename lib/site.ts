export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "InvoiceLab";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://invoicelab.in"
).replace(/\/$/, "");
