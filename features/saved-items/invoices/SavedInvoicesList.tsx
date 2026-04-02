"use client";

import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInvoiceStore } from "@/features/invoice-editor/store/invoice.store";
import { SavedItemsList } from "@/features/saved-items/components/SavedItemsList";
import { useSavedInvoicesStore } from "@/features/saved-items/invoices/saved-invoices.store";
import { formatMoney } from "@/lib/format";

export function SavedInvoicesList({ onSelect }: { onSelect?: () => void }) {
  const { items: invoices, deleteItem, clearAll } = useSavedInvoicesStore();
  const { setInvoice } = useInvoiceStore();

  return (
    <SavedItemsList
      title="Saved Invoices"
      emptyTitle="No saved invoices yet."
      emptyDescription="Invoices will auto-save here as you edit them."
      confirmClearAll="Are you sure you want to delete all saved invoices?"
      onClearAll={clearAll}
      isEmpty={invoices.length === 0}
    >
      {invoices.map((inv) => (
        <div
          key={inv.id}
          className="flex flex-col gap-2 p-4 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-base text-foreground">
                {inv.invoiceNumber || "Untitled"}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {inv.to?.businessName || "No Client Name"}
              </p>
              {inv.title ? (
                <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-1">
                  {inv.title}
                </p>
              ) : null}
            </div>
            <div className="text-right">
              <p className="font-bold text-base text-foreground">
                {formatMoney(inv.total || 0, inv.currency)}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {inv.issueDate
                  ? format(new Date(inv.issueDate), "MMM d, yyyy")
                  : "No Date"}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
            <div className="text-xs text-muted-foreground">
              {inv.lineItems?.length || 0} items
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setInvoice(inv);
                  onSelect?.();
                }}
                className="h-8"
              >
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => deleteItem(inv.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </SavedItemsList>
  );
}
