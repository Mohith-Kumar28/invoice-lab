import type { Payslip, PayslipLine, TaxRegime } from "@/types/payslip.types";

export function sumLines(lines: PayslipLine[] | undefined) {
  return (lines || []).reduce(
    (acc, l) => acc + (Number.isFinite(l.amount) ? l.amount : 0),
    0,
  );
}

type Slab = { upto: number; rate: number };

function annualTaxBySlabs(income: number, slabs: Slab[]) {
  let remaining = Math.max(0, income);
  let last = 0;
  let tax = 0;

  for (const slab of slabs) {
    const cap = slab.upto;
    const span = Math.max(0, Math.min(remaining, cap - last));
    tax += span * slab.rate;
    remaining -= span;
    last = cap;
    if (remaining <= 0) break;
  }

  if (remaining > 0) {
    const topRate = slabs.length ? slabs[slabs.length - 1].rate : 0;
    tax += remaining * topRate;
  }

  return tax;
}

export function computeAnnualIncomeTaxIndia(
  incomeAnnual: number,
  regime: TaxRegime,
) {
  const income = Math.max(0, incomeAnnual);

  if (regime === "new") {
    const slabs: Slab[] = [
      { upto: 300_000, rate: 0 },
      { upto: 600_000, rate: 0.05 },
      { upto: 900_000, rate: 0.1 },
      { upto: 1_200_000, rate: 0.15 },
      { upto: 1_500_000, rate: 0.2 },
      { upto: Number.POSITIVE_INFINITY, rate: 0.3 },
    ];
    const base = annualTaxBySlabs(income, slabs);
    const rebate = income <= 700_000 ? base : 0;
    const afterRebate = Math.max(0, base - rebate);
    const cess = afterRebate * 0.04;
    return afterRebate + cess;
  }

  const slabs: Slab[] = [
    { upto: 250_000, rate: 0 },
    { upto: 500_000, rate: 0.05 },
    { upto: 1_000_000, rate: 0.2 },
    { upto: Number.POSITIVE_INFINITY, rate: 0.3 },
  ];
  const base = annualTaxBySlabs(income, slabs);
  const rebate = income <= 500_000 ? base : 0;
  const afterRebate = Math.max(0, base - rebate);
  const cess = afterRebate * 0.04;
  return afterRebate + cess;
}

export function findIncomeTaxLine(deductions: PayslipLine[] | undefined) {
  return (deductions || []).find(
    (d) => d.isAuto && d.name.toLowerCase().includes("tax"),
  );
}

export function recomputePayslipTotals(p: Payslip) {
  const grossPay = sumLines(p.earnings);
  const totalDeductions = sumLines(p.deductions);
  const netPay = grossPay - totalDeductions;
  return { grossPay, totalDeductions, netPay };
}

export function applyAutoTax(p: Payslip) {
  const grossPay = sumLines(p.earnings);
  const autoTax = findIncomeTaxLine(p.deductions);
  if (!autoTax) return p;

  const annualIncome = grossPay * 12;
  const annualTax = computeAnnualIncomeTaxIndia(annualIncome, p.taxRegime);
  const monthly = Number.isFinite(annualTax) ? Math.max(0, annualTax / 12) : 0;
  const nextDeductions = (p.deductions || []).map((d) =>
    d.id === autoTax.id ? { ...d, amount: Math.round(monthly) } : d,
  );

  const next = { ...p, deductions: nextDeductions };
  return { ...next, ...recomputePayslipTotals(next) };
}
