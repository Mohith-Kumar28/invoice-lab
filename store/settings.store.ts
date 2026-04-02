import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Invoice } from "@/types/invoice.types";

interface SettingsState {
  defaultFrom: Partial<Invoice["from"]>;
  setDefaultFrom: (from: Partial<Invoice["from"]>) => void;
  defaultTemplate: string;
  setDefaultTemplate: (template: string) => void;
  defaultColorTheme: string;
  setDefaultColorTheme: (colorTheme: string) => void;
  defaultCurrency: string;
  setDefaultCurrency: (currency: string) => void;
  invoiceNumberCounter: number;
  incrementInvoiceNumber: () => void;
  setInvoiceNumberCounter: (counter: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      defaultFrom: {},
      setDefaultFrom: (from) => set({ defaultFrom: from }),
      defaultTemplate: "modern",
      setDefaultTemplate: (template) => set({ defaultTemplate: template }),
      defaultColorTheme: "blue",
      setDefaultColorTheme: (colorTheme) =>
        set({ defaultColorTheme: colorTheme }),
      defaultCurrency: "USD",
      setDefaultCurrency: (currency) => set({ defaultCurrency: currency }),
      invoiceNumberCounter: 1,
      incrementInvoiceNumber: () =>
        set((state) => ({
          invoiceNumberCounter: state.invoiceNumberCounter + 1,
        })),
      setInvoiceNumberCounter: (counter) =>
        set({ invoiceNumberCounter: counter }),
    }),
    {
      name: "invoice-forge-settings",
    },
  ),
);
