"use client";

import { Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { HexColorPicker } from "react-colorful";
import { DatePicker } from "@/components/shared/DatePicker";
import { ImagePicker } from "@/components/shared/ImagePicker";
import { SignatureSection } from "@/components/shared/SignatureSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { usePayslipStore } from "@/features/payslip-editor/store/payslip.store";
import { formatMoney } from "@/lib/format";
import type { PayslipTemplateKey, TaxRegime } from "@/types/payslip.types";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <div className="text-xs text-destructive mt-1">{message}</div>;
}

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export function PayslipForm() {
  const { payslip, updatePayslip, errors, setErrors, clearErrors } =
    usePayslipStore();
  const allSections = [
    "employer",
    "employee",
    "period",
    "earnings",
    "deductions",
    "summary",
    "signature",
    "design",
  ];
  const [openSections, setOpenSections] = React.useState<string[]>(allSections);

  React.useEffect(() => {
    const handler = () => setOpenSections(allSections);
    window.addEventListener("payslip:showErrors", handler);
    return () => window.removeEventListener("payslip:showErrors", handler);
  }, []);

  const addEarning = () => {
    updatePayslip({
      earnings: [
        ...payslip.earnings,
        { id: crypto.randomUUID(), name: "", amount: 0 },
      ],
    });
  };

  const addDeduction = () => {
    updatePayslip({
      deductions: [
        ...payslip.deductions,
        { id: crypto.randomUUID(), name: "", amount: 0 },
      ],
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Payslip Details</h1>
      </div>

      <Accordion
        multiple
        value={openSections}
        onValueChange={(val) => setOpenSections(val as string[])}
        className="w-full space-y-12"
      >
        <AccordionItem
          value="employer"
          className="bg-card rounded-xl border px-4 shadow-sm"
        >
          <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
            1. Employer Details
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={payslip.employer.companyName}
                  placeholder="e.g., InvoiceLabs Pvt. Ltd."
                  onChange={(e) =>
                    updatePayslip({ employer: { companyName: e.target.value } })
                  }
                  aria-invalid={!!errors["employer.companyName"]}
                />
                <FieldError message={errors["employer.companyName"]} />
              </div>
              <div className="space-y-2">
                <Label>Company Address</Label>
                <Input
                  value={payslip.employer.companyAddress}
                  placeholder="e.g., Bangalore, Karnataka"
                  onChange={(e) =>
                    updatePayslip({
                      employer: { companyAddress: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Company Logo (Optional)</Label>
                <ImagePicker
                  accept="image/png,image/svg+xml,image/jpeg"
                  value={payslip.employer.logo}
                  fileLabel="Upload logo"
                  maxSizeBytes={2 * 1024 * 1024}
                  onError={(message) => {
                    setErrors({
                      ...errors,
                      "employer.logo":
                        message === "File is too large."
                          ? "Logo must be 2MB or smaller."
                          : "Failed to load logo.",
                    });
                    window.dispatchEvent(new CustomEvent("payslip:showErrors"));
                  }}
                  onChange={(next) => {
                    clearErrors(["employer.logo"]);
                    updatePayslip({ employer: { logo: next } });
                  }}
                />
                <div className="text-xs text-muted-foreground">
                  Max size: 2MB. Recommended: PNG or SVG with transparent
                  background.
                </div>
                <FieldError message={errors["employer.logo"]} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="employee"
          className="bg-card rounded-xl border px-4 shadow-sm"
        >
          <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
            2. Employee Details
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employee Name</Label>
                <Input
                  value={payslip.employee.employeeName}
                  placeholder="e.g., Babajan Patan"
                  onChange={(e) =>
                    updatePayslip({
                      employee: { employeeName: e.target.value },
                    })
                  }
                  aria-invalid={!!errors["employee.employeeName"]}
                />
                <FieldError message={errors["employee.employeeName"]} />
              </div>
              <div className="space-y-2">
                <Label>Employee Code</Label>
                <Input
                  value={payslip.employee.employeeCode}
                  placeholder="e.g., 29"
                  onChange={(e) =>
                    updatePayslip({
                      employee: { employeeCode: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>UAN</Label>
                <Input
                  value={payslip.employee.uan}
                  placeholder="e.g., 123456789000"
                  onChange={(e) =>
                    updatePayslip({ employee: { uan: e.target.value } })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Date of Joining</Label>
                <DatePicker
                  date={
                    payslip.employee.dateOfJoining
                      ? new Date(payslip.employee.dateOfJoining)
                      : undefined
                  }
                  setDate={(date) =>
                    updatePayslip({ employee: { dateOfJoining: date } })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>PAN Number</Label>
                <Input
                  value={payslip.employee.panNumber}
                  placeholder="e.g., ABCDE1234F"
                  onChange={(e) =>
                    updatePayslip({ employee: { panNumber: e.target.value } })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  value={payslip.employee.department}
                  placeholder="e.g., Engineering"
                  onChange={(e) =>
                    updatePayslip({ employee: { department: e.target.value } })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input
                  value={payslip.employee.bankName}
                  placeholder="e.g., HDFC Bank"
                  onChange={(e) =>
                    updatePayslip({ employee: { bankName: e.target.value } })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Bank Account Number</Label>
                <Input
                  value={payslip.employee.bankAccountNumber}
                  placeholder="e.g., XXXX1234"
                  onChange={(e) =>
                    updatePayslip({
                      employee: { bankAccountNumber: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="period"
          className="bg-card rounded-xl border px-4 shadow-sm"
        >
          <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
            3. Pay Period &amp; Leave
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select
                  value={String(payslip.payPeriod.month)}
                  onValueChange={(val) =>
                    updatePayslip({ payPeriod: { month: Number(val) } })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={String(m.value)}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  type="number"
                  value={payslip.payPeriod.year}
                  placeholder="e.g., 2026"
                  onChange={(e) =>
                    updatePayslip({
                      payPeriod: { year: Number(e.target.value || 0) },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Payable Days</Label>
                <Input
                  type="number"
                  value={payslip.payPeriod.payableDays}
                  placeholder="e.g., 30"
                  onChange={(e) =>
                    updatePayslip({
                      payPeriod: { payableDays: Number(e.target.value || 0) },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Leave Balance</Label>
                <Input
                  type="number"
                  value={payslip.payPeriod.leaveBalance}
                  placeholder="e.g., 0"
                  onChange={(e) =>
                    updatePayslip({
                      payPeriod: { leaveBalance: Number(e.target.value || 0) },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>LOP Days</Label>
                <Input
                  type="number"
                  value={payslip.payPeriod.lopDays}
                  placeholder="e.g., 0"
                  onChange={(e) =>
                    updatePayslip({
                      payPeriod: { lopDays: Number(e.target.value || 0) },
                    })
                  }
                />
                <div className="text-xs text-muted-foreground">
                  Loss of Pay days
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tax Regime</Label>
                <Select
                  value={payslip.taxRegime}
                  onValueChange={(val) => {
                    if (val === "new" || val === "old") {
                      updatePayslip({ taxRegime: val satisfies TaxRegime });
                    }
                  }}
                >
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!errors.taxRegime}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Regime</SelectItem>
                    <SelectItem value="old">Old Regime</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={errors.taxRegime} />
                <div className="text-xs text-muted-foreground">
                  Income Tax deduction updates automatically based on a
                  simplified slab calculation (editable).
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="earnings"
          className="bg-card rounded-xl border px-4 shadow-sm"
        >
          <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
            4. Earnings
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-3">
            <div className="space-y-4">
              {payslip.earnings.map((e, idx) => (
                <div
                  key={e.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-3 items-start"
                >
                  <div className="space-y-2">
                    <Label>Earning Name</Label>
                    <Input
                      value={e.name}
                      placeholder={
                        idx === 0
                          ? "Basic"
                          : idx === 1
                            ? "House Rent Allowance"
                            : "e.g., Bonus"
                      }
                      onChange={(ev) => {
                        const next = [...payslip.earnings];
                        next[idx] = { ...e, name: ev.target.value };
                        updatePayslip({ earnings: next });
                      }}
                    />
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="space-y-2 w-full md:w-[220px]">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={e.amount}
                        placeholder={
                          idx === 0
                            ? "e.g., 41667"
                            : idx === 1
                              ? "e.g., 20833"
                              : "e.g., 5000"
                        }
                        onChange={(ev) => {
                          const next = [...payslip.earnings];
                          next[idx] = {
                            ...e,
                            amount: Number(ev.target.value || 0),
                          };
                          updatePayslip({ earnings: next });
                        }}
                      />
                    </div>
                    <div className="mt-[26px]">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          const next = [...payslip.earnings];
                          next.splice(idx, 1);
                          updatePayslip({ earnings: next });
                        }}
                        aria-label="Remove earning"
                        disabled={payslip.earnings.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addEarning}>
                <Plus className="h-4 w-4 sm:mr-2" />
                Add Custom Earning
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="deductions"
          className="bg-card rounded-xl border px-4 shadow-sm"
        >
          <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
            5. Deductions
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-3">
            <div className="space-y-4">
              {payslip.deductions.map((d, idx) => (
                <div
                  key={d.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-3 items-start"
                >
                  <div className="space-y-2">
                    <Label>Deduction Name</Label>
                    <Input
                      value={d.name}
                      placeholder={
                        idx === 0
                          ? "Provident Fund (PF)"
                          : "Income Tax (TDS) - New Regime"
                      }
                      onChange={(ev) => {
                        const next = [...payslip.deductions];
                        next[idx] = { ...d, name: ev.target.value };
                        updatePayslip({ deductions: next });
                      }}
                    />
                    {d.isAuto ? (
                      <div className="text-xs text-muted-foreground">
                        Auto-calculated based on tax regime & slabs (editable)
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="space-y-2 w-full md:w-[220px]">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={d.amount}
                        placeholder={idx === 0 ? "e.g., 1800" : "₹ 0"}
                        onChange={(ev) => {
                          const next = [...payslip.deductions];
                          next[idx] = {
                            ...d,
                            amount: Number(ev.target.value || 0),
                            isAuto: d.isAuto ? false : d.isAuto,
                          };
                          updatePayslip({ deductions: next });
                        }}
                      />
                    </div>
                    {!d.isAuto ? (
                      <div className="mt-[26px]">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            const next = [...payslip.deductions];
                            next.splice(idx, 1);
                            updatePayslip({ deductions: next });
                          }}
                          aria-label="Remove deduction"
                          disabled={payslip.deductions.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addDeduction}>
                <Plus className="h-4 w-4 sm:mr-2" />
                Add Custom Deduction
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="summary"
          className="bg-card rounded-xl border px-4 shadow-sm"
        >
          <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
            6. Summary
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-3">
            <div className="space-y-3 w-full">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Gross Pay</div>
                <div className="font-semibold text-foreground">
                  + {formatMoney(payslip.grossPay, "INR")}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Deductions</div>
                <div className="font-semibold text-foreground">
                  - {formatMoney(payslip.totalDeductions, "INR")}
                </div>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Net Pay</div>
                <div className="text-lg font-bold text-foreground">
                  {formatMoney(payslip.netPay, "INR")}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="signature"
          className="bg-card rounded-xl border px-4 shadow-sm"
        >
          <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
            7. Signature
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-3">
            <SignatureSection
              enabled={payslip.showSignature ?? false}
              onEnabledChange={(enabled) =>
                updatePayslip({ showSignature: enabled })
              }
              role={payslip.signatureRole || ""}
              onRoleChange={(value) => updatePayslip({ signatureRole: value })}
              mode={
                payslip.signatureMode ||
                (payslip.signature
                  ? "upload"
                  : payslip.signatureTyped
                    ? "type"
                    : "draw")
              }
              onModeChange={(m) => updatePayslip({ signatureMode: m })}
              typed={payslip.signatureTyped || ""}
              onTypedChange={(value) =>
                updatePayslip({ signatureTyped: value })
              }
              imageData={payslip.signature}
              onImageDataChange={(value) => updatePayslip({ signature: value })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="design"
          className="bg-card rounded-xl border px-4 shadow-sm"
        >
          <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
            8. Design &amp; Branding
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-base">Template</Label>
                <Select
                  value={payslip.template || "modern"}
                  onValueChange={(val) => {
                    const v = val as PayslipTemplateKey;
                    updatePayslip({ template: v });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-base">Color Theme</Label>
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        className="w-[140px] justify-start text-left font-normal px-3"
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-border mr-2"
                          style={{
                            backgroundColor: payslip.colorTheme || "#2563eb",
                          }}
                        />
                        <span className="font-mono text-sm uppercase text-muted-foreground">
                          {payslip.colorTheme || "#2563eb"}
                        </span>
                      </Button>
                    }
                  />
                  <PopoverContent
                    className="w-auto p-3 flex flex-col gap-3"
                    align="start"
                  >
                    <HexColorPicker
                      color={payslip.colorTheme || "#2563eb"}
                      onChange={(color) => updatePayslip({ colorTheme: color })}
                    />
                    <div className="flex items-center gap-2">
                      <div className="text-muted-foreground text-xs font-semibold">
                        HEX
                      </div>
                      <Input
                        className="h-8 font-mono text-xs uppercase"
                        value={payslip.colorTheme || "#2563eb"}
                        onChange={(e) =>
                          updatePayslip({ colorTheme: e.target.value })
                        }
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-4 md:col-span-2">
                <Label className="text-base">Display Options</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="payslipShowFooter"
                      checked={payslip.showFooter ?? true}
                      onCheckedChange={(c: boolean) =>
                        updatePayslip({ showFooter: c })
                      }
                    />
                    <Label htmlFor="payslipShowFooter">Footer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="payslipShowPageNumbers"
                      checked={payslip.showPageNumbers ?? true}
                      onCheckedChange={(c: boolean) =>
                        updatePayslip({ showPageNumbers: c })
                      }
                    />
                    <Label htmlFor="payslipShowPageNumbers">Page No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="payslipShowWatermark"
                      checked={payslip.showWatermark ?? false}
                      onCheckedChange={(c: boolean) =>
                        updatePayslip({ showWatermark: c })
                      }
                    />
                    <Label htmlFor="payslipShowWatermark">Watermark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="payslipShowLogo"
                      checked={payslip.showLogo ?? true}
                      onCheckedChange={(c: boolean) =>
                        updatePayslip({ showLogo: c })
                      }
                    />
                    <Label htmlFor="payslipShowLogo">Logo</Label>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
