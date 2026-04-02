"use client";

import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import { PdfPreviewPane } from "@/components/pdf/PdfPreviewPane";
import { useInvoiceStore } from "@/features/invoice-editor/store/invoice.store";
import { type TemplateKey, templates } from "@/features/templates/renderers";
import { useDebounce } from "@/hooks/useDebounce";
import { usePdfBrand } from "@/hooks/usePdfBrand";
import { PREVIEW_DEBOUNCE_MS } from "@/lib/tool-defaults";

export function InvoicePreview() {
  const { invoice, updateInvoice } = useInvoiceStore();
  const debouncedInvoice = useDebounce(invoice, PREVIEW_DEBOUNCE_MS);
  const [upiQr, setUpiQr] = useState<string | undefined>(undefined);
  const pdfBrand = usePdfBrand();

  useEffect(() => {
    const upi = debouncedInvoice.bankDetails?.upi;
    const currency = debouncedInvoice.currency;
    const mode = debouncedInvoice.paymentMode;
    const amountCandidate =
      typeof debouncedInvoice.amountDue === "number" &&
      debouncedInvoice.amountDue > 0
        ? debouncedInvoice.amountDue
        : typeof debouncedInvoice.total === "number" &&
            debouncedInvoice.total > 0
          ? debouncedInvoice.total
          : 0;
    const amount = Number.isFinite(amountCandidate) ? amountCandidate : 0;

    if (mode !== "upi" || !upi || currency !== "INR" || !amount) {
      setUpiQr(undefined);
      return;
    }

    const pa = encodeURIComponent(upi.trim());
    const pn = encodeURIComponent(
      (debouncedInvoice.from?.businessName || "Invoice").trim(),
    );
    const am = encodeURIComponent(amount.toFixed(2));
    const tn = encodeURIComponent(
      (debouncedInvoice.invoiceNumber || "Invoice").trim(),
    );
    const uri = `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`;
    QRCode.toDataURL(uri, { margin: 0, width: 220 })
      .then((dataUrl: string) => setUpiQr(dataUrl))
      .catch(() => setUpiQr(undefined));
  }, [
    debouncedInvoice.paymentMode,
    debouncedInvoice.bankDetails?.upi,
    debouncedInvoice.currency,
    debouncedInvoice.amountDue,
    debouncedInvoice.total,
    debouncedInvoice.invoiceNumber,
    debouncedInvoice.from?.businessName,
  ]);

  const SelectedTemplate =
    templates[(debouncedInvoice.template as TemplateKey) || "modern"] ||
    templates.modern;
  const computedFileNameBase =
    `${invoice.invoiceNumber || "invoice"}_${invoice.to?.businessName || "client"}`.trim();
  const computedFileName = `${computedFileNameBase}.pdf`;
  const pdfDoc = useMemo(
    () => (
      <SelectedTemplate invoice={{ ...debouncedInvoice, upiQr, pdfBrand }} />
    ),
    [SelectedTemplate, debouncedInvoice, upiQr, pdfBrand],
  );

  return (
    <PdfPreviewPane
      document={pdfDoc}
      fileName={invoice.pdfFileName || ""}
      computedFileName={computedFileName}
      onFileNameChange={(v) => updateInvoice({ pdfFileName: v })}
      onFileNameBlur={() => {
        const v = (invoice.pdfFileName || "").trim();
        if (!v) return;
        const next = v.toLowerCase().endsWith(".pdf") ? v : `${v}.pdf`;
        if (next !== invoice.pdfFileName) updateInvoice({ pdfFileName: next });
      }}
    />
  );
}
