"use client";

import { useMemo } from "react";
import { PdfPreviewPane } from "@/components/pdf/PdfPreviewPane";
import { usePayslipStore } from "@/features/payslip-editor/store/payslip.store";
import { PayslipTemplate } from "@/features/payslip-editor/templates/PayslipTemplate";
import { useDebounce } from "@/hooks/useDebounce";
import { usePdfBrand } from "@/hooks/usePdfBrand";
import { PREVIEW_DEBOUNCE_MS } from "@/lib/tool-defaults";

function safeFileBase(s: string) {
  return String(s || "")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "_");
}

export function PayslipPreview() {
  const { payslip, updatePayslip } = usePayslipStore();
  const debouncedPayslip = useDebounce(payslip, PREVIEW_DEBOUNCE_MS);
  const pdfBrand = usePdfBrand();

  const month = String(payslip.payPeriod.month || "").padStart(2, "0");
  const base = safeFileBase(
    `${payslip.employee.employeeName || "employee"}_${payslip.payPeriod.year}-${month}`,
  );
  const computedFileName = `${base || "payslip"}.pdf`;

  const pdfDoc = useMemo(
    () => <PayslipTemplate payslip={{ ...debouncedPayslip, pdfBrand }} />,
    [debouncedPayslip, pdfBrand],
  );

  return (
    <PdfPreviewPane
      document={pdfDoc}
      fileName={payslip.pdfFileName || ""}
      computedFileName={computedFileName}
      onFileNameChange={(v) => updatePayslip({ pdfFileName: v })}
      onFileNameBlur={() => {
        const v = (payslip.pdfFileName || "").trim();
        if (!v) return;
        const next = v.toLowerCase().endsWith(".pdf") ? v : `${v}.pdf`;
        if (next !== payslip.pdfFileName) updatePayslip({ pdfFileName: next });
      }}
    />
  );
}
