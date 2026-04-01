import React from "react";
import { Document, Image, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Invoice } from "@/types/invoice.types";
import type { TemplateKey } from "./index";

type Variant = TemplateKey;

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
    case "modern":
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

function addressLine(a?: any) {
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
  if (status === "cancelled" || status === "void") return { bg: "#F3F4F6", fg: "#374151" };
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
  const to = (x: number) => clamp(Math.round(x), 0, 255).toString(16).padStart(2, "0");
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
  if (!rgb) return { primary: "#0038e0", secondary: "#facc15", accent: "#111827" };
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const s2 = clamp(s * 1.05, 0, 1);
  const secondaryRgb = hslToRgb((h + 45) % 360, s2, clamp(l, 0.35, 0.6));
  const accentRgb = hslToRgb((h + 200) % 360, clamp(s * 0.75, 0, 1), clamp(l * 0.28, 0.12, 0.22));
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
  const themeColor = invoice.colorTheme || "#1a365d";
  const t = getTokens(variant, themeColor);
  const brand = deriveBrandColors(themeColor);
  const stripe = invoice.pdfBrand || brand;

  const hasNotes = !!invoice.notes;
  const hasTerms = !!invoice.terms;
  const bank = invoice.bankDetails;
  const paymentMode = (invoice.paymentMode ||
    (invoice.paymentLink ? "url" : (bank?.upi && !bank?.accountNumber && !bank?.iban) ? "upi" : "bank")) as "upi" | "bank" | "url";
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
    !!(invoice.paymentMethods && invoice.paymentMethods.length);
  const hasSignature = !!invoice.showSignature && !!(invoice.signature || invoice.signatureTyped || invoice.signatureRole);
  const showBottomBar = invoice.showFooter !== false || !!invoice.showWatermark || !!invoice.showPageNumbers;

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: t.pageBg,
      fontFamily: "Helvetica",
      paddingTop: 12,
    },
    topStripe: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 12,
      flexDirection: "row",
    },
    stripePrimary: { flex: 6 },
    stripeSecondary: { flex: 3 },
    stripeAccent: { flex: 1 },
    headerBand: {
      backgroundColor: t.headerBg,
      padding: 24,
      flexDirection: "row",
      justifyContent: "space-between",
      color: t.headerFg,
    },
    headerPlain: {
      padding: 24,
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
      padding: 32,
      paddingBottom: 72,
    },
    section: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    addressBox: { width: "48%" },
    addressRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
    addressCol: { flex: 1 },
    label: {
      fontSize: 10,
      color: t.mutedText,
      marginBottom: 4,
      textTransform: "uppercase",
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
    col1: { width: "46%" },
    col2: { width: "18%", textAlign: "right" },
    col3: { width: "18%", textAlign: "right" },
    col4: { width: "18%", textAlign: "right" },
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
    totals: { width: "44%", alignSelf: "flex-end", marginTop: 8 },
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
    grandTotalValue: { fontSize: 12, fontWeight: 700, color: t.headerFg === "#FFFFFF" ? themeColor : t.bodyText },
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
    divider: { height: 1, backgroundColor: t.divider, marginTop: 10, marginBottom: 10 },
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
    bottomLink: { fontSize: 10, color: t.watermarkText, textDecoration: "none" },
    bottomCol: { flex: 1 },
    bottomLeft: { textAlign: "left" },
    bottomCenter: { textAlign: "center" },
    bottomRight: { textAlign: "right" },
    kvRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
    kvKey: { fontSize: 10, color: t.mutedText },
    kvVal: { fontSize: 10, color: t.bodyText, textAlign: "right" },
    qrBox: { marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    qrImage: { width: 96, height: 96, objectFit: "contain" },
  });

  const Header = (
    <View style={t.headerMode === "band" ? styles.headerBand : styles.headerPlain}>
      <View>
        <Text style={[styles.title, t.headerMode === "plain" ? { color: themeColor } : {}]}>
          {invoice.title || "INVOICE"}
        </Text>
        <Text style={t.headerMode === "plain" ? styles.valueInHeader : styles.valueInHeader}>
          {invoice.invoiceNumber}
        </Text>
        {!!invoice.poNumber && <Text style={styles.valueInHeader}>PO: {invoice.poNumber}</Text>}
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
            {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : ""}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.labelInHeader}>Due</Text>
          <Text style={styles.valueInHeader}>
            {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : ""}
          </Text>
        </View>
        {!!invoice.status && (
          <View style={styles.metaItem}>
            <Text style={styles.labelInHeader}>Status</Text>
            <View style={[styles.statusPill, { backgroundColor: statusPill(invoice.status).bg }]}>
              <Text style={[styles.statusText, { color: statusPill(invoice.status).fg }]}>
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
        <View fixed style={styles.topStripe}>
          <View style={[styles.stripePrimary, { backgroundColor: stripe.primary }]} />
          <View style={[styles.stripeSecondary, { backgroundColor: stripe.secondary }]} />
          <View style={[styles.stripeAccent, { backgroundColor: stripe.accent }]} />
        </View>
        {Header}

        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.addressBox}>
              <Text style={styles.label}>From</Text>
              <View style={styles.addressRow}>
                {invoice.showLogo !== false && invoice.from?.logo && (
                  <Image src={invoice.from.logo} style={styles.addressLogo} />
                )}
                <View style={styles.addressCol}>
                  <Text style={styles.businessName}>{invoice.from?.businessName}</Text>
                  {!!invoice.from?.contactName && <Text style={styles.addressText}>{invoice.from.contactName}</Text>}
                  {!!invoice.from?.email && <Text style={styles.addressText}>{invoice.from.email}</Text>}
                  {!!invoice.from?.phone && <Text style={styles.addressText}>{invoice.from.phone}</Text>}
                  {!!invoice.from?.taxId && <Text style={styles.addressText}>Tax ID: {invoice.from.taxId}</Text>}
                  {!!invoice.from?.address?.line1 && <Text style={styles.addressText}>{invoice.from.address.line1}</Text>}
                  {!!invoice.from?.address?.line2 && <Text style={styles.addressText}>{invoice.from.address.line2}</Text>}
                  {!!addressLine(invoice.from?.address) && (
                    <Text style={styles.addressText}>{addressLine(invoice.from?.address)}</Text>
                  )}
                  {!!invoice.from?.website && <Text style={styles.addressText}>{invoice.from.website}</Text>}
                </View>
              </View>
            </View>
            <View style={styles.addressBox}>
              <Text style={styles.label}>To</Text>
              <View style={styles.addressRow}>
                {invoice.showLogo !== false && invoice.to?.logo && (
                  <Image src={invoice.to.logo} style={styles.addressLogo} />
                )}
                <View style={styles.addressCol}>
                  <Text style={styles.businessName}>{invoice.to?.businessName}</Text>
                  {!!invoice.to?.contactName && <Text style={styles.addressText}>{invoice.to.contactName}</Text>}
                  {!!invoice.to?.email && <Text style={styles.addressText}>{invoice.to.email}</Text>}
                  {!!invoice.to?.phone && <Text style={styles.addressText}>{invoice.to.phone}</Text>}
                  {!!invoice.to?.taxId && <Text style={styles.addressText}>Tax ID: {invoice.to.taxId}</Text>}
                  {!!invoice.to?.address?.line1 && <Text style={styles.addressText}>{invoice.to.address.line1}</Text>}
                  {!!invoice.to?.address?.line2 && <Text style={styles.addressText}>{invoice.to.address.line2}</Text>}
                  {!!addressLine(invoice.to?.address) && (
                    <Text style={styles.addressText}>{addressLine(invoice.to?.address)}</Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.col1, styles.th]}>Description</Text>
              <Text style={[styles.col2, styles.th]}>Qty</Text>
              <Text style={[styles.col3, styles.th]}>Price</Text>
              <Text style={[styles.col4, styles.th]}>Amount</Text>
            </View>
            {(invoice.lineItems || []).map((item, i) => (
              <View key={i} style={styles.tr}>
                <Text style={[styles.col1, styles.td]}>
                  {item.description}
                  {item.details ? `\n${item.details}` : ""}
                </Text>
                <Text style={[styles.col2, styles.td]}>
                  {item.quantity}
                  {item.unit ? ` ${item.unit}` : ""}
                </Text>
                <Text style={[styles.col3, styles.td]}>{item.unitPrice}</Text>
                <Text style={[styles.col4, styles.td]}>{item.amount?.toFixed(2)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>
                {invoice.currency} {invoice.subtotal?.toFixed(2)}
              </Text>
            </View>
            {!!invoice.discountAmount && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount</Text>
                <Text style={styles.totalValue}>
                  -{invoice.currency} {invoice.discountAmount?.toFixed(2)}
                </Text>
              </View>
            )}
            {(invoice.taxLines || []).map((tax, idx) => (
              <View key={tax.id || idx} style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  {tax.name} ({tax.rate}%)
                </Text>
                <Text style={styles.totalValue}>
                  {invoice.currency} {(tax.amount || 0).toFixed(2)}
                </Text>
              </View>
            ))}
            {!!invoice.shippingFee && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Shipping</Text>
                <Text style={styles.totalValue}>
                  {invoice.currency} {(invoice.shippingFee || 0).toFixed(2)}
                </Text>
              </View>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={[styles.grandTotalValue, { color: themeColor }]}>
                {invoice.currency} {invoice.total?.toFixed(2)}
              </Text>
            </View>
            {!!invoice.amountPaid && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Amount Paid</Text>
                <Text style={styles.totalValue}>
                  -{invoice.currency} {(invoice.amountPaid || 0).toFixed(2)}
                </Text>
              </View>
            )}
            {!!invoice.amountPaid && (
              <View style={[styles.grandTotalRow, { borderTopWidth: 1, borderTopColor: t.divider }]}>
                <Text style={styles.grandTotalLabel}>Amount Due</Text>
                <Text style={[styles.grandTotalValue, { color: themeColor }]}>
                  {invoice.currency} {(invoice.amountDue || 0).toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {(hasNotes || hasTerms || hasPayment || hasSignature) && (
          <View
            wrap={false}
            style={{ paddingHorizontal: 40, marginTop: 24, marginBottom: 72, flexDirection: "row", justifyContent: "space-between" }}
          >
            {(hasNotes || hasTerms || hasSignature) && (
              <View style={{ width: hasPayment ? "48%" : "100%" }}>
                {hasNotes && (
                  <View style={{ marginBottom: 14 }}>
                    <Text style={styles.blockTitle}>Notes</Text>
                    <Text style={styles.addressText}>{invoice.notes}</Text>
                  </View>
                )}
                {hasTerms && (
                  <View>
                    <Text style={styles.blockTitle}>Terms</Text>
                    <Text style={styles.addressText}>{invoice.terms}</Text>
                  </View>
                )}
                {hasSignature && (
                  <View wrap={false} style={{ marginTop: hasNotes || hasTerms ? 14 : 0 }}>
                    <Text style={styles.blockTitle}>Signature</Text>
                    <View style={{ marginTop: 6 }}>
                      {(() => {
                        const mode = invoice.signatureMode;
                        if (mode === "type") {
                          return invoice.signatureTyped ? (
                            <Text style={[styles.addressText, { fontSize: 16, fontStyle: "italic", color: t.bodyText }]}>
                              {invoice.signatureTyped}
                            </Text>
                          ) : null;
                        }
                        if (invoice.signature) return <Image src={invoice.signature} style={styles.signatureImage} />;
                        return invoice.signatureTyped ? (
                          <Text style={[styles.addressText, { fontSize: 16, fontStyle: "italic", color: t.bodyText }]}>
                            {invoice.signatureTyped}
                          </Text>
                        ) : null;
                      })()}
                    </View>
                    <View style={styles.divider} />
                    <Text style={styles.addressText}>{invoice.signatureRole || ""}</Text>
                  </View>
                )}
              </View>
            )}
            {hasPayment && (
              <View style={{ width: hasNotes || hasTerms || hasSignature ? "48%" : "100%" }}>
                {hasPayment && (
                  <View>
                    <Text style={styles.blockTitle}>Payment</Text>
                    {!!(invoice.paymentMethods && invoice.paymentMethods.length) && (
                      <View style={styles.kvRow}>
                        <Text style={styles.kvKey}>Methods</Text>
                        <Text style={styles.kvVal}>{invoice.paymentMethods.join(", ")}</Text>
                      </View>
                    )}
                    {!!invoice.paymentTerms && (
                      <View style={styles.kvRow}>
                        <Text style={styles.kvKey}>Terms</Text>
                        <Text style={styles.kvVal}>{String(invoice.paymentTerms)}</Text>
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
                      <View style={styles.kvRow}>
                        <Text style={styles.kvKey}>UPI</Text>
                        <Text style={styles.kvVal}>{bank.upi}</Text>
                      </View>
                    )}

                    {paymentMode === "upi" && bank?.upi && (invoice as any).upiQr && (
                      <View style={styles.qrBox}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                          <Text style={styles.addressText}>
                            Scan to pay {invoice.currency} {((invoice.amountDue ?? invoice.total) || 0).toFixed(2)}
                          </Text>
                        </View>
                        <Image src={(invoice as any).upiQr} style={styles.qrImage} />
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {showBottomBar && (
          <View fixed style={styles.bottomBar}>
            <View style={styles.bottomCol}>
              <Text style={[styles.bottomText, styles.bottomLeft]}>
                {invoice.showFooter !== false ? invoice.from?.businessName || "Thank you for your business." : ""}
              </Text>
            </View>
            <View style={styles.bottomCol}>
              {invoice.showPageNumbers ? (
                <Text style={[styles.bottomText, styles.bottomCenter]} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
              ) : (
                <Text style={[styles.bottomText, styles.bottomCenter]}>{""}</Text>
              )}
            </View>
            <View style={styles.bottomCol}>
              {invoice.showWatermark ? (
                <View style={{ alignItems: "flex-end" }}>
                  <Link src="https://invoiceforge.app" style={styles.bottomLink}>
                    Powered by InvoiceForge
                  </Link>
                </View>
              ) : (
                <Text style={[styles.bottomText, styles.bottomRight]}>{""}</Text>
              )}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
