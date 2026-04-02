import { describe, expect, it } from "vitest";
import {
  calculateInvoiceTotals,
  calculateLineItemAmount,
} from "@/features/invoice-editor/lib/invoice-calculator";

describe("calculateLineItemAmount", () => {
  it("calculates correct base amount", () => {
    expect(calculateLineItemAmount({ quantity: 2, unitPrice: 50 })).toBe(100);
  });

  it("applies discount correctly", () => {
    expect(
      calculateLineItemAmount({
        quantity: 2,
        unitPrice: 50,
        discountPercent: 10,
      }),
    ).toBe(90);
  });

  it("applies tax correctly", () => {
    expect(
      calculateLineItemAmount({ quantity: 2, unitPrice: 50, taxRate: 10 }),
    ).toBe(110);
  });
});

describe("calculateInvoiceTotals", () => {
  it("calculates correct totals", () => {
    const result = calculateInvoiceTotals({
      lineItems: [
        { quantity: 1, unitPrice: 100 },
        { quantity: 2, unitPrice: 50 },
      ],
      discountType: "percentage",
      discountValue: 10,
      taxLines: [{ rate: 10, compound: false }],
      shippingFee: 20,
    });

    expect(result.subtotal).toBe(200);
    expect(result.discountAmount).toBe(20);
    expect(result.totalTaxAmount).toBe(18); // 10% of 180
    expect(result.total).toBe(218); // 180 + 18 + 20
  });
});
