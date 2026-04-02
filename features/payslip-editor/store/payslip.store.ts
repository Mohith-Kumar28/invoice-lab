import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  applyAutoTax,
  recomputePayslipTotals,
} from "@/features/payslip-editor/lib/payslip-calculator";
import type { Payslip } from "@/types/payslip.types";

type PayslipUpdate = Partial<
  Omit<Payslip, "employer" | "employee" | "payPeriod">
> & {
  employer?: Partial<Payslip["employer"]>;
  employee?: Partial<Payslip["employee"]>;
  payPeriod?: Partial<Payslip["payPeriod"]>;
};

interface PayslipState {
  payslip: Payslip;
  errors: Record<string, string>;
  setPayslip: (payslip: Payslip) => void;
  updatePayslip: (updates: PayslipUpdate) => void;
  resetPayslip: () => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: (keys?: string[]) => void;
}

function normalizePayslip(p: Payslip): Payslip {
  return {
    ...p,
    template: p.template || "modern",
    colorTheme: p.colorTheme || "#0038e0",
    showLogo: p.showLogo ?? true,
    showRibbon: p.showRibbon ?? true,
    showFooter: p.showFooter ?? true,
    showPageNumbers: p.showPageNumbers ?? true,
    showWatermark: p.showWatermark ?? false,
  };
}

function createDefaultPayslip(): Payslip {
  const base: Payslip = {
    id: crypto.randomUUID(),
    employer: {
      companyName: "",
      companyAddress: "",
      logo: undefined,
    },
    employee: {
      employeeName: "",
      employeeCode: "",
      uan: "",
      dateOfJoining: undefined,
      panNumber: "",
      department: "",
      bankName: "",
      bankAccountNumber: "",
    },
    payPeriod: {
      month: 4,
      year: 2026,
      payableDays: 0,
      leaveBalance: 0,
      lopDays: 0,
    },
    taxRegime: "new",
    earnings: [
      { id: crypto.randomUUID(), name: "Basic", amount: 0 },
      { id: crypto.randomUUID(), name: "HRA", amount: 0 },
    ],
    deductions: [
      { id: crypto.randomUUID(), name: "PF", amount: 0 },
      { id: crypto.randomUUID(), name: "Income Tax", amount: 0, isAuto: true },
    ],
    grossPay: 0,
    totalDeductions: 0,
    netPay: 0,
    template: "modern",
    colorTheme: "#0038e0",
    showLogo: true,
    showRibbon: true,
    showFooter: true,
    showPageNumbers: true,
    showWatermark: false,
    pdfFileName: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return applyAutoTax({ ...base, ...recomputePayslipTotals(base) });
}

export const usePayslipStore = create<PayslipState>()(
  persist(
    (set) => ({
      payslip: createDefaultPayslip(),
      errors: {},
      setPayslip: (payslip) =>
        set({
          payslip: applyAutoTax({
            ...normalizePayslip(payslip),
            ...recomputePayslipTotals(payslip),
          }),
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
      updatePayslip: (updates) =>
        set((state) => {
          const { employer, employee, payPeriod, ...rest } = updates;
          const nextPayslip: Payslip = normalizePayslip({
            ...(state.payslip as Payslip),
            ...(rest as Payslip),
          });
          const nextErrors = { ...state.errors };

          if (!nextPayslip.id)
            nextPayslip.id = state.payslip.id || crypto.randomUUID();

          if (employer)
            nextPayslip.employer = { ...state.payslip.employer, ...employer };
          if (employee)
            nextPayslip.employee = { ...state.payslip.employee, ...employee };
          if (payPeriod)
            nextPayslip.payPeriod = {
              ...state.payslip.payPeriod,
              ...payPeriod,
            };

          if (Object.hasOwn(updates, "taxRegime")) delete nextErrors.taxRegime;
          if (employer && Object.hasOwn(employer, "companyName"))
            delete nextErrors["employer.companyName"];
          if (employee && Object.hasOwn(employee, "employeeName"))
            delete nextErrors["employee.employeeName"];

          const needsTotals =
            Object.hasOwn(updates, "earnings") ||
            Object.hasOwn(updates, "deductions") ||
            Object.hasOwn(updates, "taxRegime");
          const needsAutoTax =
            Object.hasOwn(updates, "earnings") ||
            Object.hasOwn(updates, "taxRegime");

          const baseTotals = needsTotals
            ? { ...nextPayslip, ...recomputePayslipTotals(nextPayslip) }
            : nextPayslip;
          const withTotals = normalizePayslip(baseTotals);
          const withAutoTax = needsAutoTax
            ? applyAutoTax(withTotals)
            : withTotals;
          return {
            payslip: { ...withAutoTax, updatedAt: new Date() },
            errors: nextErrors,
          };
        }),
      resetPayslip: () => set({ payslip: createDefaultPayslip(), errors: {} }),
    }),
    {
      name: "invoice-forge-active-payslip",
      partialize: (state) => ({ payslip: state.payslip }),
    },
  ),
);
