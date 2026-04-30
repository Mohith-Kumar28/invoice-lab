export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "InvoiceLab";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://invoicelab.in"
).replace(/\/$/, "");

export const GITHUB_REPO_URL =
  process.env.NEXT_PUBLIC_GITHUB_REPO_URL ??
  "https://github.com/Mohith-Kumar28/invoice-lab";

export const GITHUB_ISSUES_URL =
  process.env.NEXT_PUBLIC_GITHUB_ISSUES_URL ??
  "https://github.com/Mohith-Kumar28/invoice-lab/issues";
