"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useInvoiceStore } from "@/store/invoice.store";
import { useSavedInvoicesStore } from "@/store/saved-invoices.store";
import { FileDown, FilePlus, Archive, Check, Loader2 } from "lucide-react";
import { Invoice } from "@/types/invoice.types";
import { pdf } from '@react-pdf/renderer';
import { templates, TemplateKey } from "@/features/templates/renderers";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { InvoiceList } from "@/features/saved-invoices/components/InvoiceList";

export function GlobalActions() {
  const { invoice, resetInvoice, updateInvoice, setErrors, clearErrors } = useInvoiceStore();
  const { saveInvoice, invoices } = useSavedInvoicesStore();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const getNextInvoiceNumber = () => {
    let max = 0;
    let prefix = "INV-";
    let pad = 4;

    for (const inv of invoices) {
      const s = String(inv.invoiceNumber || "").trim();
      if (!s) continue;
      const m = s.match(/^(.*?)(\d+)\s*$/);
      if (!m) continue;
      const p = m[1];
      const n = Number.parseInt(m[2], 10);
      if (!Number.isFinite(n)) continue;
      if (n >= max) {
        max = n;
        prefix = p || prefix;
        pad = Math.max(pad, m[2].length);
      } else {
        pad = Math.max(pad, m[2].length);
      }
    }

    const next = max + 1;
    return `${prefix}${String(next).padStart(pad, "0")}`;
  };

  useEffect(() => {
    if (!invoice.id) {
      updateInvoice({ id: crypto.randomUUID(), createdAt: new Date() });
      return;
    }

    setSaveStatus("saving");
    const timeoutId = setTimeout(() => {
      saveInvoice({
        ...invoice,
        updatedAt: new Date(),
      } as Invoice);
      setSaveStatus("saved");
      
      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [invoice, saveInvoice, updateInvoice]);

  const handleDownload = async () => {
    const nextErrors: Record<string, string> = {};
    const email = invoice.from?.email || "";
    const hasEmail = !!email.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!invoice.invoiceNumber?.trim()) nextErrors.invoiceNumber = "Invoice number is required.";
    if (!invoice.title?.trim()) nextErrors.title = "Invoice title is required.";
    if (!invoice.issueDate) nextErrors.issueDate = "Issue date is required.";
    if (!invoice.dueDate) nextErrors.dueDate = "Due date is required.";
    if (!invoice.currency) nextErrors.currency = "Currency is required.";
    if (!invoice.from?.businessName?.trim()) nextErrors["from.businessName"] = "Business name is required.";
    if (!hasEmail) nextErrors["from.email"] = "Email is required.";
    if (hasEmail && !emailOk) nextErrors["from.email"] = "Enter a valid email.";
    if (!invoice.to?.businessName?.trim()) nextErrors["to.businessName"] = "Client business name is required.";

    const items = invoice.lineItems || [];
    if (items.length === 0) {
      nextErrors.lineItems = "Add at least one line item.";
    } else if (items.some((i) => !i.description || !String(i.description).trim())) {
      nextErrors.lineItems = "Each line item must have a description.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      window.dispatchEvent(new CustomEvent("invoice:showErrors"));
      const focusMap: Record<string, string> = {
        invoiceNumber: "invoiceNumber",
        title: "invoiceTitlePreset",
        issueDate: "issueDateField",
        dueDate: "dueDateField",
        currency: "currencyField",
        "from.businessName": "fromBusinessName",
        "from.email": "fromEmail",
        "to.businessName": "toBusinessName",
        lineItems: "lineItemsSection",
      };
      const firstKey = Object.keys(nextErrors)[0];
      const elId = focusMap[firstKey];
      if (elId) {
        const el = document.getElementById(elId);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    clearErrors();
    try {
      const SelectedTemplate = templates[(invoice.template as TemplateKey) || "modern"] || templates.modern;
      const resolveCssVarColor = (varName: string) => {
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
      };
      const pdfBrand = {
        primary: resolveCssVarColor("--primary") || "rgb(0, 56, 224)",
        secondary: resolveCssVarColor("--secondary") || "rgb(255, 255, 0)",
        accent: resolveCssVarColor("--accent") || "rgb(55, 65, 81)",
      };
      const blob = await pdf(<SelectedTemplate invoice={{ ...invoice, pdfBrand }} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const base =
        (invoice.pdfFileName && invoice.pdfFileName.trim()) ||
        `${invoice.invoiceNumber || "invoice"}_${invoice.to?.businessName || "client"}`;
      const safe = base.trim().replace(/[\\/:*?"<>|]+/g, "-");
      link.download = safe.toLowerCase().endsWith(".pdf") ? safe : `${safe}.pdf`;
      document.body.appendChild(link);
      setTimeout(() => {
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 0);
    } catch {
      setErrors({ general: "Failed to generate PDF. Please try again." });
      window.dispatchEvent(new CustomEvent("invoice:showErrors"));
    }
  };

  const handleNew = () => {
    const nextInvoiceNumber = getNextInvoiceNumber();
    resetInvoice();
    updateInvoice({ invoiceNumber: nextInvoiceNumber, createdAt: new Date() });
  };

  return (
    <div className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur border-b border-border/40 p-3 sm:p-4 flex items-center shadow-sm overflow-x-auto gap-2 no-scrollbar shrink-0">
      <div className="flex items-center space-x-2 shrink-0">
        <Sheet>
          <SheetTrigger render={
            <Button variant="outline">
              <Archive className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Saved Invoices</span>
            </Button>
          } />
          <SheetContent side="left" className="w-[400px] sm:w-[540px] p-0 flex flex-col">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>My Invoices</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              <InvoiceList />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2 shrink-0 ml-auto pl-2">
        <div className="text-sm text-muted-foreground mr-2 flex items-center">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Saving...
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Check className="h-4 w-4 mr-1 text-green-500" />
              Saved
            </>
          )}
        </div>
        <Button variant="secondary" onClick={handleNew}>
          <FilePlus className="h-4 w-4 sm:mr-2" />
          <span>New</span>
        </Button>
        <Button variant="default" onClick={handleDownload}>
          <FileDown className="h-4 w-4 sm:mr-2" />
          <span className="sm:hidden">Download</span>
          <span className="hidden sm:inline">Download PDF</span>
        </Button>
      </div>
    </div>
  );
}
