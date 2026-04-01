"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useInvoiceStore } from "@/store/invoice.store";
import { useSavedInvoicesStore } from "@/store/saved-invoices.store";
import { FileDown, FilePlus, Archive, Check, Loader2 } from "lucide-react";
import { Invoice } from "@/types/invoice.types";
import { pdf } from '@react-pdf/renderer';
import { templates, TemplateKey } from "@/features/templates/renderers";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { InvoiceList } from "@/features/saved-invoices/components/InvoiceList";

export function GlobalActions() {
  const { invoice, resetInvoice, updateInvoice } = useInvoiceStore();
  const { saveInvoice } = useSavedInvoicesStore();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    if (!invoice.id) {
      updateInvoice({ id: crypto.randomUUID(), createdAt: new Date() });
      return;
    }

    setSaveStatus("saving");
    const timeoutId = setTimeout(() => {
      saveInvoice({
        ...invoice,
        updatedAt: new Date(),
      } as Invoice);
      setSaveStatus("saved");
      
      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [invoice, saveInvoice, updateInvoice]);

  const handleDownload = async () => {
    const SelectedTemplate = templates[(invoice.template as TemplateKey) || "modern"] || templates.modern;
    const blob = await pdf(<SelectedTemplate invoice={invoice} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.invoiceNumber || 'invoice'}_${invoice.to?.businessName || 'client'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur border-b border-border/40 p-4 flex items-center shadow-sm overflow-x-auto gap-2 no-scrollbar shrink-0">
      <div className="flex items-center space-x-2 shrink-0">
        <Sheet>
          <SheetTrigger render={
            <Button variant="outline">
              <Archive className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Saved Invoices</span>
            </Button>
          } />
          <SheetContent side="left" className="w-[400px] sm:w-[540px] p-0 flex flex-col">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>My Invoices</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              <InvoiceList />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center space-x-2 shrink-0 ml-auto pl-2">
        <div className="text-sm text-muted-foreground mr-2 flex items-center">
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
        </div>
        <Button variant="outline" onClick={resetInvoice}>
          <FilePlus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">New</span>
        </Button>
        <Button variant="default" onClick={handleDownload}>
          <FileDown className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Download PDF</span>
        </Button>
      </div>
    </div>
  );
}
