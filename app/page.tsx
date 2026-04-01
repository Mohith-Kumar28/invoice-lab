"use client";

import { InvoiceForm } from "@/features/invoice-editor/components/InvoiceForm";
import { InvoicePreview } from "@/features/invoice-editor/components/InvoicePreview";
import { GlobalActions } from "@/features/invoice-editor/components/GlobalActions";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function InvoicePage() {
  return (
    <div className="fixed inset-0 top-14 flex flex-col md:flex-row overflow-hidden bg-background">
      {/* Left Panel - Form */}
      <div className="w-full md:w-1/2 h-full flex flex-col border-r border-border bg-muted/10">
        <GlobalActions />
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          <InvoiceForm />
        </div>
      </div>

      {/* Right Panel - Preview (Desktop) */}
      <div className="hidden md:flex w-full md:w-1/2 h-full bg-muted/30 items-center justify-center p-6 overflow-hidden">
        <InvoicePreview />
      </div>
      
      {/* Mobile Floating Preview Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Sheet>
          <SheetTrigger render={
            <button className="bg-primary text-primary-foreground shadow-lg rounded-full px-6 py-3 font-semibold">
              Preview PDF
            </button>
          } />
          <SheetContent side="bottom" className="h-[85vh] p-0 pt-8 rounded-t-xl flex flex-col">
            <div className="flex-1 overflow-hidden bg-muted/30 flex items-center justify-center p-2">
              <InvoicePreview />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
