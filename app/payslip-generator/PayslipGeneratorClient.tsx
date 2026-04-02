"use client";

import { ToolEditorLayout } from "@/components/tools/ToolEditorLayout";
import { PayslipActions } from "@/features/payslip-editor/components/PayslipActions";
import { PayslipForm } from "@/features/payslip-editor/components/PayslipForm";
import { PayslipPreview } from "@/features/payslip-editor/components/PayslipPreview";

export function PayslipGeneratorClient() {
  return (
    <ToolEditorLayout mobilePreviewLabel="Preview PDF">
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
