"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { ToolEditorLayout } from "@/components/tools/ToolEditorLayout";
import { QrCodeActions } from "@/features/qr-code-editor/components/QrCodeActions";
import { QrCodeForm } from "@/features/qr-code-editor/components/QrCodeForm";
import { QrCodePreview } from "@/features/qr-code-editor/components/QrCodePreview";
import { decodeQrFromUrlParam } from "@/features/qr-code-editor/lib/share-qr";
import { useQrCodeStore } from "@/features/qr-code-editor/store/qr-code.store";
import type { QrCodeDoc } from "@/features/qr-code-editor/types/qr-code.types";

export function QrCodeGeneratorClient() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const appliedRef = useRef(false);
  const doc = useQrCodeStore((s) => s.doc);
  const setDoc = useQrCodeStore((s) => s.setDoc);

  useEffect(() => {
    if (appliedRef.current) return;
    const encoded = params.get("s");
    if (!encoded) return;
    const decoded = decodeQrFromUrlParam(encoded);
    if (!decoded) return;
    appliedRef.current = true;
    setDoc({
      ...doc,
      ...decoded,
      style: { ...doc.style, ...(decoded.style || {}) },
    } as QrCodeDoc);
    const next = new URLSearchParams(params.toString());
    next.delete("s");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [params, setDoc, router, pathname, doc]);

  return (
    <ToolEditorLayout mobilePreviewLabel="Download QR">
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
