"use client";

import { pdf } from "@react-pdf/renderer";
import { Archive, Check, FileDown, FilePlus, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePayslipStore } from "@/features/payslip-editor/store/payslip.store";
import { PayslipTemplate } from "@/features/payslip-editor/templates/PayslipTemplate";
import { SavedPayslipsList } from "@/features/saved-items/payslips/SavedPayslipsList";
import { useSavedPayslipsStore } from "@/features/saved-items/payslips/saved-payslips.store";
import { useAutoSave } from "@/hooks/useAutoSave";
import { trackEvent } from "@/lib/analytics";
import { usePdfBrand } from "@/hooks/usePdfBrand";
import type { Payslip } from "@/types/payslip.types";

export function PayslipActions() {
  const { payslip, resetPayslip, setErrors, clearErrors } = usePayslipStore();
  const { saveItem: savePayslip } = useSavedPayslipsStore();
  const [downloading, setDownloading] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const pdfBrand = usePdfBrand();

  useEffect(() => {
    if (!payslip.id) resetPayslip();
  }, [payslip.id, resetPayslip]);

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
    } catch {
      setErrors({ general: "Failed to generate PDF. Please try again." });
      window.dispatchEvent(new CustomEvent("payslip:showErrors"));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur border-b border-border/40 p-3 sm:p-4 flex items-center shadow-sm overflow-x-auto gap-2 no-scrollbar shrink-0">
      <div className="flex items-center space-x-2 shrink-0">
        <Sheet open={savedOpen} onOpenChange={setSavedOpen}>
          <SheetTrigger
            render={
              <Button variant="outline">
                <Archive className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Saved Payslips</span>
              </Button>
            }
          />
          <SheetContent
            side="left"
            className="w-[400px] sm:w-[540px] p-0 flex flex-col"
          >
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Last 50 Payslips</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              <SavedPayslipsList onSelect={() => setSavedOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2 shrink-0 ml-auto pl-2">
        <div className="text-sm text-muted-foreground mr-2 flex items-center">
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
        <Button variant="secondary" onClick={handleNew}>
          <FilePlus className="h-4 w-4 sm:mr-2" />
          <span>New</span>
        </Button>
        <Button
          variant="default"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4 sm:mr-2" />
          )}
          <span>Generate Payslip</span>
        </Button>
      </div>
    </div>
  );
}
