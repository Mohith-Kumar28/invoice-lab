"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { InvoiceForm } from "@/features/invoice-editor/components/InvoiceForm";
import { InvoicePreview } from "@/features/invoice-editor/components/InvoicePreview";
import { GlobalActions } from "@/features/invoice-editor/components/GlobalActions";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { decodeInvoiceFromUrlParam } from "@/lib/share-invoice";
import { useInvoiceStore } from "@/store/invoice.store";

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
    <div className="fixed inset-0 top-14 flex flex-col md:flex-row overflow-hidden bg-background">
      <div className="w-full md:w-1/2 h-full flex flex-col border-r border-border bg-muted/10">
        <GlobalActions />
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          <InvoiceForm />
        </div>
      </div>

      <div className="hidden md:flex w-full md:w-1/2 h-full bg-background overflow-hidden">
        <InvoicePreview />
      </div>

      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Sheet>
          <SheetTrigger
            render={
              <button className="bg-primary text-primary-foreground shadow-lg rounded-full px-6 py-3 font-semibold">
                Preview PDF
              </button>
            }
          />
          <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-xl flex flex-col">
            <div className="flex-1 overflow-hidden bg-background">
              <InvoicePreview />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

