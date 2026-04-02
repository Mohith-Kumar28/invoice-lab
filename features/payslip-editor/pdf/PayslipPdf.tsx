import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { PdfFooterBar } from "@/components/pdf/PdfFooterBar";
import { formatMoneyPdf } from "@/lib/format";
import { APP_NAME, SITE_URL } from "@/lib/site";
import type { Payslip, PayslipTemplateKey } from "@/types/payslip.types";

let registered = false;
function ensureFont() {
  if (registered) return;
  const origin = (() => {
    const g = globalThis as unknown as { location?: { origin?: unknown } };
    const o = g.location?.origin;
    return typeof o === "string" ? o : "";
  })();
  const regularSrc = origin
    ? `${origin}/fonts/NotoSans-Regular.ttf`
    : "/fonts/NotoSans-Regular.ttf";
  const boldSrc = origin
    ? `${origin}/fonts/NotoSans-Bold.ttf`
    : "/fonts/NotoSans-Bold.ttf";
  const italicSrc = origin
    ? `${origin}/fonts/NotoSans-Italic.ttf`
    : "/fonts/NotoSans-Italic.ttf";
  const boldItalicSrc = origin
    ? `${origin}/fonts/NotoSans-BoldItalic.ttf`
    : "/fonts/NotoSans-BoldItalic.ttf";
  Font.register({
    family: "NotoSans",
    fonts: [
      { src: regularSrc, fontWeight: 400 },
      { src: italicSrc, fontWeight: 400, fontStyle: "italic" },
      { src: boldSrc, fontWeight: 700 },
      { src: boldItalicSrc, fontWeight: 700, fontStyle: "italic" },
    ],
  });
  registered = true;
}

function monthLabel(m: number) {
  const map = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return map[m] || "";
}

function parseRgbString(input: string) {
  const m = input
    .trim()
    .match(
      /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*\.?\d+)\s*)?\)$/i,
    );
  if (!m) return null;
  const r = Number.parseInt(m[1], 10);
  const g = Number.parseInt(m[2], 10);
  const b = Number.parseInt(m[3], 10);
  if (![r, g, b].every((v) => Number.isFinite(v) && v >= 0 && v <= 255))
    return null;
  return { r, g, b };
}

