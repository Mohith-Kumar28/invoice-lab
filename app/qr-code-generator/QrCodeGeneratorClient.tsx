"use client";

import { ToolEditorLayout } from "@/components/tools/ToolEditorLayout";
import { QrCodeActions } from "@/features/qr-code-editor/components/QrCodeActions";
import { QrCodeForm } from "@/features/qr-code-editor/components/QrCodeForm";
import { QrCodePreview } from "@/features/qr-code-editor/components/QrCodePreview";

export function QrCodeGeneratorClient() {
  return (
    <ToolEditorLayout mobilePreviewLabel="Preview QR">
      <ToolEditorLayout.Actions>
        <QrCodeActions />
      </ToolEditorLayout.Actions>
      <ToolEditorLayout.Form>
        <QrCodeForm />
      </ToolEditorLayout.Form>
      <ToolEditorLayout.Preview>
        <QrCodePreview />
      </ToolEditorLayout.Preview>
    </ToolEditorLayout>
  );
}

