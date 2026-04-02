export function generateInvoiceNumber(
  counter: number,
  prefix = "INV-",
): string {
  return `${prefix}${counter.toString().padStart(4, "0")}`;
}