function hexToRgb(hex: string) {
  const raw = hex.replace("#", "").trim();
  if (raw.length === 3) {
    const r = Number.parseInt(raw[0] + raw[0], 16);
    const g = Number.parseInt(raw[1] + raw[1], 16);
    const b = Number.parseInt(raw[2] + raw[2], 16);
    return { r, g, b };
  }
  if (raw.length === 6) {
    const r = Number.parseInt(raw.slice(0, 2), 16);
    const g = Number.parseInt(raw.slice(2, 4), 16);
    const b = Number.parseInt(raw.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

function colorToRgb(input: string) {
  const asRgb = parseRgbString(input);
  if (asRgb) return asRgb;
  if (input.trim().startsWith("#")) return hexToRgb(input);
  return null;
}

function isDark(color: string) {
  const rgb = colorToRgb(color);
  if (!rgb) return false;
  const lum = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  return lum < 0.55;
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lighten(color: string, amount: number) {
  const rgb = colorToRgb(color);
  if (!rgb) return "#F3F4F6";
  const a = Math.max(0, Math.min(1, amount));
  const r = Math.round(rgb.r + (255 - rgb.r) * a);
  const g = Math.round(rgb.g + (255 - rgb.g) * a);
  const b = Math.round(rgb.b + (255 - rgb.b) * a);
  return rgbToHex(r, g, b);
}

type PayslipTheme = {
  headerMode: "band" | "split" | "minimal";
  headerBg: string;
  headerFg: string;
  subtleBg: string;
  border: string;
  muted: string;
  tableHeaderBg: string;
  tableHeaderFg: string;
  zebra: boolean;
  boxed: boolean;
  netBadge: boolean;
};

function getPayslipTheme(
  variant: PayslipTemplateKey,
  primary: string,
): PayslipTheme {
  const dark = isDark(primary);
  const headerFg = dark ? "#FFFFFF" : "#111827";
  const muted = "#6B7280";
  const border = "#E5E7EB";

  if (variant === "bold") {
    const fg = "#FFFFFF";
    return {
      headerMode: "band",
      headerBg: primary,
      headerFg: fg,
      subtleBg: lighten(primary, 0.9),
      border: "#111827",
      muted: "#F3F4F6",
      tableHeaderBg: "#111827",
      tableHeaderFg: "#FFFFFF",
      zebra: true,
      boxed: false,
      netBadge: true,
    };
  }

  if (variant === "classic") {
    return {
      headerMode: "split",
      headerBg: "#FFFFFF",
      headerFg: "#111827",
      subtleBg: lighten(primary, 0.92),
      border,
      muted,
      tableHeaderBg: "#F3F4F6",
      tableHeaderFg: "#111827",
      zebra: false,
      boxed: true,
      netBadge: true,
    };
  }

  if (variant === "minimal") {
    return {
      headerMode: "minimal",
      headerBg: "#FFFFFF",
      headerFg: "#111827",
      subtleBg: "#FFFFFF",
      border: "#E5E7EB",
      muted: "#6B7280",
      tableHeaderBg: "#FFFFFF",
      tableHeaderFg: "#111827",
      zebra: false,
      boxed: false,
      netBadge: false,
    };
  }

  return {
    headerMode: "band",
    headerBg: primary,
    headerFg,
    subtleBg: lighten(primary, 0.94),
    border,
    muted,
    tableHeaderBg: primary,
    tableHeaderFg: headerFg,
    zebra: false,
    boxed: true,
    netBadge: true,
  };
}

export function PayslipPdf({ payslip }: { payslip: Payslip }) {
  ensureFont();
  const primaryCandidate =
    payslip.colorTheme || payslip.pdfBrand?.primary || "#0038e0";
  const primary = colorToRgb(primaryCandidate) ? primaryCandidate : "#0038e0";
  const variant = (payslip.template || "modern") as PayslipTemplateKey;
  const t = getPayslipTheme(variant, primary);

  const earnings = payslip.earnings || [];
  const deductions = payslip.deductions || [];
  const rows = Math.max(earnings.length, deductions.length);
  const paddedEarnings = [
    ...earnings,
    ...Array.from({ length: Math.max(0, rows - earnings.length) }).map(
      (_, n) => ({
        id: `e-empty-${n + earnings.length}`,
        name: "",
        amount: 0,
      }),
    ),
  ];
  const paddedDeductions = [
    ...deductions,
    ...Array.from({ length: Math.max(0, rows - deductions.length) }).map(
      (_, n) => ({
        id: `d-empty-${n + deductions.length}`,
        name: "",
        amount: 0,
      }),
    ),
  ];
  const tableRows = paddedEarnings.map((e, idx) => {
    const d = paddedDeductions[idx];
    return { id: `${e.id}-${d.id}`, e, d };
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {t.headerMode === "band" && payslip.showRibbon ? (
          <View style={[styles.headerBand, { backgroundColor: t.headerBg }]}>
            <View style={styles.headerBandTop}>
              <View style={styles.headerLeft}>
                {payslip.showLogo && payslip.employer.logo ? (
                  <Image src={payslip.employer.logo} style={styles.logo} />
                ) : null}
                <View style={{ flex: 1 }}>
                  <Text style={[styles.companyName, { color: t.headerFg }]}>
                    {payslip.employer.companyName || "Company"}
                  </Text>
                  {payslip.employer.companyAddress ? (
                    <Text
                      style={[
                        styles.companyAddress,
                        { color: isDark(primary) ? "#E5E7EB" : "#374151" },
                      ]}
                    >
                      {payslip.employer.companyAddress}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.headerRight}>
                <Text style={[styles.title, { color: t.headerFg }]}>
                  PAYSLIP
                </Text>
                <Text
                  style={[
                    styles.period,
                    { color: isDark(primary) ? "#E5E7EB" : "#374151" },
                  ]}
                >
                  {monthLabel(payslip.payPeriod.month)} {payslip.payPeriod.year}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={[styles.header, { borderBottomColor: t.border }]}>
            <View style={styles.headerLeft}>
              {payslip.showLogo && payslip.employer.logo ? (
                <Image src={payslip.employer.logo} style={styles.logo} />
              ) : null}
              <View style={{ flex: 1 }}>
                <Text style={[styles.companyName, { color: t.headerFg }]}>
                  {payslip.employer.companyName || "Company"}
                </Text>
                {payslip.employer.companyAddress ? (
                  <Text style={[styles.companyAddress, { color: t.muted }]}>
                    {payslip.employer.companyAddress}
                  </Text>
                ) : null}
              </View>
            </View>
            <View style={styles.headerRight}>
              <Text style={[styles.title, { color: primary }]}>PAYSLIP</Text>
              <Text style={[styles.period, { color: t.muted }]}>
                {monthLabel(payslip.payPeriod.month)} {payslip.payPeriod.year}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.twoCol}>
            <View
              style={[
                styles.col,
                t.boxed
                  ? { borderColor: t.border, borderWidth: 1 }
                  : { borderWidth: 0, padding: 0 },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: "#111827" }]}>
                Employee
              </Text>
              <View style={styles.kvRow}>
                <Text style={[styles.k, { color: t.muted }]}>Name</Text>
                <Text style={styles.v}>
                  {payslip.employee.employeeName || ""}
                </Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={[styles.k, { color: t.muted }]}>Code</Text>
                <Text style={styles.v}>
                  {payslip.employee.employeeCode || ""}
                </Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={[styles.k, { color: t.muted }]}>UAN</Text>
                <Text style={styles.v}>{payslip.employee.uan || ""}</Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={[styles.k, { color: t.muted }]}>PAN</Text>
                <Text style={styles.v}>{payslip.employee.panNumber || ""}</Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={[styles.k, { color: t.muted }]}>Department</Text>
                <Text style={styles.v}>
                  {payslip.employee.department || ""}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.col,
                t.boxed
                  ? { borderColor: t.border, borderWidth: 1 }
                  : { borderWidth: 0, padding: 0 },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: "#111827" }]}>
                Pay &amp; Bank
              </Text>
              <View style={styles.kvRow}>
                <Text style={[styles.k, { color: t.muted }]}>Payable Days</Text>
                <Text style={styles.v}>
                  {String(payslip.payPeriod.payableDays || 0)}
                </Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={[styles.k, { color: t.muted }]}>
                  Leave Balance
                </Text>
                <Text style={styles.v}>
                  {String(payslip.payPeriod.leaveBalance || 0)}
                </Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={[styles.k, { color: t.muted }]}>LOP Days</Text>
                <Text style={styles.v}>
                  {String(payslip.payPeriod.lopDays || 0)}
                </Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={[styles.k, { color: t.muted }]}>Bank</Text>
                <Text style={styles.v}>{payslip.employee.bankName || ""}</Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={[styles.k, { color: t.muted }]}>A/C No.</Text>
                <Text style={styles.v}>
                  {payslip.employee.bankAccountNumber || ""}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: "#111827" }]}>
            Earnings &amp; Deductions
          </Text>
          <View
            style={[styles.table, { borderColor: t.border, borderWidth: 1 }]}
          >
            <View
              style={[styles.tableHeader, { backgroundColor: t.tableHeaderBg }]}
            >
              <Text style={[styles.thName, { color: t.tableHeaderFg }]}>
                EARNINGS
              </Text>
              <Text style={[styles.thAmount, { color: t.tableHeaderFg }]}>
                AMOUNT
              </Text>
              <Text style={[styles.thName2, { color: t.tableHeaderFg }]}>
                DEDUCTIONS
              </Text>
              <Text style={[styles.thAmount, { color: t.tableHeaderFg }]}>
                AMOUNT
              </Text>
            </View>

            {tableRows.map((r, idx) => (
              <View
                key={r.id}
                style={
                  t.zebra && idx % 2 === 1
                    ? [
                        styles.tableRow,
                        { borderTopColor: t.border },
                        { backgroundColor: t.subtleBg },
                      ]
                    : [styles.tableRow, { borderTopColor: t.border }]
                }
              >
                <Text style={styles.tdName}>{r.e.name}</Text>
                <Text style={styles.tdAmount}>
                  {r.e.name ? formatMoneyPdf(r.e.amount || 0, "INR") : ""}
                </Text>
                <Text style={styles.tdName2}>{r.d.name}</Text>
                <Text style={styles.tdAmount}>
                  {r.d.name ? formatMoneyPdf(r.d.amount || 0, "INR") : ""}
                </Text>
              </View>
            ))}

            <View
              style={[
                styles.tableTotals,
                { borderTopColor: t.border, backgroundColor: t.subtleBg },
              ]}
            >
              <Text style={styles.tdName}>Gross Pay</Text>
              <Text style={styles.tdAmount}>
                {formatMoneyPdf(payslip.grossPay || 0, "INR")}
              </Text>
              <Text style={styles.tdName2}>Total Deductions</Text>
              <Text style={styles.tdAmount}>
                {formatMoneyPdf(payslip.totalDeductions || 0, "INR")}
              </Text>
            </View>
          </View>

          {t.netBadge ? (
            <View style={styles.netBadgeRow}>
              <View
                style={[
                  styles.netBadge,
                  { backgroundColor: t.subtleBg, borderColor: t.border },
                ]}
              >
                <Text style={[styles.netLabel, { color: t.muted }]}>
                  NET PAY
                </Text>
                <Text style={[styles.netValue, { color: primary }]}>
                  {formatMoneyPdf(payslip.netPay || 0, "INR")}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.netBox}>
              <Text style={[styles.netLabel, { color: t.muted }]}>NET PAY</Text>
              <Text style={[styles.netValue, { color: primary }]}>
                {formatMoneyPdf(payslip.netPay || 0, "INR")}
              </Text>
            </View>
          )}
        </View>

        <PdfFooterBar
          showFooter={!!payslip.showFooter}
          leftText={payslip.employer.companyName || "Thank you."}
          showPageNumbers={!!payslip.showPageNumbers}
          showWatermark={!!payslip.showWatermark}
          watermarkHref={SITE_URL}
          watermarkText={`Powered by ${APP_NAME}`}
          textColor={t.muted}
          linkColor={t.muted}
        />
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: "NotoSans",
    fontSize: 11,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  headerBand: {
    borderRadius: 10,
    padding: 16,
  },
  headerBandTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  logo: {
    width: 42,
    height: 42,
    objectFit: "contain",
  },
  logoPlaceholder: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
  },
  companyName: {
    fontSize: 14,
    fontWeight: 700,
  },
  companyAddress: {
    fontSize: 10,
    marginTop: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 1,
  },
  period: {
    fontSize: 10,
    marginTop: 2,
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 10,
  },
  twoCol: {
    flexDirection: "row",
    gap: 18,
  },
  col: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  kvRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    gap: 10,
  },
  k: {
    fontSize: 10,
    width: "45%",
  },
  v: {
    fontSize: 10,
    width: "55%",
    textAlign: "right",
  },
  table: {
    borderWidth: 1,
    borderStyle: "solid",
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  thName: {
    fontSize: 10,
    fontWeight: 700,
    width: "34%",
    letterSpacing: 0.6,
  },
  thName2: {
    fontSize: 10,
    fontWeight: 700,
    width: "34%",
    letterSpacing: 0.6,
    paddingLeft: 10,
  },
  thAmount: {
    fontSize: 10,
    fontWeight: 700,
    width: "16%",
    textAlign: "right",
    letterSpacing: 0.6,
    paddingRight: 2,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderTopWidth: 1,
  },
  tableTotals: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    backgroundColor: "#F9FAFB",
  },
  tdName: {
    width: "34%",
    fontSize: 10,
  },
  tdName2: {
    width: "34%",
    fontSize: 10,
    paddingLeft: 10,
  },
  tdAmount: {
    width: "16%",
    fontSize: 10,
    textAlign: "right",
    paddingRight: 2,
  },
  netBadgeRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  netBadge: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 180,
    alignItems: "flex-end",
  },
  netBox: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  netLabel: {
    fontSize: 10,
  },
  netValue: {
    fontSize: 16,
    fontWeight: 700,
    marginTop: 2,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 32,
    right: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 9,
  },
});
