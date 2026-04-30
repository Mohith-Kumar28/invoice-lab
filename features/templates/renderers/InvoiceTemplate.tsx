import {
  Document,
  Font,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { formatMoneyPdf, formatNumber } from "@/lib/format";
import { APP_NAME, SITE_URL } from "@/lib/site";
import type { Invoice } from "@/types/invoice.types";
import type { TemplateKey } from "./index";

type Variant = TemplateKey;

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
      {
        src: regularSrc,
        fontWeight: 400,
      },
      {
        src: italicSrc,
        fontWeight: 400,
        fontStyle: "italic",
      },
      {
        src: boldSrc,
        fontWeight: 700,
      },
      {
        src: boldItalicSrc,
        fontWeight: 700,
        fontStyle: "italic",
      },
    ],
  });
  Font.registerHyphenationCallback((word) => [word]);
  registered = true;
}

type StyleTokens = {
  headerMode: "band" | "plain";
  pageBg: string;
  headerBg: string;
  headerFg: string;
  headerLabel: string;
  bodyText: string;
  mutedText: string;
  divider: string;
  tableHeaderText: string;
  tableRowDivider: string;
  totalsBorder: string;
  footerText: string;
  watermarkText: string;
};

function getTokens(variant: Variant, themeColor: string): StyleTokens {
  switch (variant) {
    case "classic":
    case "corporate":
      return {
        headerMode: "plain",
        pageBg: "#FFFFFF",
        headerBg: "#FFFFFF",
        headerFg: themeColor,
        headerLabel: "#666666",
        bodyText: "#111827",
        mutedText: "#6B7280",
        divider: "#E5E7EB",
        tableHeaderText: themeColor,
        tableRowDivider: "#EEEEEE",
        totalsBorder: themeColor,
        footerText: "#6B7280",
        watermarkText: "#9CA3AF",
      };
    case "minimal":
      return {
        headerMode: "plain",
        pageBg: "#FFFFFF",
        headerBg: "#FFFFFF",
        headerFg: "#111827",
        headerLabel: "#6B7280",
        bodyText: "#111827",
        mutedText: "#6B7280",
        divider: "#E5E7EB",
        tableHeaderText: "#111827",
        tableRowDivider: "#E5E7EB",
        totalsBorder: "#111827",
        footerText: "#6B7280",
        watermarkText: "#9CA3AF",
      };
    case "bold":
      return {
        headerMode: "band",
        pageBg: "#FFFFFF",
        headerBg: themeColor,
        headerFg: "#FFFFFF",
        headerLabel: "rgba(255,255,255,0.7)",
        bodyText: "#111827",
        mutedText: "#6B7280",
        divider: "#E5E7EB",
        tableHeaderText: themeColor,
        tableRowDivider: "#E5E7EB",
        totalsBorder: themeColor,
        footerText: "#6B7280",
        watermarkText: "#9CA3AF",
      };
    case "creative":
      return {
        headerMode: "band",
        pageBg: "#FFFFFF",
        headerBg: themeColor,
        headerFg: "#FFFFFF",
        headerLabel: "rgba(255,255,255,0.7)",
        bodyText: "#0F172A",
        mutedText: "#64748B",
        divider: "#E2E8F0",
        tableHeaderText: "#0F172A",
        tableRowDivider: "#E2E8F0",
        totalsBorder: "#E2E8F0",
        footerText: "#64748B",
        watermarkText: "#94A3B8",
      };
    case "freelancer":
      return {
        headerMode: "band",
        pageBg: "#FFFFFF",
        headerBg: themeColor,
        headerFg: "#FFFFFF",
        headerLabel: "rgba(255,255,255,0.7)",
        bodyText: "#111827",
        mutedText: "#6B7280",
        divider: "#E5E7EB",
        tableHeaderText: "#111827",
        tableRowDivider: "#E5E7EB",
        totalsBorder: "#E5E7EB",
        footerText: "#6B7280",
        watermarkText: "#9CA3AF",
      };
    default:
      return {
        headerMode: "band",
        pageBg: "#FFFFFF",
        headerBg: themeColor,
        headerFg: "#FFFFFF",
        headerLabel: "rgba(255,255,255,0.7)",
        bodyText: "#111827",
        mutedText: "#6B7280",
        divider: "#E5E7EB",
        tableHeaderText: "#374151",
        tableRowDivider: "#E5E7EB",
        totalsBorder: "#E5E7EB",
        footerText: "#6B7280",
        watermarkText: "#9CA3AF",
      };
  }
}

