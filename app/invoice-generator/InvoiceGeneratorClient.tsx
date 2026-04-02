"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { ToolEditorLayout } from "@/components/tools/ToolEditorLayout";
import { GlobalActions } from "@/features/invoice-editor/components/GlobalActions";
import { InvoiceForm } from "@/features/invoice-editor/components/InvoiceForm";
import { InvoicePreview } from "@/features/invoice-editor/components/InvoicePreview";
import { decodeInvoiceFromUrlParam } from "@/features/invoice-editor/lib/share-invoice";
import { useInvoiceStore } from "@/features/invoice-editor/store/invoice.store";

export function InvoiceGeneratorClient() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const appliedRef = useRef(false);
  const setInvoice = useInvoiceStore((s) => s.setInvoice);

  useEffect(() => {
    if (appliedRef.current) return;
    const encoded = params.get("s");
    if (!encoded) return;
    const decoded = decodeInvoiceFromUrlParam(encoded);
    if (!decoded) return;
    appliedRef.current = true;
    setInvoice(decoded);
    const next = new URLSearchParams(params.toString());
    next.delete("s");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [params, setInvoice, router, pathname]);

  return (
    <ToolEditorLayout mobilePreviewLabel="Preview PDF">
      <ToolEditorLayout.Actions>
        <GlobalActions />
      </ToolEditorLayout.Actions>
      <ToolEditorLayout.Form>
        <InvoiceForm />
      </ToolEditorLayout.Form>
      <ToolEditorLayout.Preview>
        <InvoicePreview />
      </ToolEditorLayout.Preview>
    </ToolEditorLayout>
  );
}
