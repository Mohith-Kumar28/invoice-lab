"use client";

import { AlertTriangle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { calculateLineItemAmount } from "@/features/invoice-editor/lib/invoice-calculator";
import { useInvoiceStore } from "@/features/invoice-editor/store/invoice.store";
import { formatMoney } from "@/lib/format";

export function LineItemsTable() {
  const { invoice, updateInvoice, errors } = useInvoiceStore();

  const addItem = () => {
    const newItem = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    };
    updateInvoice({ lineItems: [...(invoice.lineItems || []), newItem] });
  };

  const removeItem = (index: number) => {
    const updatedItems = [...(invoice.lineItems || [])];
    updatedItems.splice(index, 1);
    updateInvoice({ lineItems: updatedItems });
  };

  const updateItem = (index: number, field: string, value: unknown) => {
    const updatedItems = [...(invoice.lineItems || [])];
    const item = { ...updatedItems[index], [field]: value };
    item.amount = calculateLineItemAmount(item);
    updatedItems[index] = item;
    updateInvoice({ lineItems: updatedItems });
  };

  return (
    <div id="lineItemsSection" className="space-y-4">
      {errors.lineItems ? (
        <div className="text-sm text-secondary-foreground border border-secondary bg-secondary rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>{errors.lineItems}</div>
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-border/50 text-muted-foreground text-left">
              <th className="pb-2 font-medium w-[45%]">Item</th>
              <th className="pb-2 font-medium w-[15%] text-right">Qty</th>
              <th className="pb-2 font-medium w-[15%] text-right">Price</th>
              <th className="pb-2 font-medium w-[15%] text-right">Amount</th>
              <th className="pb-2 font-medium w-[10%]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {invoice.lineItems?.map((item, index) => (
              <tr key={item.id || index}>
                <td className="py-2 pr-2">
                  <div className="space-y-2">
                    <Input
                      placeholder="Item name"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(index, "description", e.target.value)
                      }
                    />
                    <Textarea
                      placeholder="Description (optional)"
                      rows={2}
                      className="min-h-[64px] resize-y"
                      value={item.details || ""}
                      onChange={(e) =>
                        updateItem(index, "details", e.target.value)
                      }
                    />
                  </div>
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    className="text-right"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", Number(e.target.value))
                    }
                  />
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    className="text-right"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(index, "unitPrice", Number(e.target.value))
                    }
                  />
                </td>
                <td className="py-2 pl-2 text-right font-medium">
                  {formatMoney(item.amount || 0, invoice.currency)}
                </td>
                <td className="py-2 pl-2 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full border-dashed"
        onClick={addItem}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </Button>
    </div>
  );
}
