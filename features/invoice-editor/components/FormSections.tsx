"use client";

import { Plus, RefreshCcw, Trash2 } from "lucide-react";
import * as React from "react";
import { HexColorPicker } from "react-colorful";
import { DatePicker } from "@/components/shared/DatePicker";
import { ImagePicker } from "@/components/shared/ImagePicker";
import { RequiredLabel } from "@/components/shared/RequiredLabel";
import { SignatureSection } from "@/components/shared/SignatureSection";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useInvoiceStore } from "@/features/invoice-editor/store/invoice.store";
import type { TemplateKey } from "@/features/templates/renderers";
import { currencies } from "@/lib/currencies";
import { formatMoney } from "@/lib/format";
import type { Invoice } from "@/types/invoice.types";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <div className="text-xs text-destructive mt-1">{message}</div>;
}

export function Section1Details() {
  const { invoice, updateInvoice, errors } = useInvoiceStore();
  const [duePreset, setDuePreset] = React.useState<string>("3");
  const setDueInDays = (days: number) => {
    const base = invoice.issueDate ? new Date(invoice.issueDate) : new Date();
    const next = new Date(base);
    next.setDate(next.getDate() + days);
    updateInvoice({ dueDate: next });
  };
  React.useEffect(() => {
    if (!invoice.issueDate || !invoice.dueDate) return;
    const issue = new Date(invoice.issueDate);
    const due = new Date(invoice.dueDate);
    const diff = Math.round(
      (due.getTime() - issue.getTime()) / (1000 * 60 * 60 * 24),
    );
    if ([3, 7, 15, 30, 60].includes(diff)) setDuePreset(String(diff));
    else setDuePreset("custom");
  }, [invoice.issueDate, invoice.dueDate]);
  const titlePresets = [
    "INVOICE",
    "TAX INVOICE",
    "PROFORMA",
    "RECEIPT",
    "CREDIT NOTE",
    "DEBIT NOTE",
    "QUOTE/ESTIMATE",
  ] as const;
  const titleCandidate = (invoice.title || "").trim();
  const titlePresetValue = (titlePresets as readonly string[]).includes(
    titleCandidate,
  )
    ? (titleCandidate as (typeof titlePresets)[number])
    : "custom";
  const statusVariant = (s?: string) => {
    if (!s) return "secondary" as const;
    if (s === "paid") return "success" as const;
    if (s === "overdue") return "destructive" as const;
    if (s === "sent") return "info" as const;
    if (s === "partial") return "warning" as const;
    if (s === "cancelled" || s === "void" || s === "refunded")
      return "outline" as const;
    return "secondary" as const;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <RequiredLabel htmlFor="invoiceNumber">Invoice Number</RequiredLabel>
        <div className="relative">
          <Input
            id="invoiceNumber"
            value={invoice.invoiceNumber || ""}
            onChange={(e) => updateInvoice({ invoiceNumber: e.target.value })}
            className="pr-10"
            aria-invalid={!!errors.invoiceNumber}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary/10 text-primary hover:bg-primary/20"
            onClick={() => {
              const n = String(Math.floor(Math.random() * 10000)).padStart(
                4,
                "0",
              );
              updateInvoice({ invoiceNumber: `INV-${n}` });
            }}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
        <FieldError message={errors.invoiceNumber} />
      </div>
      <div className="space-y-2">
        <RequiredLabel htmlFor="invoiceTitlePreset">
          Invoice Title
        </RequiredLabel>
        <div className="flex items-center gap-2">
          <Select
            value={titlePresetValue}
            onValueChange={(val) => {
              if (!val || val === "custom") {
                updateInvoice({ title: "" });
              } else {
                updateInvoice({ title: val });
              }
            }}
          >
            <SelectTrigger
              id="invoiceTitlePreset"
              className="w-full"
              aria-invalid={!!errors.title}
            >
              <SelectValue placeholder="Preset" />
            </SelectTrigger>
            <SelectContent>
              {titlePresets.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <FieldError message={errors.title} />
        {titlePresetValue === "custom" && (
          <Input
            id="title"
            value={invoice.title || ""}
            onChange={(e) => updateInvoice({ title: e.target.value })}
            placeholder="Enter custom title"
            aria-invalid={!!errors.title}
          />
        )}
      </div>
      <div className="space-y-2">
        <RequiredLabel htmlFor="issueDateField">Issue Date</RequiredLabel>
        <div id="issueDateField">
          <DatePicker
            date={invoice.issueDate ? new Date(invoice.issueDate) : undefined}
            setDate={(date: Date | undefined) =>
              updateInvoice({ issueDate: date || new Date() })
            }
          />
        </div>
        <FieldError message={errors.issueDate} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <RequiredLabel htmlFor="dueDateField">Due Date</RequiredLabel>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1" id="dueDateField">
            <DatePicker
              date={invoice.dueDate ? new Date(invoice.dueDate) : undefined}
              setDate={(date: Date | undefined) => {
                setDuePreset("custom");
                updateInvoice({ dueDate: date || new Date() });
              }}
            />
          </div>
          <Select
            value={duePreset}
            onValueChange={(val: string | null) => {
              if (!val) return;
              setDuePreset(val);
              if (val === "custom") return;
              setDueInDays(parseInt(val, 10));
            }}
          >
            <SelectTrigger className="w-[92px] bg-primary/10 text-primary hover:bg-primary/20">
              <span className="text-sm">
                {duePreset === "custom" ? "Custom" : `+${duePreset}d`}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">+3d</SelectItem>
              <SelectItem value="7">+7d</SelectItem>
              <SelectItem value="15">+15d</SelectItem>
              <SelectItem value="30">+30d</SelectItem>
              <SelectItem value="60">+60d</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <FieldError message={errors.dueDate} />
      </div>
      <div className="space-y-2">
        <Label>Delivery Date</Label>
        <DatePicker
          date={
            invoice.deliveryDate ? new Date(invoice.deliveryDate) : undefined
          }
          setDate={(date: Date | undefined) =>
            updateInvoice({ deliveryDate: date })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="poNumber">PO Number</Label>
        <Input
          id="poNumber"
          value={invoice.poNumber || ""}
          onChange={(e) => updateInvoice({ poNumber: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <RequiredLabel htmlFor="currencyField">Currency</RequiredLabel>
        <Select
          value={invoice.currency || "INR"}
          onValueChange={(val) => updateInvoice({ currency: val || "INR" })}
        >
          <SelectTrigger
            id="currencyField"
            className="w-full"
            aria-invalid={!!errors.currency}
          >
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                <span className="flex w-full items-center justify-between gap-3">
                  <span className="truncate">
                    {c.symbol} {c.code} — {c.name}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError message={errors.currency} />
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={invoice.status ?? "none"}
          onValueChange={(val) => {
            if (val === "none") updateInvoice({ status: undefined });
            else updateInvoice({ status: val as Invoice["status"] });
          }}
        >
          <SelectTrigger className="w-full">
            <div className="flex items-center justify-between w-full">
              {invoice.status ? (
                <Badge variant={statusVariant(invoice.status)}>
                  {invoice.status.toUpperCase()}
                </Badge>
              ) : (
                <span className="text-muted-foreground text-sm">Optional</span>
              )}
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="partial">Partially Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="void">Void</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function Section2From() {
  const { invoice, updateInvoice, errors } = useInvoiceStore();
  const updateFrom = (fields: Partial<Invoice["from"]>) => {
    updateInvoice({ from: fields });
  };
  const fromCustomFields = invoice.from?.customFields || [];
  const addFromCustomField = () => {
    updateFrom({
      customFields: [
        ...fromCustomFields,
        { id: crypto.randomUUID(), label: "", value: "" },
      ],
    });
  };
  const updateFromCustomField = (
    id: string,
    patch: Partial<(typeof fromCustomFields)[number]>,
  ) => {
    updateFrom({
      customFields: fromCustomFields.map((f) =>
        f.id === id ? { ...f, ...patch } : f,
      ),
    });
  };
  const removeFromCustomField = (id: string) => {
    updateFrom({ customFields: fromCustomFields.filter((f) => f.id !== id) });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2 md:col-span-2">
        <Label>Business Logo</Label>
        <ImagePicker
          accept="image/png, image/jpeg, image/jpg"
          value={invoice.from?.logo}
          fileLabel="Upload logo"
          onChange={(next) => updateFrom({ logo: next })}
        />
      </div>
      <div className="space-y-2">
        <RequiredLabel htmlFor="fromBusinessName">Business Name</RequiredLabel>
        <Input
          id="fromBusinessName"
          value={invoice.from?.businessName || ""}
          onChange={(e) => updateFrom({ businessName: e.target.value })}
          aria-invalid={!!errors["from.businessName"]}
        />
        <FieldError message={errors["from.businessName"]} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fromContactName">Your Name / Contact Person</Label>
        <Input
          id="fromContactName"
          value={invoice.from?.contactName || ""}
          onChange={(e) => updateFrom({ contactName: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fromEmail">Email</Label>
        <Input
          id="fromEmail"
          type="email"
          value={invoice.from?.email || ""}
          onChange={(e) => updateFrom({ email: e.target.value })}
          aria-invalid={!!errors["from.email"]}
        />
        <FieldError message={errors["from.email"]} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fromPhone">Phone</Label>
        <Input
          id="fromPhone"
          value={invoice.from?.phone || ""}
          onChange={(e) => updateFrom({ phone: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fromWebsite">Website</Label>
        <Input
          id="fromWebsite"
          value={invoice.from?.website || ""}
          onChange={(e) => updateFrom({ website: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fromTaxId">Tax ID / VAT / GST</Label>
        <Input
          id="fromTaxId"
          value={invoice.from?.taxId || ""}
          onChange={(e) => updateFrom({ taxId: e.target.value })}
        />
      </div>
      <div className="md:col-span-2 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div />
          <Button
            size="sm"
            variant="ghost"
            className="bg-primary/10 text-primary hover:bg-primary/20"
            onClick={addFromCustomField}
          >
            <Plus className="h-4 w-4" />
            Add custom fields
          </Button>
        </div>
        {fromCustomFields.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[110px] sm:w-[180px]">
                    Field
                  </TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="w-[44px] sm:w-[56px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fromCustomFields.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>
                      <Input
                        value={f.label || ""}
                        onChange={(e) =>
                          updateFromCustomField(f.id, { label: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={f.value || ""}
                        onChange={(e) =>
                          updateFromCustomField(f.id, { value: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right pr-1 sm:pr-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeFromCustomField(f.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div />
        )}
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Address</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
          <Input
            placeholder="Line 1"
            value={invoice.from?.address?.line1 || ""}
            onChange={(e) =>
              updateFrom({
                address: {
                  ...invoice.from?.address,
                  line1: e.target.value,
                } as Invoice["from"]["address"],
              })
            }
          />
          <Input
            placeholder="Line 2"
            value={invoice.from?.address?.line2 || ""}
            onChange={(e) =>
              updateFrom({
                address: {
                  ...invoice.from?.address,
                  line2: e.target.value,
                } as Invoice["from"]["address"],
              })
            }
          />
          <Input
            placeholder="City"
            value={invoice.from?.address?.city || ""}
            onChange={(e) =>
              updateFrom({
                address: {
                  ...invoice.from?.address,
                  city: e.target.value,
                } as Invoice["from"]["address"],
              })
            }
          />
          <Input
            placeholder="State"
            value={invoice.from?.address?.state || ""}
            onChange={(e) =>
              updateFrom({
                address: {
                  ...invoice.from?.address,
                  state: e.target.value,
                } as Invoice["from"]["address"],
              })
            }
          />
          <Input
            placeholder="Postal Code"
            value={invoice.from?.address?.postalCode || ""}
            onChange={(e) =>
              updateFrom({
                address: {
                  ...invoice.from?.address,
                  postalCode: e.target.value,
                } as Invoice["from"]["address"],
              })
            }
          />
          <Input
            placeholder="Country"
            value={invoice.from?.address?.country || ""}
            onChange={(e) =>
              updateFrom({
                address: {
                  ...invoice.from?.address,
                  country: e.target.value,
                } as Invoice["from"]["address"],
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

export function Section3To() {
  const { invoice, updateInvoice, errors } = useInvoiceStore();
  const updateTo = (fields: Partial<Invoice["to"]>) => {
    updateInvoice({ to: fields });
  };
  const toCustomFields = invoice.to?.customFields || [];
  const addToCustomField = () => {
    updateTo({
      customFields: [
        ...toCustomFields,
        { id: crypto.randomUUID(), label: "", value: "" },
      ],
    });
  };
  const updateToCustomField = (
    id: string,
    patch: Partial<(typeof toCustomFields)[number]>,
  ) => {
    updateTo({
      customFields: toCustomFields.map((f) =>
        f.id === id ? { ...f, ...patch } : f,
      ),
    });
  };
  const removeToCustomField = (id: string) => {
    updateTo({ customFields: toCustomFields.filter((f) => f.id !== id) });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2 md:col-span-2">
        <Label>Client Logo</Label>
        <ImagePicker
          accept="image/png, image/jpeg, image/jpg"
          value={invoice.to?.logo}
          fileLabel="Upload logo"
          onChange={(next) => updateTo({ logo: next })}
        />
      </div>
      <div className="space-y-2">
        <RequiredLabel htmlFor="toBusinessName">
          Client Business Name
        </RequiredLabel>
        <Input
          id="toBusinessName"
          value={invoice.to?.businessName || ""}
          onChange={(e) => updateTo({ businessName: e.target.value })}
          aria-invalid={!!errors["to.businessName"]}
        />
        <FieldError message={errors["to.businessName"]} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="toContactName">Contact Person Name</Label>
        <Input
          id="toContactName"
          value={invoice.to?.contactName || ""}
          onChange={(e) => updateTo({ contactName: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="toEmail">Client Email</Label>
        <Input
          id="toEmail"
          type="email"
          value={invoice.to?.email || ""}
          onChange={(e) => updateTo({ email: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="toPhone">Client Phone</Label>
        <Input
          id="toPhone"
          value={invoice.to?.phone || ""}
          onChange={(e) => updateTo({ phone: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="toTaxId">Client Tax ID</Label>
        <Input
          id="toTaxId"
          value={invoice.to?.taxId || ""}
          onChange={(e) => updateTo({ taxId: e.target.value })}
        />
      </div>
      <div className="md:col-span-2 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div />
          <Button
            size="sm"
            variant="ghost"
            className="bg-primary/10 text-primary hover:bg-primary/20"
            onClick={addToCustomField}
          >
            <Plus className="h-4 w-4" />
            Add custom fields
          </Button>
        </div>
        {toCustomFields.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[110px] sm:w-[180px]">
                    Field
                  </TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="w-[44px] sm:w-[56px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {toCustomFields.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>
                      <Input
                        value={f.label || ""}
                        onChange={(e) =>
                          updateToCustomField(f.id, { label: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={f.value || ""}
                        onChange={(e) =>
                          updateToCustomField(f.id, { value: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right pr-1 sm:pr-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeToCustomField(f.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div />
        )}
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Client Address</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
          <Input
            placeholder="Line 1"
            value={invoice.to?.address?.line1 || ""}
            onChange={(e) =>
              updateTo({
                address: {
                  ...invoice.to?.address,
                  line1: e.target.value,
                } as Invoice["to"]["address"],
              })
            }
          />
          <Input
            placeholder="Line 2"
            value={invoice.to?.address?.line2 || ""}
            onChange={(e) =>
              updateTo({
                address: {
                  ...invoice.to?.address,
                  line2: e.target.value,
                } as Invoice["to"]["address"],
              })
            }
          />
          <Input
            placeholder="City"
            value={invoice.to?.address?.city || ""}
            onChange={(e) =>
              updateTo({
                address: {
                  ...invoice.to?.address,
                  city: e.target.value,
                } as Invoice["to"]["address"],
              })
            }
          />
          <Input
            placeholder="State"
            value={invoice.to?.address?.state || ""}
            onChange={(e) =>
              updateTo({
                address: {
                  ...invoice.to?.address,
                  state: e.target.value,
                } as Invoice["to"]["address"],
              })
            }
          />
          <Input
            placeholder="Postal Code"
            value={invoice.to?.address?.postalCode || ""}
            onChange={(e) =>
              updateTo({
                address: {
                  ...invoice.to?.address,
                  postalCode: e.target.value,
                } as Invoice["to"]["address"],
              })
            }
          />
          <Input
            placeholder="Country"
            value={invoice.to?.address?.country || ""}
            onChange={(e) =>
              updateTo({
                address: {
                  ...invoice.to?.address,
                  country: e.target.value,
                } as Invoice["to"]["address"],
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

export function Section5Pricing() {
  const { invoice, updateInvoice } = useInvoiceStore();
  const taxLines = invoice.taxLines || [];

  const addTaxLine = (preset?: {
    name: string;
    rate: number;
    compound: boolean;
  }) => {
    const next = [
      ...taxLines,
      {
        id: crypto.randomUUID(),
        name: preset?.name || "Tax",
        rate: preset?.rate || 0,
        compound: preset?.compound || false,
        amount: 0,
      },
    ];
    updateInvoice({ taxLines: next });
  };

  const updateTaxLine = (
    id: string,
    patch: Partial<(typeof taxLines)[number]>,
  ) => {
    const next = taxLines.map((t) => (t.id === id ? { ...t, ...patch } : t));
    updateInvoice({ taxLines: next });
  };

  const removeTaxLine = (id: string) => {
    const next = taxLines.filter((t) => t.id !== id);
    updateInvoice({ taxLines: next });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Discount Type</Label>
          <Select
            value={invoice.discountType || "percentage"}
            onValueChange={(val) => {
              if (val === "percentage" || val === "fixed") {
                updateInvoice({ discountType: val });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Discount Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Discount Value</Label>
          <Input
            type="number"
            value={invoice.discountValue || 0}
            onChange={(e) =>
              updateInvoice({ discountValue: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Shipping / Handling Fee</Label>
          <Input
            type="number"
            value={invoice.shippingFee || 0}
            onChange={(e) =>
              updateInvoice({ shippingFee: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Amount Paid Already</Label>
          <Input
            type="number"
            value={invoice.amountPaid || 0}
            onChange={(e) =>
              updateInvoice({ amountPaid: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Label className="text-base">Tax Lines</Label>
          <div className="flex items-center gap-2">
            <Select
              value=""
              onValueChange={(val) => {
                if (val === "gst18")
                  addTaxLine({ name: "GST", rate: 18, compound: false });
                if (val === "vat20")
                  addTaxLine({ name: "VAT", rate: 20, compound: false });
                if (val === "service5")
                  addTaxLine({ name: "Service Tax", rate: 5, compound: false });
                if (val === "hst13")
                  addTaxLine({ name: "HST", rate: 13, compound: false });
                if (val === "custom") addTaxLine();
              }}
            >
              <SelectTrigger className="w-[180px] bg-primary/10 text-primary hover:bg-primary/20">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Add tax</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gst18">GST 18%</SelectItem>
                <SelectItem value="vat20">VAT 20%</SelectItem>
                <SelectItem value="service5">Service Tax 5%</SelectItem>
                <SelectItem value="hst13">HST 13%</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {taxLines.length === 0 ? (
          <div className="text-sm text-muted-foreground border rounded-lg p-4">
            No tax lines added.
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead className="w-[120px] text-right">Rate %</TableHead>
                  <TableHead className="w-[120px]">Compound</TableHead>
                  <TableHead className="w-[90px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxLines.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <Input
                        value={t.name || ""}
                        onChange={(e) =>
                          updateTaxLine(t.id, { name: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={t.rate || 0}
                        onChange={(e) =>
                          updateTaxLine(t.id, {
                            rate: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={t.compound ?? false}
                        onCheckedChange={(checked: boolean) =>
                          updateTaxLine(t.id, { compound: checked })
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeTaxLine(t.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="p-4 bg-muted/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 text-sm text-muted-foreground space-y-1">
              <div className="flex justify-between gap-6">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">
                  {formatMoney(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              <div className="flex justify-between gap-6">
                <span>Discount</span>
                <span className="font-medium text-foreground">
                  -{formatMoney(invoice.discountAmount, invoice.currency)}
                </span>
              </div>
              {(invoice.taxLines || []).map((t, i) => (
                <div key={t.id || i} className="flex justify-between gap-6">
                  <span>
                    {t.name} ({t.rate}%)
                  </span>
                  <span className="font-medium text-foreground">
                    {formatMoney(t.amount || 0, invoice.currency)}
                  </span>
                </div>
              ))}
              {!!invoice.shippingFee && (
                <div className="flex justify-between gap-6">
                  <span>Shipping</span>
                  <span className="font-medium text-foreground">
                    {formatMoney(invoice.shippingFee || 0, invoice.currency)}
                  </span>
                </div>
              )}
            </div>
            <div className="w-full min-w-0 sm:w-auto sm:min-w-[180px] text-left sm:text-right">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight wrap-break-word">
                {formatMoney(invoice.total, invoice.currency)}
              </div>
              <Separator className="my-3" />
              <div className="text-sm text-muted-foreground">Amount Due</div>
              <div className="text-lg font-semibold wrap-break-word">
                {formatMoney(invoice.amountDue || 0, invoice.currency)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Section6Payment() {
  const { invoice, updateInvoice } = useInvoiceStore();
  const updateBank = (
    fields: Partial<NonNullable<typeof invoice.bankDetails>>,
  ) => {
    updateInvoice({
      bankDetails: { ...(invoice.bankDetails || {}), ...fields },
    });
  };
  const paymentMode =
    invoice.paymentMode ||
    (invoice.paymentLink ? "url" : invoice.bankDetails?.upi ? "upi" : "bank");
  const setMode = (mode: "upi" | "bank" | "url") => {
    if (mode === "upi") {
      updateInvoice({
        paymentMode: "upi",
        paymentLink: "",
        bankDetails: {
          upi: "",
        },
      });
      return;
    }
    if (mode === "bank") {
      updateInvoice({
        paymentMode: "bank",
        paymentLink: "",
        bankDetails: {},
      });
      return;
    }
    updateInvoice({
      paymentMode: "url",
      paymentLink: "",
      bankDetails: {},
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={paymentMode === "upi" ? "default" : "outline"}
              onClick={() => setMode("upi")}
            >
              UPI
            </Button>
            <Button
              size="sm"
              variant={paymentMode === "bank" ? "default" : "outline"}
              onClick={() => setMode("bank")}
            >
              Bank
            </Button>
            <Button
              size="sm"
              variant={paymentMode === "url" ? "default" : "outline"}
              onClick={() => setMode("url")}
            >
              URL
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Field</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentMode === "url" && (
                <TableRow>
                  <TableCell className="text-sm text-muted-foreground">
                    Payment URL
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="https://..."
                      value={invoice.paymentLink || ""}
                      onChange={(e) =>
                        updateInvoice({ paymentLink: e.target.value })
                      }
                    />
                  </TableCell>
                </TableRow>
              )}
              {paymentMode === "upi" && (
                <TableRow>
                  <TableCell className="text-sm text-muted-foreground">
                    UPI ID
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="name@bank"
                      value={invoice.bankDetails?.upi || ""}
                      onChange={(e) => updateBank({ upi: e.target.value })}
                    />
                  </TableCell>
                </TableRow>
              )}
              {paymentMode === "bank" && (
                <>
                  <TableRow>
                    <TableCell className="text-sm text-muted-foreground">
                      Bank Name
                    </TableCell>
                    <TableCell>
                      <Input
                        value={invoice.bankDetails?.bankName || ""}
                        onChange={(e) =>
                          updateBank({ bankName: e.target.value })
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-sm text-muted-foreground">
                      Account Holder Name
                    </TableCell>
                    <TableCell>
                      <Input
                        value={invoice.bankDetails?.accountName || ""}
                        onChange={(e) =>
                          updateBank({ accountName: e.target.value })
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-sm text-muted-foreground">
                      IFSC
                    </TableCell>
                    <TableCell>
                      <Input
                        value={invoice.bankDetails?.ifsc || ""}
                        onChange={(e) => updateBank({ ifsc: e.target.value })}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-sm text-muted-foreground">
                      Account Number
                    </TableCell>
                    <TableCell>
                      <Input
                        value={invoice.bankDetails?.accountNumber || ""}
                        onChange={(e) =>
                          updateBank({ accountNumber: e.target.value })
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-sm text-muted-foreground">
                      Routing / Sort Code
                    </TableCell>
                    <TableCell>
                      <Input
                        value={invoice.bankDetails?.routingNumber || ""}
                        onChange={(e) =>
                          updateBank({ routingNumber: e.target.value })
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-sm text-muted-foreground">
                      SWIFT / BIC
                    </TableCell>
                    <TableCell>
                      <Input
                        value={invoice.bankDetails?.swift || ""}
                        onChange={(e) => updateBank({ swift: e.target.value })}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-sm text-muted-foreground">
                      IBAN
                    </TableCell>
                    <TableCell>
                      <Input
                        value={invoice.bankDetails?.iban || ""}
                        onChange={(e) => updateBank({ iban: e.target.value })}
                      />
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export function Section7Notes() {
  const { invoice, updateInvoice } = useInvoiceStore();

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          value={invoice.notes || ""}
          onChange={(e) => updateInvoice({ notes: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Deliverables</Label>
        <Textarea
          value={invoice.deliverables || ""}
          onChange={(e) => updateInvoice({ deliverables: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Terms & Conditions</Label>
        <Textarea
          value={invoice.terms || ""}
          onChange={(e) => updateInvoice({ terms: e.target.value })}
        />
      </div>
    </div>
  );
}

export function Section8Signature() {
  const { invoice, updateInvoice } = useInvoiceStore();
  const selectedMode =
    invoice.signatureMode ||
    (invoice.signature ? "upload" : invoice.signatureTyped ? "type" : "draw");

  return (
    <SignatureSection
      enabled={invoice.showSignature ?? false}
      onEnabledChange={(enabled) => updateInvoice({ showSignature: enabled })}
      role={invoice.signatureRole || ""}
      onRoleChange={(value) => updateInvoice({ signatureRole: value })}
      mode={selectedMode}
      onModeChange={(m) => updateInvoice({ signatureMode: m })}
      typed={invoice.signatureTyped || ""}
      onTypedChange={(value) => updateInvoice({ signatureTyped: value })}
      imageData={invoice.signature}
      onImageDataChange={(value) => updateInvoice({ signature: value })}
    />
  );
}

export function Section9Design() {
  const { invoice, updateInvoice } = useInvoiceStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Label className="text-base">Template Style</Label>
        <Select
          value={invoice.template || "modern"}
          onValueChange={(val) =>
            updateInvoice({ template: val as TemplateKey })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
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
                  style={{ backgroundColor: invoice.colorTheme || "#2563eb" }}
                />
                <span className="font-mono text-sm uppercase text-muted-foreground">
                  {invoice.colorTheme || "#2563eb"}
                </span>
              </Button>
            }
          />
          <PopoverContent
            className="w-auto p-3 flex flex-col gap-3"
            align="start"
          >
            <HexColorPicker
              color={invoice.colorTheme || "#2563eb"}
              onChange={(color) => updateInvoice({ colorTheme: color })}
            />
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-xs font-semibold">
                HEX
              </div>
              <Input
                className="h-8 font-mono text-xs uppercase"
                value={invoice.colorTheme || "#2563eb"}
                onChange={(e) => {
                  const val = e.target.value;
                  updateInvoice({ colorTheme: val });
                }}
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
              id="showRibbon"
              checked={invoice.showRibbon ?? true}
              onCheckedChange={(c: boolean) => updateInvoice({ showRibbon: c })}
            />
            <Label htmlFor="showRibbon">Ribbon</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="showFooter"
              checked={invoice.showFooter ?? true}
              onCheckedChange={(c: boolean) => updateInvoice({ showFooter: c })}
            />
            <Label htmlFor="showFooter">Footer</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="showPageNumbers"
              checked={invoice.showPageNumbers ?? true}
              onCheckedChange={(c: boolean) =>
                updateInvoice({ showPageNumbers: c })
              }
            />
            <Label htmlFor="showPageNumbers">Page No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="showWatermark"
              checked={invoice.showWatermark ?? false}
              onCheckedChange={(c: boolean) =>
                updateInvoice({ showWatermark: c })
              }
            />
            <Label htmlFor="showWatermark">Watermark</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
