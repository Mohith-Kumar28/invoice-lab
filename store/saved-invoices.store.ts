import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Invoice } from '@/types/invoice.types';

interface SavedInvoicesState {
  invoices: Invoice[];
  saveInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  clearAllInvoices: () => void;
  getInvoice: (id: string) => Invoice | undefined;
  importInvoices: (invoices: Invoice[]) => void;
}

export const useSavedInvoicesStore = create<SavedInvoicesState>()(
  persist(
    (set, get) => ({
      invoices: [],
      saveInvoice: (invoice) => set((state) => {
        // Only save if we actually have some basic content to avoid saving totally empty default states repeatedly
        if (!invoice.invoiceNumber && !invoice.to?.businessName && (!invoice.lineItems || invoice.lineItems.length === 0)) {
          return state;
        }
        
        const existingIndex = state.invoices.findIndex(i => i.id === invoice.id);
        if (existingIndex >= 0) {
          const updated = [...state.invoices];
          updated[existingIndex] = { ...invoice, updatedAt: new Date() };
          return { invoices: updated };
        }
        return { invoices: [{ ...invoice, createdAt: new Date(), updatedAt: new Date() }, ...state.invoices] };
      }),
      deleteInvoice: (id) => set((state) => ({
        invoices: state.invoices.filter((i) => i.id !== id),
      })),
      clearAllInvoices: () => set({ invoices: [] }),
      getInvoice: (id) => get().invoices.find((i) => i.id === id),
      importInvoices: (newInvoices) => set((state) => {
        // Merge without duplicates based on ID
        const currentIds = new Set(state.invoices.map(i => i.id));
        const toAdd = newInvoices.filter(i => !currentIds.has(i.id));
        return { invoices: [...state.invoices, ...toAdd] };
      }),
    }),
    {
      name: 'invoice-forge-saved-invoices',
    }
  )
);
