import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type VisualProps = {
  className?: string;
};

function MiniLine({ className }: { className?: string }) {
  return <div className={cn("h-2 rounded-full bg-muted", className)} />;
}

function MiniPill({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-6 rounded-full border border-border/40 bg-background/70",
        className
      )}
    />
  );
}

function PrimaryWireButton({ label }: { label: string }) {
  return (
    <div
      className={cn(
        "h-7 rounded-full bg-primary text-primary-foreground px-3 text-[11px] font-medium flex items-center gap-2"
      )}
    >
      <span className="truncate">{label}</span>
      <ArrowRight className="h-3.5 w-3.5 opacity-90" />
    </div>
  );
}

export function InvoiceVisual({ className }: VisualProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute -inset-2 bg-[radial-gradient(500px_circle_at_40%_10%,hsl(var(--primary))/0.18,transparent_60%)] blur-xl" />
      <div className="relative rounded-2xl border border-border/40 bg-background/70 backdrop-blur shadow-sm">
        <div className="border-b border-border/40 p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-[linear-gradient(135deg,hsl(var(--primary))/0.25,transparent)] border border-border/40" />
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">Invoice</div>
              <div className="text-xs text-muted-foreground truncate">
                PDF export preview
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs rounded-full border border-border/40 px-2 py-1 bg-background/70">
              INV-0008
            </div>
            <div className="hidden sm:block">
              <PrimaryWireButton label="Generate invoice" />
            </div>
          </div>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <MiniLine className="w-32" />
              <MiniLine className="w-44" />
              <MiniLine className="w-40" />
            </div>
            <div className="space-y-2">
              <MiniLine className="w-24 ml-auto" />
              <MiniLine className="w-28 ml-auto" />
              <MiniLine className="w-20 ml-auto" />
            </div>
          </div>
          <div className="rounded-xl border border-border/40 bg-muted/10 overflow-hidden">
            <div className="grid grid-cols-12 gap-3 border-b border-border/40 bg-background/50 px-4 py-3 text-xs text-muted-foreground">
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-2 text-right">Rate</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            <div className="px-4 py-3 space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-3 items-center"
                >
                  <div className="col-span-6">
                    <MiniLine className="w-40" />
                  </div>
                  <div className="col-span-2">
                    <MiniLine className="w-10 ml-auto" />
                  </div>
                  <div className="col-span-2">
                    <MiniLine className="w-12 ml-auto" />
                  </div>
                  <div className="col-span-2">
                    <MiniLine className="w-14 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-2">
              <MiniPill className="w-28" />
              <MiniPill className="w-40" />
            </div>
            <div className="space-y-2">
              <MiniLine className="w-24 ml-auto" />
              <div className="h-9 rounded-lg border border-border/40 bg-[linear-gradient(135deg,hsl(var(--primary))/0.18,transparent)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PayslipVisual({ className }: VisualProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute -inset-2 bg-[radial-gradient(520px_circle_at_62%_10%,hsl(var(--secondary))/0.18,transparent_60%)] blur-xl" />
      <div className="relative rounded-2xl border border-border/40 bg-background/70 backdrop-blur shadow-sm">
        <div className="border-b border-border/40 p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">Payslip</div>
            <div className="text-xs text-muted-foreground truncate">
              Salary slip PDF preview
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs rounded-full border border-border/40 px-2 py-1 bg-background/70">
              Apr 2026
            </div>
            <div className="hidden sm:block">
              <PrimaryWireButton label="Generate payslip" />
            </div>
          </div>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4 space-y-2">
              <div className="text-xs text-muted-foreground">Employee</div>
              <MiniLine className="w-36" />
              <MiniLine className="w-28" />
              <MiniLine className="w-24" />
            </div>
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4 space-y-2">
              <div className="text-xs text-muted-foreground">Employer</div>
              <MiniLine className="w-36" />
              <MiniLine className="w-44" />
              <MiniLine className="w-20" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border/40 bg-background/50 overflow-hidden">
              <div className="border-b border-border/40 bg-muted/10 px-4 py-3 text-xs text-muted-foreground">
                Earnings
              </div>
              <div className="px-4 py-4 space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <MiniLine className="w-28" />
                    <MiniLine className="w-14" />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border/40 bg-background/50 overflow-hidden">
              <div className="border-b border-border/40 bg-muted/10 px-4 py-3 text-xs text-muted-foreground">
                Deductions
              </div>
              <div className="px-4 py-4 space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <MiniLine className="w-24" />
                    <MiniLine className="w-12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border/40 bg-[linear-gradient(135deg,hsl(var(--secondary))/0.12,transparent)] p-4">
            <div className="text-sm font-medium">Net pay</div>
            <div className="text-sm font-semibold tracking-tight">₹ 78,450</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QrCodeVisual({ className }: VisualProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute -inset-2 bg-[radial-gradient(520px_circle_at_42%_10%,hsl(var(--accent))/0.20,transparent_60%)] blur-xl" />
      <div className="relative rounded-2xl border border-border/40 bg-background/70 backdrop-blur shadow-sm">
        <div className="border-b border-border/40 p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">QR Generator</div>
            <div className="text-xs text-muted-foreground truncate">
              Style + logo ready
            </div>
          </div>
          <div className="hidden sm:block">
            <PrimaryWireButton label="Generate QR" />
          </div>
        </div>
        <div className="p-5 grid gap-5 sm:grid-cols-5 items-center">
          <div className="sm:col-span-3 space-y-3">
            <div className="flex flex-wrap gap-2">
              <MiniPill className="w-24" />
              <MiniPill className="w-20" />
              <MiniPill className="w-28" />
            </div>
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4 space-y-2">
              <MiniLine className="w-40" />
              <MiniLine className="w-52" />
              <MiniLine className="w-44" />
            </div>
            <div className="rounded-xl border border-border/40 bg-[linear-gradient(135deg,hsl(var(--accent))/0.10,transparent)] p-4">
              <div className="text-xs text-muted-foreground">Export</div>
              <div className="mt-2 flex gap-2">
                <MiniPill className="w-16" />
                <MiniPill className="w-16" />
                <MiniPill className="w-16" />
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            <div className="relative aspect-square rounded-2xl border border-border/40 bg-background/60 p-4">
              <div className="grid grid-cols-11 gap-1 h-full">
                {Array.from({ length: 121 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-[2px] bg-muted",
                      i % 3 === 0 ? "bg-foreground/80" : "",
                      i % 11 === 0 ? "bg-foreground/70" : ""
                    )}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-10 w-10 rounded-xl border border-border/40 bg-[linear-gradient(135deg,hsl(var(--primary))/0.18,transparent)] backdrop-blur" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
