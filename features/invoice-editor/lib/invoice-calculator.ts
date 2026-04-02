import type { LineItem, PartialPayment, TaxLine } from "@/types/invoice.types";

export function calculateLineItemAmount(item: Partial<LineItem>): number {
  const qty = item.quantity || 0;
  const price = item.unitPrice || 0;
  const base = qty * price;

  const discountPercent = item.discountPercent || 0;
  const afterDiscount = base - base * (discountPercent / 100);

  const taxRate = item.taxRate || 0;
  const afterTax = afterDiscount + afterDiscount * (taxRate / 100);

  return afterTax;
}

export function calculateInvoiceTotals(params: {
  lineItems: Partial<LineItem>[];
  discountType: "percentage" | "fixed";
  discountValue: number;
  taxLines: Partial<TaxLine>[];
  shippingFee: number;
  partialPayments?: Partial<PartialPayment>[];
  amountPaid?: number;
}) {
  const subtotal = params.lineItems.reduce(
    (sum, item) => sum + calculateLineItemAmount(item),
    0,
  );

  let discountAmount = 0;
  if (params.discountType === "percentage") {
    discountAmount = subtotal * ((params.discountValue || 0) / 100);
  } else {
    discountAmount = params.discountValue || 0;
  }

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);

  const computedTaxLines: TaxLine[] = (params.taxLines || []).map((t) => ({
    id: t.id || "",
    name: t.name || "Tax",
    rate: t.rate || 0,
    amount: 0,
    compound: !!t.compound,
  }));

  const standardTaxes = computedTaxLines.filter((t) => !t.compound);
  const compoundTaxes = computedTaxLines.filter((t) => t.compound);

  let totalTaxAmount = 0;

  standardTaxes.forEach((tax) => {
    const amount = subtotalAfterDiscount * (tax.rate / 100);
    totalTaxAmount += amount;
    tax.amount = amount;
  });

  const baseForCompound = subtotalAfterDiscount + totalTaxAmount;
  compoundTaxes.forEach((tax) => {
    const amount = baseForCompound * (tax.rate / 100);
    totalTaxAmount += amount;
    tax.amount = amount;
  });

  const total =
    subtotalAfterDiscount + totalTaxAmount + (params.shippingFee || 0);

  const amountPaid =
    typeof params.amountPaid === "number"
      ? params.amountPaid
      : (params.partialPayments || []).reduce(
          (sum, p) => sum + (p.amount || 0),
          0,
        );
  const amountDue = Math.max(0, total - amountPaid);

  return {
    subtotal,
    discountAmount,
    taxLines: computedTaxLines,
    totalTaxAmount,
    total,
    amountPaid,
    amountDue,
  };
}
