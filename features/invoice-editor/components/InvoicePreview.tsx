"use client";

import { useState, useEffect } from "react";
import { useInvoiceStore } from "@/store/invoice.store";
import { templates, TemplateKey } from "@/features/templates/renderers";
import dynamic from "next/dynamic";
import { ExternalLink, Loader2 } from "lucide-react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Use usePDF hook instead of PDFViewer to avoid flickering and guarantee updates
const PdfRenderer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => {
    const { usePDF } = mod;
    return function PdfWrapper({
      document: doc,
      onUrl,
    }: {
      document: any;
      onUrl?: (url?: string) => void;
    }) {
      const [instance, update] = usePDF({ document: doc });
      
      useEffect(() => {
        update(doc);
      }, [doc, update]);

      useEffect(() => {
        onUrl?.(instance.url || undefined);
      }, [instance.url, onUrl]);

      if (instance.loading) {
        return (
          <div className="flex h-full w-full items-center justify-center bg-muted/5">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        );
      }

      if (instance.error) {
        return <div className="p-4 text-destructive">Error rendering PDF</div>;
      }

      const src = instance.url || "";

      return (
        <iframe
          key={instance.url || "pdf"}
          src={src}
          className="border-none w-full h-full" 
          style={{ minHeight: '500px' }}
        />
      );
    };
  }),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-muted/5">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

function resolveCssVarColor(varName: string) {
  if (typeof document === "undefined") return undefined;
  const el = document.createElement("div");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  el.style.top = "-9999px";
  el.style.color = `var(${varName})`;
  document.body.appendChild(el);
  const color = getComputedStyle(el).color;
  document.body.removeChild(el);
  return color || undefined;
}

function resolvePdfBrand() {
  const primary = resolveCssVarColor("--primary") || "rgb(0, 56, 224)";
  const secondary = resolveCssVarColor("--secondary") || "rgb(255, 255, 0)";
  const accent = resolveCssVarColor("--accent") || "rgb(55, 65, 81)";
  return { primary, secondary, accent };
}

export function InvoicePreview() {
  const { invoice, updateInvoice } = useInvoiceStore();
  const debouncedInvoice = useDebounce(invoice, 2000);
  const [upiQr, setUpiQr] = useState<string | undefined>(undefined);
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined);
  const [pdfBrand, setPdfBrand] = useState(() => resolvePdfBrand());

  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    const obs = new MutationObserver(() => setPdfBrand(resolvePdfBrand()));
    obs.observe(el, { attributes: true, attributeFilter: ["class", "style"] });
    setPdfBrand(resolvePdfBrand());
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const upi = debouncedInvoice.bankDetails?.upi;
    const currency = debouncedInvoice.currency;
    const mode = debouncedInvoice.paymentMode;
    const amountCandidate =
      typeof debouncedInvoice.amountDue === "number" && debouncedInvoice.amountDue > 0
        ? debouncedInvoice.amountDue
        : typeof debouncedInvoice.total === "number" && debouncedInvoice.total > 0
          ? debouncedInvoice.total
          : 0;
    const amount = Number.isFinite(amountCandidate) ? amountCandidate : 0;

    if (mode !== "upi" || !upi || currency !== "INR" || !amount) {
      setUpiQr(undefined);
      return;
    }

    const pa = encodeURIComponent(upi.trim());
    const pn = encodeURIComponent((debouncedInvoice.from?.businessName || "Invoice").trim());
    const am = encodeURIComponent(amount.toFixed(2));
    const tn = encodeURIComponent((debouncedInvoice.invoiceNumber || "Invoice").trim());
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

  const SelectedTemplate = templates[(debouncedInvoice.template as TemplateKey) || "modern"] || templates.modern;
  const computedFileNameBase = `${invoice.invoiceNumber || "invoice"}_${invoice.to?.businessName || "client"}`.trim();
  const computedFileName = `${computedFileNameBase}.pdf`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 md:p-4">
      <div className="w-full h-full max-w-[800px] shadow-2xl rounded-xl overflow-hidden bg-white border border-border">
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-b bg-background/80 backdrop-blur">
          <div className="flex-1 min-w-0">
            <Input
              value={invoice.pdfFileName || ""}
              placeholder={computedFileName}
              onChange={(e) => updateInvoice({ pdfFileName: e.target.value })}
              onBlur={() => {
                const v = (invoice.pdfFileName || "").trim();
                if (!v) return;
                const next = v.toLowerCase().endsWith(".pdf") ? v : `${v}.pdf`;
                if (next !== invoice.pdfFileName) updateInvoice({ pdfFileName: next });
              }}
              className="h-8"
            />
          </div>
          <div className="flex items-center gap-2">
            {pdfUrl ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(pdfUrl, "_blank", "noopener,noreferrer")}
              >
                <ExternalLink className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Open</span>
              </Button>
            ) : null}
          </div>
        </div>
        <PdfRenderer
          onUrl={setPdfUrl}
          document={<SelectedTemplate invoice={{ ...debouncedInvoice, upiQr, pdfBrand }} />}
        />
      </div>
    </div>
  );
}
