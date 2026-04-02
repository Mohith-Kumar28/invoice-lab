import { create } from "zustand";
import { persist } from "zustand/middleware";
import { calculateInvoiceTotals } from "@/features/invoice-editor/lib/invoice-calculator";
import type { Invoice } from "@/types/invoice.types";

type InvoiceUpdate = Partial<Omit<Invoice, "from" | "to" | "bankDetails">> & {
  from?: Partial<Invoice["from"]>;
  to?: Partial<Invoice["to"]>;
  bankDetails?: Partial<NonNullable<Invoice["bankDetails"]>>;
};

interface InvoiceState {
  invoice: Partial<Invoice>;
  errors: Record<string, string>;
  setInvoice: (invoice: Partial<Invoice>) => void;
  updateInvoice: (updates: InvoiceUpdate) => void;
  resetInvoice: () => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: (keys?: string[]) => void;
}

function createDefaultInvoice(): Partial<Invoice> {
  const issueDate = new Date();
  const dueDate = new Date(
    new Date(issueDate).setDate(issueDate.getDate() + 3),
  );

  return {
    id: crypto.randomUUID(),
    invoiceNumber: "INV-0001",
    title: "INVOICE",
    status: undefined,
    currency: "INR",
    issueDate,
    dueDate,

    from: {
      businessName: "",
      email: "",
      address: { line1: "", city: "", country: "" },
    },

    to: {
      businessName: "",
      address: { line1: "", city: "", country: "" },
    },

    lineItems: [],
    subtotal: 0,
    discountType: "percentage",
    discountValue: 0,
    discountAmount: 0,
    taxLines: [],
    shippingFee: 0,
    total: 0,
    amountPaid: 0,
    amountDue: 0,

    paymentTerms: undefined,
    paymentMethods: [],
    paymentMode: "upi",
    bankDetails: {},

    deliverables: "",

    showSignature: false,

    template: "modern",
    colorTheme: "#0038e0",
    fontPairing: "modern",
    showLogo: true,
    showRibbon: true,
    showFooter: true,
    showPageNumbers: true,
    showWatermark: true,
  };
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set) => ({
      invoice: createDefaultInvoice(),
      errors: {},
      setInvoice: (invoice) =>
        set({
          invoice: {
            ...(invoice || {}),
            id: invoice?.id || crypto.randomUUID(),
          },
        }),
      setErrors: (errors) => set({ errors }),
      clearErrors: (keys) =>
        set((state) => {
          if (!keys || keys.length === 0) return { errors: {} };
          const next = { ...state.errors };
          keys.forEach((k) => {
            delete next[k];
          });
          return { errors: next };
        }),
      updateInvoice: (updates) =>
        set((state) => {
          const { from, to, bankDetails, ...rest } = updates;
          const nextInvoice = { ...state.invoice, ...rest } as Partial<Invoice>;
          const nextErrors = { ...state.errors };

          if (!nextInvoice.id)
            nextInvoice.id = state.invoice.id || crypto.randomUUID();

          if (from) {
            nextInvoice.from = {
              ...state.invoice.from,
              ...from,
            } as Invoice["from"];
            if (Object.hasOwn(from, "businessName"))
              delete nextErrors["from.businessName"];
            if (Object.hasOwn(from, "email")) delete nextErrors["from.email"];
          }
          if (to) {
            nextInvoice.to = { ...state.invoice.to, ...to } as Invoice["to"];
            if (Object.hasOwn(to, "businessName"))
              delete nextErrors["to.businessName"];
          }
          if (bankDetails) {
            if (Object.hasOwn(updates, "paymentMode")) {
              nextInvoice.bankDetails = bankDetails as NonNullable<
                Invoice["bankDetails"]
              >;
            } else {
              nextInvoice.bankDetails = {
                ...(state.invoice.bankDetails || {}),
                ...bankDetails,
              } as NonNullable<Invoice["bankDetails"]>;
            }
          }
          if (Object.hasOwn(updates, "invoiceNumber"))
            delete nextErrors.invoiceNumber;
          if (Object.hasOwn(updates, "title")) delete nextErrors.title;
          if (Object.hasOwn(updates, "issueDate")) delete nextErrors.issueDate;
          if (Object.hasOwn(updates, "dueDate")) delete nextErrors.dueDate;
          if (Object.hasOwn(updates, "currency")) delete nextErrors.currency;
          if (Object.hasOwn(updates, "lineItems")) delete nextErrors.lineItems;

          const relevantKeys = [
            "lineItems",
            "discountType",
            "discountValue",
            "taxLines",
            "shippingFee",
            "partialPayments",
            "amountPaid",
          ];
          const needsRecalculation = relevantKeys.some((key) =>
            Object.hasOwn(updates, key),
          );

          if (needsRecalculation) {
            const totals = calculateInvoiceTotals({
              lineItems: nextInvoice.lineItems || [],
              discountType: nextInvoice.discountType || "percentage",
              discountValue: nextInvoice.discountValue || 0,
              taxLines: nextInvoice.taxLines || [],
              shippingFee: nextInvoice.shippingFee || 0,
              partialPayments: nextInvoice.partialPayments || [],
              amountPaid: nextInvoice.amountPaid || 0,
            });
            return {
              invoice: { ...nextInvoice, ...totals },
              errors: nextErrors,
            };
          }

          return { invoice: nextInvoice, errors: nextErrors };
        }),
      resetInvoice: () => set({ invoice: createDefaultInvoice(), errors: {} }),
    }),
    {
      name: "invoice-forge-active-invoice",
      partialize: (state) => ({ invoice: state.invoice }),
    },
  ),
);
