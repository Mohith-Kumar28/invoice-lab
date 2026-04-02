import type { Invoice } from "@/types/invoice.types";
import { InvoiceTemplate } from "./InvoiceTemplate";

export const templates = {
  modern: ({ invoice }: { invoice: Partial<Invoice> }) => (
    <InvoiceTemplate invoice={invoice} variant="modern" />
  ),
  classic: ({ invoice }: { invoice: Partial<Invoice> }) => (
    <InvoiceTemplate invoice={invoice} variant="classic" />
  ),
  minimal: ({ invoice }: { invoice: Partial<Invoice> }) => (
    <InvoiceTemplate invoice={invoice} variant="minimal" />
  ),
  bold: ({ invoice }: { invoice: Partial<Invoice> }) => (
    <InvoiceTemplate invoice={invoice} variant="bold" />
  ),
  creative: ({ invoice }: { invoice: Partial<Invoice> }) => (
    <InvoiceTemplate invoice={invoice} variant="creative" />
  ),
  corporate: ({ invoice }: { invoice: Partial<Invoice> }) => (
    <InvoiceTemplate invoice={invoice} variant="corporate" />
  ),
  freelancer: ({ invoice }: { invoice: Partial<Invoice> }) => (
    <InvoiceTemplate invoice={invoice} variant="freelancer" />
  ),
};

export type TemplateKey = keyof typeof templates;
