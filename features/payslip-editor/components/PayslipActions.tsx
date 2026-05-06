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
import { encodePayslipToUrlParam } from "@/features/payslip-editor/lib/share-payslip";
import { usePayslipStore } from "@/features/payslip-editor/store/payslip.store";
import { PayslipTemplate } from "@/features/payslip-editor/templates/PayslipTemplate";
import { SavedPayslipsList } from "@/features/saved-items/payslips/SavedPayslipsList";
import { useSavedPayslipsStore } from "@/features/saved-items/payslips/saved-payslips.store";
import { useAutoSave } from "@/hooks/useAutoSave";
import { usePdfBrand } from "@/hooks/usePdfBrand";
import { trackEvent } from "@/lib/analytics";
import type { Payslip } from "@/types/payslip.types";

export function PayslipActions() {
  const { payslip, resetPayslip, setErrors, clearErrors } = usePayslipStore();
  const { saveItem: savePayslip } = useSavedPayslipsStore();
  const [downloading, setDownloading] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const hasTrackedToolOpen = useRef(false);
  const pdfBrand = usePdfBrand();

  useEffect(() => {
    if (!payslip.id) resetPayslip();
  }, [payslip.id, resetPayslip]);

  useEffect(() => {
    if (hasTrackedToolOpen.current) return;
    hasTrackedToolOpen.current = true;
    trackEvent("tool_opened", {
      tool: "payslip_generator",
      path: typeof window !== "undefined" ? window.location.pathname : "",
    });
  }, []);

  const handleAutoSave = useCallback(
    (p: Payslip) => {
      savePayslip(p);
    },
    [savePayslip],
  );

  const saveStatus = useAutoSave({
    value: payslip,
    onSave: handleAutoSave,
    enabled: !!payslip.id,
  });

  const handleNew = () => {
    resetPayslip();
  };

  const buildShareUrl = () => {
    const u = new URL(window.location.href);
    u.searchParams.delete("s");
    const encoded = encodePayslipToUrlParam(payslip);
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
          await nav.share({ url, title: "Payslip" });
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

  const handleDownload = async () => {
    trackEvent("download_clicked", {
      tool: "payslip_generator",
      file_type: "pdf",
      path: typeof window !== "undefined" ? window.location.pathname : "",
    });

    const nextErrors: Record<string, string> = {};
    if (!payslip.employer.companyName?.trim())
      nextErrors["employer.companyName"] = "Company name is required.";
    if (!payslip.employee.employeeName?.trim())
      nextErrors["employee.employeeName"] = "Employee name is required.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      window.dispatchEvent(new CustomEvent("payslip:showErrors"));
      trackEvent("download_failed", {
        tool: "payslip_generator",
        file_type: "pdf",
        status: "validation_failed",
        error_type: "validation",
        path: typeof window !== "undefined" ? window.location.pathname : "",
      });
      return;
    }

    clearErrors();
    setDownloading(true);
    try {
      const doc = <PayslipTemplate payslip={{ ...payslip, pdfBrand }} />;
      const blob = await pdf(doc).toBlob();
      const base = payslip.pdfFileName?.trim() || "payslip";
      const safe = base.trim().replace(/[\\/:*?"<>|]+/g, "-");
      const fileName = safe.toLowerCase().endsWith(".pdf")
        ? safe
        : `${safe}.pdf`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      setTimeout(() => {
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 0);
      trackEvent("download_succeeded", {
        tool: "payslip_generator",
        file_type: "pdf",
        path: typeof window !== "undefined" ? window.location.pathname : "",
      });
    } catch {
      trackEvent("download_failed", {
        tool: "payslip_generator",
        file_type: "pdf",
        status: "generation_failed",
        error_type: "pdf_generation",
        path: typeof window !== "undefined" ? window.location.pathname : "",
      });
      setErrors({ general: "Failed to generate PDF. Please try again." });
      window.dispatchEvent(new CustomEvent("payslip:showErrors"));
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    const onPreviewDownload = () => {
      void handleDownload();
    };
    window.addEventListener("tool:previewDownload", onPreviewDownload);
    return () =>
      window.removeEventListener("tool:previewDownload", onPreviewDownload);
  }, [handleDownload]);

  return (
    <ToolActionsBar>
      <ToolActionsBar.Left>
        <Sheet open={savedOpen} onOpenChange={setSavedOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" size="sm">
                <Archive className="h-4 w-4" />
                <span className="sm:hidden">Saved</span>
                <span className="hidden sm:inline">Saved Payslips</span>
              </Button>
            }
          />
          <SheetContent
            side="left"
            className="w-[88vw] max-w-[540px] p-0 flex flex-col"
          >
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Last 50 Payslips</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              <SavedPayslipsList onSelect={() => setSavedOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </ToolActionsBar.Left>

      <ToolActionsBar.Middle>
        <div className="hidden md:flex text-sm text-muted-foreground items-center min-h-9 px-1">
          {saveStatus === "saving" ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Saving...
            </>
          ) : null}
          {saveStatus === "saved" ? (
            <>
              <Check className="h-4 w-4 mr-1 text-green-500" />
              Saved
            </>
          ) : null}
        </div>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={handleShare}
          aria-label="Share payslip"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </ToolActionsBar.Middle>
      <ToolActionsBar.Right>
        <Dialog open={shareOpen} onOpenChange={setShareOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share payslip</DialogTitle>
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
        <Button
          variant="default"
          size="sm"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4" />
          )}
          <span>Generate Payslip</span>
        </Button>
      </ToolActionsBar.Right>
    </ToolActionsBar>
  );
}
