export function formatNumber(value: number | undefined, locale?: string) {
  const v = typeof value === "number" && Number.isFinite(value) ? value : 0;
  try {
    return new Intl.NumberFormat(locale).format(v);
  } catch {
    return String(v);
  }
}

export function formatDecimal(
  value: number | undefined,
  locale?: string,
  opts?: { minFractionDigits?: number; maxFractionDigits?: number },
) {
  const v = typeof value === "number" && Number.isFinite(value) ? value : 0;
  const minFractionDigits = opts?.minFractionDigits ?? 2;
  const maxFractionDigits = opts?.maxFractionDigits ?? 2;
  try {
    return new Intl.NumberFormat(locale, {
      style: "decimal",
      minimumFractionDigits: minFractionDigits,
      maximumFractionDigits: maxFractionDigits,
    }).format(v);
  } catch {
    return v.toFixed(maxFractionDigits);
  }
}

export function formatMoney(
  value: number | undefined,
  currency: string | undefined,
  locale?: string,
  opts?: { minFractionDigits?: number; maxFractionDigits?: number },
) {
  const v = typeof value === "number" && Number.isFinite(value) ? value : 0;
  const c = (currency || "").trim().toUpperCase();
  const minFractionDigits = opts?.minFractionDigits ?? 2;
  const maxFractionDigits = opts?.maxFractionDigits ?? 2;
  if (!c) return formatNumber(v, locale);
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: c,
      currencyDisplay: "symbol",
      minimumFractionDigits: minFractionDigits,
      maximumFractionDigits: maxFractionDigits,
    }).format(v);
  } catch {
    return `${c} ${v.toFixed(maxFractionDigits)}`;
  }
}

export function formatMoneyPdf(
  value: number | undefined,
  currency: string | undefined,
  locale?: string,
  opts?: { minFractionDigits?: number; maxFractionDigits?: number },
) {
  const v = typeof value === "number" && Number.isFinite(value) ? value : 0;
  const c = (currency || "").trim().toUpperCase();
  const minFractionDigits = opts?.minFractionDigits ?? 2;
  const maxFractionDigits = opts?.maxFractionDigits ?? 2;

  const safeSymbol = (() => {
    if (!c) return "";
    if (c === "EUR") return "€";
    if (c === "GBP") return "£";
    if (c === "JPY" || c === "CNY") return "¥";

    if (c === "USD") return "$";
    if (c === "AUD") return "A$";
    if (c === "CAD") return "C$";
    if (c === "NZD") return "NZ$";
    if (c === "SGD") return "S$";
    if (c === "HKD") return "HK$";
    if (c === "CHF") return "CHF";
    if (c === "SEK" || c === "NOK" || c === "DKK") return "kr";
    if (c === "MXN") return "MX$";
    if (c === "PHP") return "PHP";
    if (c === "IDR") return "Rp";
    if (c === "MYR") return "RM";
    if (c === "PLN") return "PLN";
    if (c === "TRY") return "TRY";
    if (c === "THB") return "THB";
    if (c === "ILS") return "ILS";
    if (c === "ZAR") return "ZAR";
    if (c === "NGN") return "NGN";
    if (c === "INR") return "₹";
    if (c === "AED") return "AED";
    if (c === "QAR") return "QAR";
    if (c === "SAR") return "SAR";

    return c;
  })();

  const num = formatDecimal(v, locale, {
    minFractionDigits,
    maxFractionDigits,
  });
  return safeSymbol ? `${safeSymbol} ${num}` : num;
}
