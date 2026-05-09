"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { ToolEditorLayout } from "@/components/tools/ToolEditorLayout";
import { PayslipActions } from "@/features/payslip-editor/components/PayslipActions";
import { PayslipForm } from "@/features/payslip-editor/components/PayslipForm";
import { PayslipPreview } from "@/features/payslip-editor/components/PayslipPreview";
import { decodePayslipFromUrlParam } from "@/features/payslip-editor/lib/share-payslip";
import { usePayslipStore } from "@/features/payslip-editor/store/payslip.store";
import type { Payslip } from "@/types/payslip.types";

type PayslipUpdate = Partial<
  Omit<Payslip, "employer" | "employee" | "payPeriod">
> & {
  employer?: Partial<Payslip["employer"]>;
  employee?: Partial<Payslip["employee"]>;
  payPeriod?: Partial<Payslip["payPeriod"]>;
};

export function PayslipGeneratorClient() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const appliedRef = useRef(false);
  const updatePayslip = usePayslipStore((s) => s.updatePayslip);

  useEffect(() => {
    if (appliedRef.current) return;
    const encoded = params.get("s");
    if (!encoded) return;
    const decoded = decodePayslipFromUrlParam(encoded);
    if (!decoded) return;
    appliedRef.current = true;
    updatePayslip(decoded as PayslipUpdate);
    const next = new URLSearchParams(params.toString());
    next.delete("s");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [params, updatePayslip, router, pathname]);

  return (
    <ToolEditorLayout mobilePreviewLabel="Download Payslip">
      <ToolEditorLayout.Actions>
        <PayslipActions />
      </ToolEditorLayout.Actions>
      <ToolEditorLayout.Form>
        <PayslipForm />
      </ToolEditorLayout.Form>
      <ToolEditorLayout.Preview>
        <PayslipPreview />
      </ToolEditorLayout.Preview>
    </ToolEditorLayout>
  );
}
