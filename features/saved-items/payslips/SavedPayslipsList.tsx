"use client";

import { format } from "date-fns";
import { Copy, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayslipStore } from "@/features/payslip-editor/store/payslip.store";
import { SavedItemsList } from "@/features/saved-items/components/SavedItemsList";
import { useSavedPayslipsStore } from "@/features/saved-items/payslips/saved-payslips.store";
import { formatMoney } from "@/lib/format";

function monthLabel(m: number) {
  const map = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return map[m] || "";
}

export function SavedPayslipsList({ onSelect }: { onSelect?: () => void }) {
  const { items: payslips, deleteItem, clearAll, saveItem } =
    useSavedPayslipsStore();
  const { setPayslip } = usePayslipStore();

  return (
    <SavedItemsList
      title="Saved Payslips"
      emptyTitle="No saved payslips yet."
      emptyDescription="Payslips will auto-save here as you edit them."
      confirmClearAll="Are you sure you want to delete all saved payslips?"
      onClearAll={clearAll}
      isEmpty={payslips.length === 0}
    >
      {payslips.map((p) => {
        const period = `${monthLabel(p.payPeriod.month)} ${p.payPeriod.year}`;
        const updated = p.updatedAt
          ? format(new Date(p.updatedAt), "MMM d, yyyy")
          : "";
        return (
          <div
            key={p.id}
            className="flex flex-col gap-2 p-4 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start gap-6">
              <div className="min-w-0">
                <p className="font-bold text-base text-foreground truncate">
                  {p.employee.employeeName || "Untitled"}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5 truncate">
                  {p.employer.companyName || "No Company Name"}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-1">
                  {period}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-base text-foreground">
                  {formatMoney(p.netPay || 0, "INR")}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {updated || " "}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
              <div className="text-xs text-muted-foreground">
                {p.earnings?.length || 0} earnings • {p.deductions?.length || 0}{" "}
                deductions
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setPayslip(p);
                    onSelect?.();
                  }}
                  className="h-8"
                >
                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const next = structuredClone(p) as typeof p;
                    next.id = crypto.randomUUID();
                    saveItem(next as never);
                    setPayslip(next);
                    onSelect?.();
                  }}
                  className="h-8"
                >
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  Duplicate
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => deleteItem(p.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </SavedItemsList>
  );
}
