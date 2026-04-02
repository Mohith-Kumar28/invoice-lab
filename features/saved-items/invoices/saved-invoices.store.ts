import { createSavedItemsStore } from "@/features/saved-items/store/createSavedItemsStore";
import type { Invoice } from "@/types/invoice.types";

export const useSavedInvoicesStore = createSavedItemsStore<Invoice>({
  storageKey: "invoice-forge-saved-invoices",
  isEmpty: (invoice) =>
    !invoice.invoiceNumber &&
    !invoice.to?.businessName &&
    (!invoice.lineItems || invoice.lineItems.length === 0),
  sanitize: (invoice) => {
    const next: Invoice = { ...invoice };
    if (next.from) {
      next.from = { ...next.from };
      delete next.from.logo;
    }
    if (next.to) {
      next.to = { ...next.to };
      delete next.to.logo;
    }
    next.signature = undefined;
    next.upiQr = undefined;
    next.pdfBrand = undefined;
    return next;
  },
  prepare: (invoice, existing) => {
    const now = new Date();
    if (existing)
      return { ...invoice, createdAt: existing.createdAt, updatedAt: now };
    return { ...invoice, createdAt: now, updatedAt: now };
  },
});