function addressLine(a?: Partial<Invoice["from"]["address"]>) {
  if (!a) return "";
  const parts = [a.city, a.state, a.postalCode].filter(Boolean);
  const cityLine = parts.join(", ");
  if (cityLine && a.country) return `${cityLine} • ${a.country}`;
  return cityLine || a.country || "";
}

function statusPill(status?: string) {
  if (!status) return { bg: "#E5E7EB", fg: "#111827" };
  if (status === "paid") return { bg: "#DCFCE7", fg: "#166534" };
  if (status === "sent") return { bg: "#DBEAFE", fg: "#1D4ED8" };
  if (status === "partial") return { bg: "#FEF3C7", fg: "#92400E" };
  if (status === "overdue") return { bg: "#FEE2E2", fg: "#991B1B" };
  if (status === "cancelled" || status === "void")
    return { bg: "#F3F4F6", fg: "#374151" };
  if (status === "refunded") return { bg: "#EDE9FE", fg: "#5B21B6" };
  return { bg: "#E5E7EB", fg: "#111827" };
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function hexToRgb(hex: string) {
  const m = hex.trim().match(/^#?([0-9a-fA-F]{6})$/);
  if (!m) return null;
  const v = m[1];
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  const to = (x: number) =>
    clamp(Math.round(x), 0, 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function rgbToHsl(r: number, g: number, b: number) {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const d = max - min;
  let h = 0;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  if (d !== 0) {
    if (max === rr) h = ((gg - bb) / d) % 6;
    else if (max === gg) h = (bb - rr) / d + 2;
    else h = (rr - gg) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rr = 0;
  let gg = 0;
  let bb = 0;
  if (h < 60) [rr, gg, bb] = [c, x, 0];
  else if (h < 120) [rr, gg, bb] = [x, c, 0];
  else if (h < 180) [rr, gg, bb] = [0, c, x];
  else if (h < 240) [rr, gg, bb] = [0, x, c];
  else if (h < 300) [rr, gg, bb] = [x, 0, c];
  else [rr, gg, bb] = [c, 0, x];
  return {
    r: (rr + m) * 255,
    g: (gg + m) * 255,
    b: (bb + m) * 255,
  };
}

function deriveBrandColors(primaryHex: string) {
  const rgb = hexToRgb(primaryHex) || hexToRgb("#0038e0");
  if (!rgb)
    return { primary: "#0038e0", secondary: "#facc15", accent: "#111827" };
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const s2 = clamp(s * 1.05, 0, 1);
  const secondaryRgb = hslToRgb((h + 45) % 360, s2, clamp(l, 0.35, 0.6));
  const accentRgb = hslToRgb(
    (h + 200) % 360,
    clamp(s * 0.75, 0, 1),
    clamp(l * 0.28, 0.12, 0.22),
  );
  return {
    primary: rgbToHex(rgb.r, rgb.g, rgb.b),
    secondary: rgbToHex(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b),
    accent: rgbToHex(accentRgb.r, accentRgb.g, accentRgb.b),
  };
}

export function InvoiceTemplate({
  invoice,
  variant,
}: {
  invoice: Partial<Invoice>;
  variant: Variant;
}) {
  ensureFont();
  const themeColor = invoice.colorTheme || "#1a365d";
  const t = getTokens(variant, themeColor);
  const brand = deriveBrandColors(themeColor);
  const stripe = invoice.pdfBrand || brand;
  const topRibbonHeight = 30;
  const topStripeHeight = 4;
  const issueDateText = invoice.issueDate
    ? new Date(invoice.issueDate).toLocaleDateString()
    : "";
  const dueDateText = invoice.dueDate
    ? new Date(invoice.dueDate).toLocaleDateString()
    : "";

  const hasNotes = !!String(invoice.notes || "").trim();
  const hasDeliverables = !!String(invoice.deliverables || "").trim();
  const hasTerms = !!String(invoice.terms || "").trim();
  const bank = invoice.bankDetails;
  const paymentMode = (invoice.paymentMode ||
    (invoice.paymentLink
      ? "url"
      : bank?.upi && !bank?.accountNumber && !bank?.iban
        ? "upi"
        : "bank")) as "upi" | "bank" | "url";
  const lineItems = invoice.lineItems || [];
  const hasItemDetails = lineItems.some(
    (i) => !!String(i.details || "").trim(),
  );
  const hasBank = !!(
    bank?.bankName ||
    bank?.accountName ||
    bank?.accountNumber ||
    bank?.routingNumber ||
    bank?.swift ||
    bank?.iban ||
    bank?.upi
  );
  const hasPayment =
    hasBank ||
    !!invoice.paymentTerms ||
    !!invoice.paymentLink ||
    !!invoice.paymentMethods?.length;
  const hasSignature =
    !!invoice.showSignature &&
    !!(invoice.signature || invoice.signatureTyped || invoice.signatureRole);
  const showBottomBar =
    invoice.showFooter !== false ||
    !!invoice.showWatermark ||
    !!invoice.showPageNumbers;

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: t.pageBg,
      fontFamily: "NotoSans",
      paddingTop: topRibbonHeight,
      paddingHorizontal: 32,
      paddingBottom: 56,
    },
    topStripe: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: topStripeHeight,
      flexDirection: "row",
      opacity: 0.55,
    },
    topRibbon: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: topRibbonHeight,
      paddingTop: topStripeHeight,
      paddingHorizontal: 32,
      backgroundColor: t.pageBg,
      borderBottomWidth: 1,
      borderBottomColor: t.divider,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    topRibbonLeft: { fontSize: 9, color: t.bodyText, fontWeight: 700 },
    topRibbonRight: { fontSize: 9, color: t.mutedText },
    stripePrimary: { flex: 6 },
    stripeSecondary: { flex: 3 },
    stripeAccent: { flex: 1 },
    headerBand: {
      backgroundColor: t.headerBg,
      marginHorizontal: -32,
      paddingVertical: 24,
      paddingHorizontal: 32,
      flexDirection: "row",
      justifyContent: "space-between",
      color: t.headerFg,
    },
    headerPlain: {
      marginHorizontal: -32,
      paddingVertical: 24,
      paddingHorizontal: 32,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 22,
      fontWeight: 700,
      color: t.headerMode === "plain" ? t.headerFg : t.headerFg,
    },
    invoiceInfo: { flexDirection: "row", justifyContent: "flex-end" },
    metaItem: { marginLeft: 10, minWidth: 64 },
    labelInHeader: {
      fontSize: 10,
      color: t.headerMode === "plain" ? t.headerLabel : t.headerLabel,
      marginBottom: 2,
    },
    valueInHeader: {
      fontSize: 11,
      marginBottom: 0,
      color: t.headerMode === "plain" ? t.bodyText : t.headerFg,
    },
    statusPill: {
      marginTop: 4,
      paddingVertical: 3,
      paddingHorizontal: 8,
      borderRadius: 999,
      alignSelf: "flex-start",
    },
    statusText: { fontSize: 9, fontWeight: 700 },
    content: {
      paddingTop: 24,
    },
    section: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    addressBox: { width: "48%" },
    addressRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      alignItems: "flex-start",
    },
    addressCol: { flex: 1 },
    label: {
      fontSize: 7,
      color: t.mutedText,
      marginBottom: 3,
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },
    businessName: {
      fontSize: 16,
      fontWeight: 700,
      marginBottom: 4,
      color: t.bodyText,
    },
    addressText: {
      fontSize: 10,
      color: t.mutedText,
      lineHeight: 1.5,
    },
    table: { width: "100%", marginTop: 10, marginBottom: 18 },
    tableHeader: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: t.divider,
      paddingBottom: 8,
      marginBottom: 10,
    },
    colRight: { textAlign: "right" },
    th: {
      fontSize: 10,
      fontWeight: 700,
      color: t.tableHeaderText,
      textTransform: "uppercase",
    },
    tr: {
      flexDirection: "row",
      paddingBottom: 7,
      paddingTop: 7,
      borderBottomWidth: 1,
      borderBottomColor: t.tableRowDivider,
    },
    td: { fontSize: 10, color: t.bodyText },
    totals: { width: "44%", alignSelf: "flex-end", marginTop: 8, marginBottom: 18 },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    totalLabel: { fontSize: 10, color: t.mutedText },
    totalValue: { fontSize: 10, color: t.bodyText },
    grandTotalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 2,
      borderTopColor: t.totalsBorder,
    },
    grandTotalLabel: { fontSize: 12, fontWeight: 700, color: t.bodyText },
    grandTotalValue: {
      fontSize: 12,
      fontWeight: 700,
      color: t.headerFg === "#FFFFFF" ? themeColor : t.bodyText,
    },
    logo: { width: 60, height: 60, objectFit: "contain", marginBottom: 10 },
    addressLogo: { width: 48, height: 48, objectFit: "contain" },
    blockTitle: {
      fontSize: 10,
      color: t.bodyText,
      textTransform: "uppercase",
      letterSpacing: 0.3,
      marginBottom: 6,
      fontWeight: 700,
    },
    divider: {
      height: 1,
      backgroundColor: t.divider,
      marginTop: 10,
      marginBottom: 10,
    },
    signatureImage: { width: 140, height: 52, objectFit: "contain" },
    bottomBar: {
      position: "absolute",
      bottom: 16,
      left: 32,
      right: 32,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: t.divider,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    bottomText: { fontSize: 10, color: t.footerText },
    bottomLink: {
      fontSize: 10,
      color: t.watermarkText,
      textDecoration: "none",
    },
    bottomCol: { flex: 1 },
    bottomLeft: { textAlign: "left" },
    bottomCenter: { textAlign: "center" },
    bottomRight: { textAlign: "right" },
    kvRow: {
      flexDirection: "row",
      justifyContent: "flex-start",
      marginBottom: 8,
    },
    kvKey: { width: 110, fontSize: 10, color: t.mutedText },
    kvVal: {
      flex: 1,
      fontSize: 10,
      color: t.bodyText,
      textAlign: "left",
    },
    qrBox: {
      marginTop: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    qrImage: { width: 96, height: 96, objectFit: "contain" },
    payRow: {
      marginTop: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    payLeft: { flex: 1, paddingRight: 12 },
    payLabel: { fontSize: 10, color: t.mutedText, marginBottom: 4 },
    payValue: { fontSize: 11, color: t.bodyText, fontWeight: 700 },
    payHint: { fontSize: 10, color: t.mutedText, marginTop: 10 },
    payQrCol: { width: 96, alignItems: "flex-end" },
    noteBox: {
      backgroundColor: "#fff8e3",
      borderRadius: 3,
      padding: 12,
    },
    deliverablesBox: {
      backgroundColor: "#F9FAFB",
      borderRadius: 3,
      padding: 12,
    },
    termsBox: {
      backgroundColor: "#F7F8FA",
      borderRadius: 3,
      padding: 12,
    },
    termsBody: {
      fontSize: 9.5,
      color: t.mutedText,
      lineHeight: 1.35,
      fontStyle: "italic",
    },
  });

  const Header = (
    <View
      style={t.headerMode === "band" ? styles.headerBand : styles.headerPlain}
    >
      <View>
        <Text
          style={[
            styles.title,
            t.headerMode === "plain" ? { color: themeColor } : {},
          ]}
        >
          {invoice.title || "INVOICE"}
        </Text>
        <Text
          style={
            t.headerMode === "plain"
              ? styles.valueInHeader
              : styles.valueInHeader
          }
        >
          {invoice.invoiceNumber}
        </Text>
        {!!invoice.poNumber && (
          <Text style={styles.valueInHeader}>PO: {invoice.poNumber}</Text>
        )}
        {!!invoice.deliveryDate && (
          <Text style={styles.valueInHeader}>
            Delivery: {new Date(invoice.deliveryDate).toLocaleDateString()}
          </Text>
        )}
      </View>
      <View style={styles.invoiceInfo}>
        <View style={styles.metaItem}>
          <Text style={styles.labelInHeader}>Issue</Text>
          <Text style={styles.valueInHeader}>
            {invoice.issueDate
              ? new Date(invoice.issueDate).toLocaleDateString()
              : ""}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.labelInHeader}>Due</Text>
          <Text style={styles.valueInHeader}>
            {invoice.dueDate
              ? new Date(invoice.dueDate).toLocaleDateString()
              : ""}
          </Text>
        </View>
        {!!invoice.status && (
          <View style={styles.metaItem}>
            <Text style={styles.labelInHeader}>Status</Text>
            <View
              style={[
                styles.statusPill,
                { backgroundColor: statusPill(invoice.status).bg },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: statusPill(invoice.status).fg },
                ]}
              >
                {String(invoice.status).toUpperCase()}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {invoice.showRibbon !== false ? (
          <View fixed style={styles.topStripe}>
            <View
              style={[
                styles.stripePrimary,
                { backgroundColor: stripe.primary },
              ]}
            />
            <View
              style={[
                styles.stripeSecondary,
                { backgroundColor: stripe.secondary },
              ]}
            />
            <View
              style={[styles.stripeAccent, { backgroundColor: stripe.accent }]}
            />
          </View>
        ) : null}
        <View
          render={({ pageNumber }) =>
            pageNumber > 1 ? (
              <View fixed style={styles.topRibbon}>
                <Text style={styles.topRibbonLeft}>
                  {invoice.invoiceNumber || ""}
                </Text>
                <Text style={styles.topRibbonRight}>
                  {issueDateText ? `Issue ${issueDateText}` : ""}
                  {issueDateText && dueDateText ? "  •  " : ""}
                  {dueDateText ? `Due ${dueDateText}` : ""}
                </Text>
              </View>
            ) : null
          }
        />
        <View
          render={({ pageNumber }) =>
            pageNumber === 1 ? (
              <View style={{ marginTop: -topRibbonHeight }}>{Header}</View>
            ) : null
          }
        />

        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.addressBox}>
              <Text style={styles.label}>From</Text>
              <View style={styles.addressRow}>
                {invoice.from?.logo ? (
                  <Image src={invoice.from.logo} style={styles.addressLogo} />
                ) : null}
                <View style={styles.addressCol}>
                  <Text style={styles.businessName}>
                    {invoice.from?.businessName}
                  </Text>
                  {!!invoice.from?.contactName && (
                    <Text style={styles.addressText}>
                      {invoice.from.contactName}
                    </Text>
                  )}
                  {!!invoice.from?.email && (
                    <Text style={styles.addressText}>{invoice.from.email}</Text>
                  )}
                  {!!invoice.from?.phone && (
                    <Text style={styles.addressText}>{invoice.from.phone}</Text>
                  )}
                  {!!invoice.from?.taxId && (
                    <Text style={styles.addressText}>
                      Tax ID: {invoice.from.taxId}
                    </Text>
                  )}
                  {(invoice.from?.customFields || [])
                    .map((f, idx) => ({
                      key: f?.id || `${String(f?.label || "")}-${idx}`,
                      label: String(f?.label || "").trim(),
                      value: String(f?.value || "").trim(),
                    }))
                    .filter((f) => f.label && f.value)
                    .map((f) => (
                      <Text key={f.key} style={styles.addressText}>
                        {f.label}: {f.value}
                      </Text>
                    ))}
                  {!!invoice.from?.address?.line1 && (
                    <Text style={styles.addressText}>
                      {invoice.from.address.line1}
                    </Text>
                  )}
                  {!!invoice.from?.address?.line2 && (
                    <Text style={styles.addressText}>
                      {invoice.from.address.line2}
                    </Text>
                  )}
                  {!!addressLine(invoice.from?.address) && (
                    <Text style={styles.addressText}>
                      {addressLine(invoice.from?.address)}
                    </Text>
                  )}
                  {!!invoice.from?.website && (
                    <Text style={styles.addressText}>
                      {invoice.from.website}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.addressBox}>
              <Text style={styles.label}>To</Text>
              <View style={styles.addressRow}>
                {invoice.to?.logo ? (
                  <Image src={invoice.to.logo} style={styles.addressLogo} />
                ) : null}
                <View style={styles.addressCol}>
                  <Text style={styles.businessName}>
                    {invoice.to?.businessName}
                  </Text>
                  {!!invoice.to?.contactName && (
                    <Text style={styles.addressText}>
                      {invoice.to.contactName}
                    </Text>
                  )}
                  {!!invoice.to?.email && (
                    <Text style={styles.addressText}>{invoice.to.email}</Text>
                  )}
                  {!!invoice.to?.phone && (
                    <Text style={styles.addressText}>{invoice.to.phone}</Text>
                  )}
                  {!!invoice.to?.taxId && (
                    <Text style={styles.addressText}>
                      Tax ID: {invoice.to.taxId}
                    </Text>
                  )}
                  {(invoice.to?.customFields || [])
                    .map((f, idx) => ({
                      key: f?.id || `${String(f?.label || "")}-${idx}`,
                      label: String(f?.label || "").trim(),
                      value: String(f?.value || "").trim(),
                    }))
                    .filter((f) => f.label && f.value)
                    .map((f) => (
                      <Text key={f.key} style={styles.addressText}>
                        {f.label}: {f.value}
                      </Text>
                    ))}
                  {!!invoice.to?.address?.line1 && (
                    <Text style={styles.addressText}>
                      {invoice.to.address.line1}
                    </Text>
                  )}
                  {!!invoice.to?.address?.line2 && (
                    <Text style={styles.addressText}>
                      {invoice.to.address.line2}
                    </Text>
                  )}
                  {!!addressLine(invoice.to?.address) && (
                    <Text style={styles.addressText}>
                      {addressLine(invoice.to?.address)}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text
                style={[{ width: hasItemDetails ? "28%" : "46%" }, styles.th]}
              >
                Name
              </Text>
              {hasItemDetails ? (
                <Text style={[{ width: "26%" }, styles.th]}>Description</Text>
              ) : null}
              <Text
                style={[
                  { width: hasItemDetails ? "14%" : "18%" },
                  styles.th,
                  styles.colRight,
                ]}
              >
                Qty
              </Text>
              <Text
                style={[
                  { width: hasItemDetails ? "16%" : "18%" },
                  styles.th,
                  styles.colRight,
                ]}
              >
                Price
              </Text>
              <Text
                style={[
                  { width: hasItemDetails ? "16%" : "18%" },
                  styles.th,
                  styles.colRight,
                ]}
              >
                Amount
              </Text>
            </View>
            {lineItems.map((item) => (
              <View key={item.id} style={styles.tr} wrap={false}>
                <Text
                  style={[{ width: hasItemDetails ? "28%" : "46%" }, styles.td]}
                >
                  {item.description}
                </Text>
                {hasItemDetails ? (
                  <Text style={[{ width: "26%" }, styles.td]}>
                    {String(item.details || "")}
                  </Text>
                ) : null}
                <Text
                  style={[
                    { width: hasItemDetails ? "14%" : "18%" },
                    styles.td,
                    styles.colRight,
                  ]}
                >
                  {formatNumber(item.quantity)}
                  {item.unit ? ` ${item.unit}` : ""}
                </Text>
                <Text
                  style={[
                    { width: hasItemDetails ? "16%" : "18%" },
                    styles.td,
                    styles.colRight,
                  ]}
                >
                  {formatMoneyPdf(item.unitPrice, invoice.currency)}
                </Text>
                <Text
                  style={[
                    { width: hasItemDetails ? "16%" : "18%" },
                    styles.td,
                    styles.colRight,
                  ]}
                >
                  {formatMoneyPdf(item.amount || 0, invoice.currency)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>
                {formatMoneyPdf(invoice.subtotal, invoice.currency)}
              </Text>
            </View>
            {!!invoice.discountAmount && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount</Text>
                <Text style={styles.totalValue}>
                  -{formatMoneyPdf(invoice.discountAmount, invoice.currency)}
                </Text>
              </View>
            )}
            {(invoice.taxLines || []).map((tax, idx) => (
              <View key={tax.id || idx} style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  {tax.name} ({tax.rate}%)
                </Text>
                <Text style={styles.totalValue}>
                  {formatMoneyPdf(tax.amount || 0, invoice.currency)}
                </Text>
              </View>
            ))}
            {!!invoice.shippingFee && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Shipping</Text>
                <Text style={styles.totalValue}>
                  {formatMoneyPdf(invoice.shippingFee || 0, invoice.currency)}
                </Text>
              </View>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={[styles.grandTotalValue, { color: themeColor }]}>
                {formatMoneyPdf(invoice.total, invoice.currency)}
              </Text>
            </View>
            {!!invoice.amountPaid && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Amount Paid</Text>
                <Text style={styles.totalValue}>
                  -{formatMoneyPdf(invoice.amountPaid || 0, invoice.currency)}
                </Text>
              </View>
            )}
            {!!invoice.amountPaid && (
              <View
                style={[
                  styles.grandTotalRow,
                  { borderTopWidth: 1, borderTopColor: t.divider },
                ]}
              >
                <Text style={styles.grandTotalLabel}>Amount Due</Text>
                <Text style={[styles.grandTotalValue, { color: themeColor }]}>
                  {formatMoneyPdf(invoice.amountDue || 0, invoice.currency)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {(hasNotes ||
          hasTerms ||
          hasDeliverables ||
          hasPayment ||
          hasSignature) && (
          <View
            style={{ paddingHorizontal: 40, marginTop: 12, marginBottom: 56 }}
          >
            {hasPayment ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "52%" }}>
                  {hasNotes ? (
                    <View style={{ marginBottom: 14 }}>
                      <View style={styles.noteBox}>
                        <Text
                          style={[
                            styles.blockTitle,
                            { color: "#111827", marginBottom: 6 },
                          ]}
                        >
                          Notes
                        </Text>
                        <Text
                          style={[styles.addressText, { color: "#111827" }]}
                        >
                          {String(invoice.notes || "")}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                  {hasDeliverables ? (
                    <View style={{ marginBottom: 14 }}>
                      <View style={styles.deliverablesBox}>
                        <Text style={[styles.blockTitle, { marginBottom: 6 }]}>
                          Deliverables
                        </Text>
                        {String(invoice.deliverables || "")
                          .split(/\r?\n/g)
                          .map((s) => s.replace(/^\s*[-*]\s*/, "").trim())
                          .filter(Boolean)
                          .map((d) => (
                            <Text key={d} style={styles.addressText}>
                              • {d}
                            </Text>
                          ))}
                      </View>
                    </View>
                  ) : null}
                  {hasTerms ? (
                    <View style={{ marginBottom: 14 }}>
                      <View style={styles.termsBox}>
                        <Text style={[styles.blockTitle, { marginBottom: 6 }]}>
                          Terms & Conditions
                        </Text>
                        <Text style={styles.termsBody}>
                          {String(invoice.terms || "")}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                  {hasSignature ? (
                    <View
                      wrap={false}
                      style={{
                        marginTop:
                          hasNotes || hasTerms || hasDeliverables ? 40 : 16,
                      }}
                    >
                      <Text style={styles.blockTitle}>Signature</Text>
                      <View style={{ marginTop: 18 }}>
                        {(() => {
                          const mode = invoice.signatureMode;
                          if (mode === "type") {
                            return invoice.signatureTyped ? (
                              <Text
                                style={[
                                  styles.addressText,
                                  {
                                    fontSize: 16,
                                    fontStyle: "italic",
                                    color: t.bodyText,
                                  },
                                ]}
                              >
                                {invoice.signatureTyped}
                              </Text>
                            ) : null;
                          }
                          if (invoice.signature)
                            return (
                              <Image
                                src={invoice.signature}
                                style={styles.signatureImage}
                              />
                            );
                          return invoice.signatureTyped ? (
                            <Text
                              style={[
                                styles.addressText,
                                {
                                  fontSize: 16,
                                  fontStyle: "italic",
                                  color: t.bodyText,
                                },
                              ]}
                            >
                              {invoice.signatureTyped}
                            </Text>
                          ) : null;
                        })()}
                      </View>
                      <View style={styles.divider} />
                      <Text style={styles.addressText}>
                        {invoice.signatureRole || ""}
                      </Text>
                    </View>
                  ) : null}
                </View>

                <View
                  style={{ width: "44%", alignSelf: "flex-end" }}
                  wrap={false}
                  minPresenceAhead={160}
                >
                    <Text style={[styles.blockTitle, { alignSelf: "flex-start" }]}>
                      Payment
                    </Text>
                    {!!invoice.paymentMethods?.length && (
                      <View style={styles.kvRow}>
                        <Text style={styles.kvKey}>Methods</Text>
                        <Text style={styles.kvVal}>
                          {invoice.paymentMethods.join(", ")}
                        </Text>
                      </View>
                    )}
                    {!!invoice.paymentTerms && (
                      <View style={styles.kvRow}>
                        <Text style={styles.kvKey}>Terms</Text>
                        <Text style={styles.kvVal}>
                          {String(invoice.paymentTerms)}
                        </Text>
                      </View>
                    )}
                    {!!invoice.paymentLink && (
                      <View style={styles.kvRow}>
                        <Text style={styles.kvKey}>Link</Text>
                        <Text style={styles.kvVal}>{invoice.paymentLink}</Text>
                      </View>
                    )}
                    {paymentMode === "url" && !!invoice.paymentLink && (
                      <View style={styles.kvRow}>
                        <Text style={styles.kvKey}>Payment URL</Text>
                        <Text style={styles.kvVal}>{invoice.paymentLink}</Text>
                      </View>
                    )}
                    {paymentMode === "bank" && bank?.bankName && (
                      <View style={styles.kvRow}>
                        <Text style={styles.kvKey}>Bank</Text>
                        <Text style={styles.kvVal}>{bank.bankName}</Text>
                      </View>
                    )}
                    {paymentMode === "bank" && bank?.accountName && (
                      <View style={styles.kvRow}>
                        <Text style={styles.kvKey}>Account Holder</Text>
                        <Text style={styles.kvVal}>{bank.accountName}</Text>
                      </View>
                    )}
                    {paymentMode === "bank" && bank?.ifsc && (
                      <View style={styles.kvRow}>
                        <Text style={styles.kvKey}>IFSC</Text>
                        <Text style={styles.kvVal}>{bank.ifsc}</Text>
                      </View>
                    )}
                    {paymentMode === "bank" && bank?.accountNumber && (
                      <View style={styles.kvRow}>
                        <Text style={styles.kvKey}>Account</Text>
                        <Text style={styles.kvVal}>{bank.accountNumber}</Text>
                      </View>
                    )}
                    {paymentMode === "bank" && bank?.routingNumber && (
                      <View style={styles.kvRow}>
                        <Text style={styles.kvKey}>Routing</Text>
                        <Text style={styles.kvVal}>{bank.routingNumber}</Text>
                      </View>
                    )}
                    {paymentMode === "bank" && bank?.swift && (
                      <View style={styles.kvRow}>
                        <Text style={styles.kvKey}>SWIFT</Text>
                        <Text style={styles.kvVal}>{bank.swift}</Text>
                      </View>
                    )}
                    {paymentMode === "bank" && bank?.iban && (
                      <View style={styles.kvRow}>
                        <Text style={styles.kvKey}>IBAN</Text>
                        <Text style={styles.kvVal}>{bank.iban}</Text>
                      </View>
                    )}
                    {paymentMode === "upi" && bank?.upi && (
                      <View style={styles.payRow}>
                        <View style={styles.payLeft}>
                          <Text style={styles.payLabel}>UPI ID</Text>
                          <Text style={styles.payValue}>{bank.upi}</Text>
                          {invoice.upiQr ? (
                            <Text style={styles.payHint}>
                              Scan to pay{" "}
                              {formatMoneyPdf(
                                (invoice.amountDue ?? invoice.total) || 0,
                                invoice.currency,
                              )}
                            </Text>
                          ) : null}
                        </View>
                        {invoice.upiQr ? (
                          <View style={styles.payQrCol}>
                            <Image src={invoice.upiQr} style={styles.qrImage} />
                          </View>
                        ) : null}
                      </View>
                    )}
                </View>
              </View>
            ) : (
              <View>
                {hasNotes ? (
                  <View style={{ marginBottom: 14 }}>
                    <View style={styles.noteBox}>
                      <Text
                        style={[
                          styles.blockTitle,
                          { color: "#111827", marginBottom: 6 },
                        ]}
                      >
                        Notes
                      </Text>
                      <Text style={[styles.addressText, { color: "#111827" }]}>
                        {String(invoice.notes || "")}
                      </Text>
                    </View>
                  </View>
                ) : null}
                {hasDeliverables ? (
                  <View style={{ marginBottom: 14 }}>
                    <View style={styles.deliverablesBox}>
                      <Text style={[styles.blockTitle, { marginBottom: 6 }]}>
                        Deliverables
                      </Text>
                      {String(invoice.deliverables || "")
                        .split(/\r?\n/g)
                        .map((s) => s.replace(/^\s*[-*]\s*/, "").trim())
                        .filter(Boolean)
                        .map((d) => (
                          <Text key={d} style={styles.addressText}>
                            • {d}
                          </Text>
                        ))}
                    </View>
                  </View>
                ) : null}
                {hasTerms ? (
                  <View style={{ marginBottom: 14 }}>
                    <View style={styles.termsBox}>
                      <Text style={[styles.blockTitle, { marginBottom: 6 }]}>
                        Terms & Conditions
                      </Text>
                      <Text style={styles.termsBody}>
                        {String(invoice.terms || "")}
                      </Text>
                    </View>
                  </View>
                ) : null}
                {hasSignature ? (
                  <View
                    wrap={false}
                    style={{
                      marginTop:
                        hasNotes || hasTerms || hasDeliverables ? 40 : 16,
                    }}
                  >
                    <Text style={styles.blockTitle}>Signature</Text>
                    <View style={{ marginTop: 18 }}>
                      {(() => {
                        const mode = invoice.signatureMode;
                        if (mode === "type") {
                          return invoice.signatureTyped ? (
                            <Text
                              style={[
                                styles.addressText,
                                {
                                  fontSize: 16,
                                  fontStyle: "italic",
                                  color: t.bodyText,
                                },
                              ]}
                            >
                              {invoice.signatureTyped}
                            </Text>
                          ) : null;
                        }
                        if (invoice.signature)
                          return (
                            <Image
                              src={invoice.signature}
                              style={styles.signatureImage}
                            />
                          );
                        return invoice.signatureTyped ? (
                          <Text
                            style={[
                              styles.addressText,
                              {
                                fontSize: 16,
                                fontStyle: "italic",
                                color: t.bodyText,
                              },
                            ]}
                          >
                            {invoice.signatureTyped}
                          </Text>
                        ) : null;
                      })()}
                    </View>
                    <View style={styles.divider} />
                    <Text style={styles.addressText}>
                      {invoice.signatureRole || ""}
                    </Text>
                  </View>
                ) : null}
              </View>
            )}
          </View>
        )}

        {showBottomBar && (
          <View fixed style={styles.bottomBar}>
            <View style={styles.bottomCol}>
              <Text style={[styles.bottomText, styles.bottomLeft]}>
                {invoice.showFooter !== false
                  ? invoice.from?.businessName || "Thank you for your business."
                  : ""}
              </Text>
            </View>
            <View style={styles.bottomCol}>
              {invoice.showPageNumbers ? (
                <Text
                  style={[styles.bottomText, styles.bottomCenter]}
                  render={({ pageNumber, totalPages }) =>
                    `${pageNumber} / ${totalPages}`
                  }
                />
              ) : (
                <Text style={[styles.bottomText, styles.bottomCenter]}>
                  {""}
                </Text>
              )}
            </View>
            <View style={styles.bottomCol}>
              {invoice.showWatermark ? (
                <View style={{ alignItems: "flex-end" }}>
                  <Link src={SITE_URL} style={styles.bottomLink}>
                    Powered by {APP_NAME}
                  </Link>
                </View>
              ) : (
                <Text style={[styles.bottomText, styles.bottomRight]}>
                  {""}
                </Text>
              )}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
