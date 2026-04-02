"use client";

import * as React from "react";
import { useInvoiceStore } from "@/store/invoice.store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/shared/DatePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { TemplateKey } from "@/features/templates/renderers";
import { Plus, RefreshCcw, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { currencies } from "@/lib/currencies";
import { formatMoney } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SignaturePad from "signature_pad";

function ReqLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <Label htmlFor={htmlFor}>
      {children}
      <span className="text-destructive"> *</span>
    </Label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <div className="text-xs text-destructive mt-1">{message}</div>;
}

function FilePicker({
  accept,
  onFile,
  fileLabel,
}: {
  accept: string;
  onFile: (file: File) => void;
  fileLabel: string;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [name, setName] = React.useState<string>("");

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setName(file.name);
          onFile(file);
          e.currentTarget.value = "";
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="bg-primary/10 text-primary hover:bg-primary/20"
        onClick={() => inputRef.current?.click()}
      >
        Choose
      </Button>
      <div className="text-sm text-muted-foreground truncate min-w-0">
        {name || fileLabel}
      </div>
    </div>
  );
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
    const diff = Math.round((due.getTime() - issue.getTime()) / (1000 * 60 * 60 * 24));
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
  const titlePresetValue = titlePresets.includes((invoice.title || "") as any)
    ? (invoice.title as (typeof titlePresets)[number])
    : "custom";
  const statusVariant = (s?: string) => {
    if (!s) return "secondary" as const;
    if (s === "paid") return "success" as const;
    if (s === "overdue") return "destructive" as const;
    if (s === "sent") return "info" as const;
    if (s === "partial") return "warning" as const;
    if (s === "cancelled" || s === "void" || s === "refunded") return "outline" as const;
    return "secondary" as const;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <ReqLabel htmlFor="invoiceNumber">Invoice Number</ReqLabel>
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
              const n = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
              updateInvoice({ invoiceNumber: `INV-${n}` });
            }}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
        <FieldError message={errors.invoiceNumber} />
      </div>
      <div className="space-y-2">
        <ReqLabel htmlFor="invoiceTitlePreset">Invoice Title</ReqLabel>
        <div className="flex items-center gap-2">
          <Select
            value={titlePresetValue}
            onValueChange={(val) => {
              if (val === "custom") {
                updateInvoice({ title: "" });
              } else {
                updateInvoice({ title: val as any });
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
        <ReqLabel htmlFor="issueDateField">Issue Date</ReqLabel>
        <div id="issueDateField">
        <DatePicker
          date={invoice.issueDate ? new Date(invoice.issueDate) : undefined}
          setDate={(date: Date | undefined) => updateInvoice({ issueDate: date || new Date() })}
        />
        </div>
        <FieldError message={errors.issueDate} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <ReqLabel htmlFor="dueDateField">Due Date</ReqLabel>
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
          date={invoice.deliveryDate ? new Date(invoice.deliveryDate) : undefined}
          setDate={(date: Date | undefined) => updateInvoice({ deliveryDate: date })}
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
        <ReqLabel htmlFor="currencyField">Currency</ReqLabel>
        <Select
          value={invoice.currency || "INR"}
          onValueChange={(val) => updateInvoice({ currency: val || "INR" })}
        >
          <SelectTrigger id="currencyField" className="w-full" aria-invalid={!!errors.currency}>
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
          onValueChange={(val: any) =>
            updateInvoice({ status: val === "none" ? undefined : val })
          }
        >
          <SelectTrigger className="w-full">
            <div className="flex items-center justify-between w-full">
              {invoice.status ? (
                <Badge variant={statusVariant(invoice.status)}>{invoice.status.toUpperCase()}</Badge>
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
  const updateFrom = (fields: Partial<typeof invoice.from>) => {
    updateInvoice({ from: fields as any });
  };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateFrom({ logo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2 md:col-span-2">
        <Label>Business Logo</Label>
        <div className="flex items-center gap-4">
          {invoice.from?.logo && (
            <div className="relative w-16 h-16 rounded-md overflow-hidden border">
              <img src={invoice.from.logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          )}
          <div className="flex-1">
            <FilePicker
              accept="image/png, image/jpeg, image/jpg"
              onFile={handleLogoUpload}
              fileLabel={invoice.from?.logo ? "Image selected" : "No file chosen"}
            />
          </div>
          {invoice.from?.logo && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => updateFrom({ logo: undefined })}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <ReqLabel htmlFor="fromBusinessName">Business Name</ReqLabel>
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
      <div className="space-y-2 md:col-span-2">
        <Label>Address</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
          <Input placeholder="Line 1" value={invoice.from?.address?.line1 || ""} onChange={(e) => updateFrom({ address: { ...invoice.from?.address, line1: e.target.value } as any })} />
          <Input placeholder="Line 2" value={invoice.from?.address?.line2 || ""} onChange={(e) => updateFrom({ address: { ...invoice.from?.address, line2: e.target.value } as any })} />
          <Input placeholder="City" value={invoice.from?.address?.city || ""} onChange={(e) => updateFrom({ address: { ...invoice.from?.address, city: e.target.value } as any })} />
          <Input placeholder="State" value={invoice.from?.address?.state || ""} onChange={(e) => updateFrom({ address: { ...invoice.from?.address, state: e.target.value } as any })} />
          <Input placeholder="Postal Code" value={invoice.from?.address?.postalCode || ""} onChange={(e) => updateFrom({ address: { ...invoice.from?.address, postalCode: e.target.value } as any })} />
          <Input placeholder="Country" value={invoice.from?.address?.country || ""} onChange={(e) => updateFrom({ address: { ...invoice.from?.address, country: e.target.value } as any })} />
        </div>
      </div>
    </div>
  );
}

export function Section3To() {
  const { invoice, updateInvoice, errors } = useInvoiceStore();
  const updateTo = (fields: Partial<typeof invoice.to>) => {
    updateInvoice({ to: fields as any });
  };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateTo({ logo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2 md:col-span-2">
        <Label>Client Logo</Label>
        <div className="flex items-center gap-4">
          {invoice.to?.logo && (
            <div className="relative w-16 h-16 rounded-md overflow-hidden border">
              <img src={invoice.to.logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          )}
          <div className="flex-1">
            <FilePicker
              accept="image/png, image/jpeg, image/jpg"
              onFile={handleLogoUpload}
              fileLabel={invoice.to?.logo ? "Image selected" : "No file chosen"}
            />
          </div>
          {invoice.to?.logo && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => updateTo({ logo: undefined })}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <ReqLabel htmlFor="toBusinessName">Client Business Name</ReqLabel>
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
      <div className="space-y-2 md:col-span-2">
        <Label>Client Address</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
          <Input placeholder="Line 1" value={invoice.to?.address?.line1 || ""} onChange={(e) => updateTo({ address: { ...invoice.to?.address, line1: e.target.value } as any })} />
          <Input placeholder="Line 2" value={invoice.to?.address?.line2 || ""} onChange={(e) => updateTo({ address: { ...invoice.to?.address, line2: e.target.value } as any })} />
          <Input placeholder="City" value={invoice.to?.address?.city || ""} onChange={(e) => updateTo({ address: { ...invoice.to?.address, city: e.target.value } as any })} />
          <Input placeholder="State" value={invoice.to?.address?.state || ""} onChange={(e) => updateTo({ address: { ...invoice.to?.address, state: e.target.value } as any })} />
          <Input placeholder="Postal Code" value={invoice.to?.address?.postalCode || ""} onChange={(e) => updateTo({ address: { ...invoice.to?.address, postalCode: e.target.value } as any })} />
          <Input placeholder="Country" value={invoice.to?.address?.country || ""} onChange={(e) => updateTo({ address: { ...invoice.to?.address, country: e.target.value } as any })} />
        </div>
      </div>
    </div>
  );
}

export function Section5Pricing() {
  const { invoice, updateInvoice } = useInvoiceStore();
  const taxLines = invoice.taxLines || [];

  const addTaxLine = (preset?: { name: string; rate: number; compound: boolean }) => {
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
    updateInvoice({ taxLines: next as any });
  };

  const updateTaxLine = (id: string, patch: Partial<(typeof taxLines)[number]>) => {
    const next = taxLines.map((t) => (t.id === id ? { ...t, ...patch } : t));
    updateInvoice({ taxLines: next as any });
  };

  const removeTaxLine = (id: string) => {
    const next = taxLines.filter((t) => t.id !== id);
    updateInvoice({ taxLines: next as any });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Discount Type</Label>
          <Select
            value={invoice.discountType || "percentage"}
            onValueChange={(val: any) => updateInvoice({ discountType: val })}
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
            onChange={(e) => updateInvoice({ discountValue: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label>Shipping / Handling Fee</Label>
          <Input
            type="number"
            value={invoice.shippingFee || 0}
            onChange={(e) => updateInvoice({ shippingFee: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label>Amount Paid Already</Label>
          <Input
            type="number"
            value={invoice.amountPaid || 0}
            onChange={(e) => updateInvoice({ amountPaid: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Label className="text-base">Tax Lines</Label>
          <div className="flex items-center gap-2">
            <Select value="" onValueChange={(val) => {
              if (val === "gst18") addTaxLine({ name: "GST", rate: 18, compound: false });
              if (val === "vat20") addTaxLine({ name: "VAT", rate: 20, compound: false });
              if (val === "service5") addTaxLine({ name: "Service Tax", rate: 5, compound: false });
              if (val === "hst13") addTaxLine({ name: "HST", rate: 13, compound: false });
              if (val === "custom") addTaxLine();
            }}>
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
                        onChange={(e) => updateTaxLine(t.id, { name: e.target.value })}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={t.rate || 0}
                        onChange={(e) => updateTaxLine(t.id, { rate: parseFloat(e.target.value) || 0 })}
                        className="text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={t.compound ?? false}
                        onCheckedChange={(checked: boolean) => updateTaxLine(t.id, { compound: checked })}
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
          <div className="flex items-start justify-between gap-4">
            <div className="text-sm text-muted-foreground space-y-1">
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
                  <span>{t.name} ({t.rate}%)</span>
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
            <div className="text-right min-w-[180px]">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-3xl font-bold tracking-tight">
                {formatMoney(invoice.total, invoice.currency)}
              </div>
              <Separator className="my-3" />
              <div className="text-sm text-muted-foreground">Amount Due</div>
              <div className="text-lg font-semibold">
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
  const updateBank = (fields: Partial<NonNullable<typeof invoice.bankDetails>>) => {
    updateInvoice({ bankDetails: { ...(invoice.bankDetails || {}), ...fields } });
  };
  const paymentMode =
    invoice.paymentMode || (invoice.paymentLink ? "url" : invoice.bankDetails?.upi ? "upi" : "bank");
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
                  <TableCell className="text-sm text-muted-foreground">Payment URL</TableCell>
                  <TableCell>
                    <Input
                      placeholder="https://..."
                      value={invoice.paymentLink || ""}
                      onChange={(e) => updateInvoice({ paymentLink: e.target.value })}
                    />
                  </TableCell>
                </TableRow>
              )}
              {paymentMode === "upi" && (
                <TableRow>
                  <TableCell className="text-sm text-muted-foreground">UPI ID</TableCell>
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
                    <TableCell className="text-sm text-muted-foreground">Bank Name</TableCell>
                    <TableCell>
                      <Input value={invoice.bankDetails?.bankName || ""} onChange={(e) => updateBank({ bankName: e.target.value })} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-sm text-muted-foreground">Account Holder Name</TableCell>
                    <TableCell>
                      <Input value={invoice.bankDetails?.accountName || ""} onChange={(e) => updateBank({ accountName: e.target.value })} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-sm text-muted-foreground">IFSC</TableCell>
                    <TableCell>
                      <Input value={invoice.bankDetails?.ifsc || ""} onChange={(e) => updateBank({ ifsc: e.target.value })} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-sm text-muted-foreground">Account Number</TableCell>
                    <TableCell>
                      <Input value={invoice.bankDetails?.accountNumber || ""} onChange={(e) => updateBank({ accountNumber: e.target.value })} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-sm text-muted-foreground">Routing / Sort Code</TableCell>
                    <TableCell>
                      <Input value={invoice.bankDetails?.routingNumber || ""} onChange={(e) => updateBank({ routingNumber: e.target.value })} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-sm text-muted-foreground">SWIFT / BIC</TableCell>
                    <TableCell>
                      <Input value={invoice.bankDetails?.swift || ""} onChange={(e) => updateBank({ swift: e.target.value })} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-sm text-muted-foreground">IBAN</TableCell>
                    <TableCell>
                      <Input value={invoice.bankDetails?.iban || ""} onChange={(e) => updateBank({ iban: e.target.value })} />
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
  const canvasWrapRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const padRef = React.useRef<SignaturePad | null>(null);

  const selectedMode =
    invoice.signatureMode ||
    (invoice.signature ? "upload" : invoice.signatureTyped ? "type" : "draw");

  const resizeCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = canvasWrapRef.current;
    if (!canvas || !wrap) return;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const width = wrap.clientWidth;
    if (!width) return;
    const height = wrap.clientHeight || 140;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(ratio, ratio);
    }
    padRef.current?.clear();
  }, []);

  React.useEffect(() => {
    if (selectedMode !== "draw") return;
    const canvas = canvasRef.current;
    const wrap = canvasWrapRef.current;
    if (!canvas) return;
    padRef.current = new SignaturePad(canvas, {
      backgroundColor: "rgb(255,255,255)",
      penColor: "rgb(17,24,39)",
      minWidth: 1,
      maxWidth: 2.5,
    });

    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        resizeCanvas();
      });
    });

    let ro: ResizeObserver | undefined;
    if (wrap && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => resizeCanvas());
      ro.observe(wrap);
    }
    const onResize = () => resizeCanvas();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ro?.disconnect();
      window.removeEventListener("resize", onResize);
      padRef.current?.off();
      padRef.current = null;
    };
  }, [resizeCanvas, selectedMode]);

  const clearDraw = () => {
    padRef.current?.clear();
  };

  const saveDraw = () => {
    if (!padRef.current || padRef.current.isEmpty()) return;
    updateInvoice({ signature: padRef.current.toDataURL("image/png") });
  };

  const handleSignatureUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateInvoice({ signature: reader.result as string });
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border p-4 rounded-lg">
        <div className="space-y-0.5">
          <Label className="text-base">Show Signature</Label>
          <div className="text-sm text-muted-foreground">Include a signature block at the bottom of the invoice</div>
        </div>
        <Switch 
          checked={invoice.showSignature ?? false}
          onCheckedChange={(checked: boolean) => updateInvoice({ showSignature: checked })}
        />
      </div>

      {invoice.showSignature && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Signatory Role / Designation</Label>
            <Input 
              placeholder="Owner / Manager / Authorized Signatory" 
              value={invoice.signatureRole || ""}
              onChange={(e) => updateInvoice({ signatureRole: e.target.value })}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedMode === "draw" ? "default" : "outline"}
              size="sm"
              onClick={() => updateInvoice({ signatureMode: "draw" })}
            >
              Draw
            </Button>
            <Button
              variant={selectedMode === "type" ? "default" : "outline"}
              size="sm"
              onClick={() => updateInvoice({ signatureMode: "type" })}
            >
              Type
            </Button>
            <Button
              variant={selectedMode === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => updateInvoice({ signatureMode: "upload" })}
            >
              Upload
            </Button>
          </div>

          {selectedMode === "draw" && (
            <div className="space-y-2">
              <Label>Draw Signature</Label>
              <div ref={canvasWrapRef} className="border rounded-lg overflow-hidden bg-white h-[140px]">
                <canvas ref={canvasRef} className="w-full h-full touch-none" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearDraw}>
                  Clear
                </Button>
                <Button size="sm" onClick={() => {
                  saveDraw();
                  updateInvoice({ signatureMode: "draw" });
                }}>
                  Use Drawn
                </Button>
              </div>
            </div>
          )}

          {selectedMode === "type" && (
            <div className="space-y-2">
              <Label>Type Signature</Label>
              <Input
                placeholder="Your signature"
                value={invoice.signatureTyped || ""}
                onChange={(e) => updateInvoice({ signatureTyped: e.target.value })}
              />
              <div className="border rounded-lg bg-muted/10 p-3 h-[140px] flex items-center justify-center">
                <div className="font-serif italic text-3xl text-foreground/80 truncate max-w-full">
                  {invoice.signatureTyped || "Your Signature"}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => updateInvoice({ signatureMode: "type" })}
                  disabled={!invoice.signatureTyped}
                >
                  Use Typed
                </Button>
              </div>
            </div>
          )}

          {selectedMode === "upload" && (
            <div className="space-y-2">
              <Label>Upload Signature</Label>
              <FilePicker
                accept="image/png, image/jpeg, image/jpg"
                onFile={(file) => {
                  handleSignatureUpload(file);
                  updateInvoice({ signatureMode: "upload" });
                }}
                fileLabel={invoice.signature ? "Image selected" : "No file chosen"}
              />
              {invoice.signature && (
                <div className="border rounded-lg p-3 bg-muted/20">
                  <div className="text-xs text-muted-foreground mb-2">Selected image</div>
                  <div className="flex items-center justify-between gap-4">
                    <img src={invoice.signature} alt="Signature" className="h-12 object-contain bg-white rounded-md p-1 border" />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => updateInvoice({ signature: undefined })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
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
          onValueChange={(val) => updateInvoice({ template: val as TemplateKey })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="classic">Classic</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
            <SelectItem value="corporate">Corporate</SelectItem>
            <SelectItem value="freelancer">Freelancer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label className="text-base">Color Theme</Label>
        <Popover>
          <PopoverTrigger render={
            <Button variant="outline" className="w-[140px] justify-start text-left font-normal px-3">
              <div 
                className="w-4 h-4 rounded-full border border-border mr-2" 
                style={{ backgroundColor: invoice.colorTheme || "#2563eb" }}
              />
              <span className="font-mono text-sm uppercase text-muted-foreground">
                {invoice.colorTheme || "#2563eb"}
              </span>
            </Button>
          } />
          <PopoverContent className="w-auto p-3 flex flex-col gap-3" align="start">
            <HexColorPicker 
              color={invoice.colorTheme || "#2563eb"} 
              onChange={(color) => updateInvoice({ colorTheme: color })} 
            />
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-xs font-semibold">HEX</div>
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
            <Switch id="showRibbon" checked={invoice.showRibbon ?? true} onCheckedChange={(c: boolean) => updateInvoice({ showRibbon: c })} />
            <Label htmlFor="showRibbon">Ribbon</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="showFooter" checked={invoice.showFooter ?? true} onCheckedChange={(c: boolean) => updateInvoice({ showFooter: c })} />
            <Label htmlFor="showFooter">Footer</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="showPageNumbers" checked={invoice.showPageNumbers ?? true} onCheckedChange={(c: boolean) => updateInvoice({ showPageNumbers: c })} />
            <Label htmlFor="showPageNumbers">Page No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="showWatermark" checked={invoice.showWatermark ?? false} onCheckedChange={(c: boolean) => updateInvoice({ showWatermark: c })} />
            <Label htmlFor="showWatermark">Watermark</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
