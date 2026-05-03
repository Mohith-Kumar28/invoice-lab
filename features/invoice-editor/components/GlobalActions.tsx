"use client";

import { pdf } from "@react-pdf/renderer";
import {
  Archive,
  Check,
  Copy,
  FileDown,
  FilePlus,
  Loader2,
  Share2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToolActionsBar } from "@/components/tools/ToolActionsBar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { encodeInvoiceToUrlParam } from "@/features/invoice-editor/lib/share-invoice";
import { useInvoiceStore } from "@/features/invoice-editor/store/invoice.store";
import { SavedInvoicesList } from "@/features/saved-items/invoices/SavedInvoicesList";
import { useSavedInvoicesStore } from "@/features/saved-items/invoices/saved-invoices.store";
import { type TemplateKey, templates } from "@/features/templates/renderers";
import { useAutoSave } from "@/hooks/useAutoSave";
import { trackEvent } from "@/lib/analytics";
import { resolveCssVarColor } from "@/lib/css-vars";
import type { Invoice } from "@/types/invoice.types";

export function GlobalActions() {
  const { invoice, resetInvoice, updateInvoice, setErrors, clearErrors } =
    useInvoiceStore();
  const { saveItem: saveInvoice, items: invoices } = useSavedInvoicesStore();
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const hasTrackedToolOpen = useRef(false);

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
    }
  }, [invoice.id, updateInvoice]);

  useEffect(() => {
    if (hasTrackedToolOpen.current) return;
    hasTrackedToolOpen.current = true;
    trackEvent("tool_opened", {
      tool: "invoice_generator",
      path: typeof window !== "undefined" ? window.location.pathname : "",
    });
  }, []);

  const handleAutoSave = useCallback(
    (inv: Partial<Invoice>) => {
      saveInvoice(inv as Invoice);
    },
    [saveInvoice],
  );

  const saveStatus = useAutoSave({
    value: invoice,
    onSave: handleAutoSave,
    enabled: !!invoice.id,
  });

  const handleDownload = async () => {
    trackEvent("download_clicked", {
      tool: "invoice_generator",
      file_type: "pdf",
      template: invoice.template || "modern",
      currency: invoice.currency || "",
      line_items_count: (invoice.lineItems || []).length,
      path: typeof window !== "undefined" ? window.location.pathname : "",
    });

    const nextErrors: Record<string, string> = {};
    const email = invoice.from?.email || "";
    const hasEmail = !!email.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!invoice.invoiceNumber?.trim())
      nextErrors.invoiceNumber = "Invoice number is required.";
    if (!invoice.title?.trim()) nextErrors.title = "Invoice title is required.";
    if (!invoice.issueDate) nextErrors.issueDate = "Issue date is required.";
    if (!invoice.dueDate) nextErrors.dueDate = "Due date is required.";
    if (!invoice.currency) nextErrors.currency = "Currency is required.";
    if (!invoice.from?.businessName?.trim())
      nextErrors["from.businessName"] = "Business name is required.";
    if (hasEmail && !emailOk) nextErrors["from.email"] = "Enter a valid email.";
    if (!invoice.to?.businessName?.trim())
      nextErrors["to.businessName"] = "Client business name is required.";

    const items = invoice.lineItems || [];
    if (items.length === 0) {
      nextErrors.lineItems = "Add at least one line item.";
    } else if (
      items.some((i) => !i.description || !String(i.description).trim())
    ) {
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
      trackEvent("download_failed", {
        tool: "invoice_generator",
        file_type: "pdf",
        status: "validation_failed",
        error_type: "validation",
        path: typeof window !== "undefined" ? window.location.pathname : "",
      });
      return;
    }

    clearErrors();
    try {
      const SelectedTemplate =
        templates[(invoice.template as TemplateKey) || "modern"] ||
        templates.modern;
      const pdfBrand = {
        primary: resolveCssVarColor("--primary") || "rgb(0, 56, 224)",
        secondary: resolveCssVarColor("--secondary") || "rgb(255, 255, 0)",
        accent: resolveCssVarColor("--accent") || "rgb(55, 65, 81)",
      };
      const blob = await pdf(
        <SelectedTemplate invoice={{ ...invoice, pdfBrand }} />,
      ).toBlob();
      const base =
        invoice.pdfFileName?.trim() ||
        `${invoice.invoiceNumber || "invoice"}_${invoice.to?.businessName || "client"}`;
      const safe = base.trim().replace(/[\\/:*?"<>|]+/g, "-");
      const fileName = safe.toLowerCase().endsWith(".pdf")
        ? safe
        : `${safe}.pdf`;

      const nav = navigator as Navigator & { maxTouchPoints?: number };

      const ua =
        typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
      const isIOS =
        /iPad|iPhone|iPod/.test(ua) ||
        (ua.includes("Mac") && (nav.maxTouchPoints || 0) > 1);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.rel = "noopener noreferrer";

      if (isIOS) {
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 30_000);
        trackEvent("download_succeeded", {
          tool: "invoice_generator",
          file_type: "pdf",
          template: invoice.template || "modern",
          path: typeof window !== "undefined" ? window.location.pathname : "",
        });
        return;
      }

      document.body.appendChild(link);
      setTimeout(() => {
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 0);
      trackEvent("download_succeeded", {
        tool: "invoice_generator",
        file_type: "pdf",
        template: invoice.template || "modern",
        path: typeof window !== "undefined" ? window.location.pathname : "",
      });
    } catch {
      trackEvent("download_failed", {
        tool: "invoice_generator",
        file_type: "pdf",
        status: "generation_failed",
        error_type: "pdf_generation",
        path: typeof window !== "undefined" ? window.location.pathname : "",
      });
      setErrors({ general: "Failed to generate PDF. Please try again." });
      window.dispatchEvent(new CustomEvent("invoice:showErrors"));
    }
  };

  const handleNew = () => {
    const nextInvoiceNumber = getNextInvoiceNumber();
    resetInvoice();
    updateInvoice({ invoiceNumber: nextInvoiceNumber, createdAt: new Date() });
  };

  const buildShareUrl = () => {
    const u = new URL(window.location.href);
    u.searchParams.delete("s");
    const encoded = encodeInvoiceToUrlParam(invoice);
    u.searchParams.set("s", encoded);
    u.hash = "";
    return u.toString();
  };

  const handleShare = async () => {
    const url = buildShareUrl();
    setShareUrl(url);
    setCopied(false);
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        const nav = navigator as Navigator & {
          share?: (data: ShareData) => Promise<void>;
        };
        if (typeof nav.share === "function") {
          await nav.share({ url, title: "Invoice" });
        }
        return;
      } catch {}
    }
    setShareOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <ToolActionsBar>
      <ToolActionsBar.Left>
        <Sheet open={savedOpen} onOpenChange={setSavedOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" size="sm">
                <Archive className="h-4 w-4" />
                <span className="sm:hidden">Saved</span>
                <span className="hidden sm:inline">Saved Invoices</span>
              </Button>
            }
          />
          <SheetContent
            side="left"
            className="w-[88vw] max-w-[540px] p-0 flex flex-col"
          >
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Last 50 Invoices</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              <SavedInvoicesList onSelect={() => setSavedOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </ToolActionsBar.Left>
      <ToolActionsBar.Middle>
        <div className="hidden md:flex text-sm text-muted-foreground items-center min-h-9 px-1">
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
          {saveStatus === "idle" ? (
            <span className="opacity-0">Saved</span>
          ) : null}
        </div>
        <Button
          variant="outline"
          onClick={handleShare}
          size="icon-sm"
          aria-label="Share invoice"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </ToolActionsBar.Middle>
      <ToolActionsBar.Right>
        <Dialog open={shareOpen} onOpenChange={setShareOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share invoice</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Input readOnly value={shareUrl} />
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Close
              </DialogClose>
              <Button onClick={handleCopy} variant="default">
                {copied ? (
                  <Check className="h-4 w-4 sm:mr-2" />
                ) : (
                  <Copy className="h-4 w-4 sm:mr-2" />
                )}
                <span>{copied ? "Copied" : "Copy link"}</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="secondary" size="sm" onClick={handleNew}>
          <FilePlus className="h-4 w-4" />
          <span>New</span>
        </Button>
        <Button variant="default" size="sm" onClick={handleDownload}>
          <FileDown className="h-4 w-4" />
          <span>Download</span>
        </Button>
      </ToolActionsBar.Right>
    </ToolActionsBar>
  );
}
