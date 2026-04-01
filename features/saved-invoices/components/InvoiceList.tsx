"use client";

import { useSavedInvoicesStore } from "@/store/saved-invoices.store";
import { useInvoiceStore } from "@/store/invoice.store";
import { format } from "date-fns";
import { Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InvoiceList() {
  const { invoices, deleteInvoice, clearAllInvoices } = useSavedInvoicesStore();
  const { setInvoice } = useInvoiceStore();

  if (invoices.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full min-h-[200px]">
        <p>No saved invoices yet.</p>
        <p className="text-sm mt-2">Invoices will auto-save here as you edit them.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between p-4 border-b shrink-0">
        <h3 className="font-semibold text-lg">Saved Invoices</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete all saved invoices?')) {
              clearAllInvoices();
            }
          }}
        >
          Clear All
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {invoices.map((inv) => (
          <div key={inv.id} className="flex flex-col gap-2 p-4 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-base text-foreground">{inv.invoiceNumber || "Untitled"}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{inv.to?.businessName || "No Client Name"}</p>
                {inv.title && <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-1">{inv.title}</p>}
              </div>
              <div className="text-right">
                <p className="font-bold text-base text-foreground">{inv.currency} {inv.total?.toFixed(2) || "0.00"}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{inv.issueDate ? format(new Date(inv.issueDate), 'MMM d, yyyy') : 'No Date'}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
              <div className="text-xs text-muted-foreground">
                {inv.lineItems?.length || 0} items
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setInvoice(inv)} className="h-8">
                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                  Edit
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteInvoice(inv.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
