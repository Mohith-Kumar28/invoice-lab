import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Invoice } from '@/types/invoice.types';
import { calculateInvoiceTotals } from '@/lib/invoice-calculator';

interface InvoiceState {
  invoice: Partial<Invoice>;
  errors: Record<string, string>;
  setInvoice: (invoice: Partial<Invoice>) => void;
  updateInvoice: (updates: Partial<Invoice>) => void;
  resetInvoice: () => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: (keys?: string[]) => void;
}

function createDefaultInvoice(): Partial<Invoice> {
  const issueDate = new Date();
  const dueDate = new Date(new Date(issueDate).setDate(issueDate.getDate() + 3));

  return {
    id: crypto.randomUUID(),
    // Section 1: Invoice Details
    invoiceNumber: 'INV-0001',
    title: 'INVOICE',
    status: undefined,
    currency: 'INR',
    issueDate,
    dueDate,

    // Section 2: From
    from: {
      businessName: '',
      email: '',
      address: { line1: '', city: '', country: '' },
    },

    // Section 3: To
    to: {
      businessName: '',
      address: { line1: '', city: '', country: '' },
    },

    // Section 4 & 5: Items & Pricing
    lineItems: [],
    subtotal: 0,
    discountType: 'percentage',
    discountValue: 0,
    discountAmount: 0,
    taxLines: [],
    shippingFee: 0,
    total: 0,
    amountPaid: 0,
    amountDue: 0,

    // Section 6: Payment
    paymentTerms: undefined,
    paymentMethods: [],
    paymentMode: 'upi',
    bankDetails: {},

    deliverables: "",

    // Section 8: Signature
    showSignature: false,

    // Section 9: Design
    template: 'modern',
    colorTheme: '#0038e0',
    fontPairing: 'modern',
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
      updateInvoice: (updates) => set((state) => {
        const nextInvoice = { ...state.invoice, ...updates };
        const nextErrors = { ...state.errors };

        if (!nextInvoice.id) nextInvoice.id = state.invoice.id || crypto.randomUUID();
        
        // Ensure deep updates for nested objects like `from` and `to`
        if (updates.from) {
          nextInvoice.from = { ...state.invoice.from, ...updates.from } as any;
          if (Object.prototype.hasOwnProperty.call(updates.from, "businessName")) delete nextErrors["from.businessName"];
          if (Object.prototype.hasOwnProperty.call(updates.from, "email")) delete nextErrors["from.email"];
        }
        if (updates.to) {
          nextInvoice.to = { ...state.invoice.to, ...updates.to } as any;
          if (Object.prototype.hasOwnProperty.call(updates.to, "businessName")) delete nextErrors["to.businessName"];
        }
        if (updates.bankDetails) {
          if (Object.prototype.hasOwnProperty.call(updates, "paymentMode")) {
            nextInvoice.bankDetails = updates.bankDetails as any;
          } else {
            nextInvoice.bankDetails = { ...(state.invoice.bankDetails || {}), ...updates.bankDetails } as any;
          }
        }
        if (Object.prototype.hasOwnProperty.call(updates, "invoiceNumber")) delete nextErrors["invoiceNumber"];
        if (Object.prototype.hasOwnProperty.call(updates, "title")) delete nextErrors["title"];
        if (Object.prototype.hasOwnProperty.call(updates, "issueDate")) delete nextErrors["issueDate"];
        if (Object.prototype.hasOwnProperty.call(updates, "dueDate")) delete nextErrors["dueDate"];
        if (Object.prototype.hasOwnProperty.call(updates, "currency")) delete nextErrors["currency"];
        if (Object.prototype.hasOwnProperty.call(updates, "lineItems")) delete nextErrors["lineItems"];
        
        // Recalculate totals if any relevant field changed
        const relevantKeys = ['lineItems', 'discountType', 'discountValue', 'taxLines', 'shippingFee', 'partialPayments', 'amountPaid'];
        const needsRecalculation = relevantKeys.some(key => Object.prototype.hasOwnProperty.call(updates, key));

        if (needsRecalculation) {
          const totals = calculateInvoiceTotals({
            lineItems: nextInvoice.lineItems || [],
            discountType: nextInvoice.discountType || 'percentage',
            discountValue: nextInvoice.discountValue || 0,
            taxLines: nextInvoice.taxLines || [],
            shippingFee: nextInvoice.shippingFee || 0,
            partialPayments: nextInvoice.partialPayments || [],
            amountPaid: nextInvoice.amountPaid || 0,
          });
          return { invoice: { ...nextInvoice, ...totals }, errors: nextErrors };
        }

        return { invoice: nextInvoice, errors: nextErrors };
      }),
      resetInvoice: () => set({ invoice: createDefaultInvoice(), errors: {} }),
    }),
    {
      name: 'invoice-forge-active-invoice',
      partialize: (state) => ({ invoice: state.invoice }),
    }
  )
);
