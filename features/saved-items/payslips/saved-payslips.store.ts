import { createSavedItemsStore } from "@/features/saved-items/store/createSavedItemsStore";
import type { Payslip } from "@/types/payslip.types";

export const useSavedPayslipsStore = createSavedItemsStore<Payslip>({
  storageKey: "invoice-forge-saved-payslips",
  isEmpty: (p) =>
    !p.employer.companyName &&
    !p.employee.employeeName &&
    (!p.earnings || p.earnings.length === 0) &&
    (!p.deductions || p.deductions.length === 0),
  sanitize: (p) => {
    const next: Payslip = { ...p };
    next.employer = { ...p.employer, logo: undefined };
    next.pdfBrand = undefined;
    return next;
  },
  prepare: (p, existing) => {
    const now = new Date();
    if (existing)
      return { ...p, createdAt: existing.createdAt, updatedAt: now };
    return { ...p, createdAt: now, updatedAt: now };
  },
});
