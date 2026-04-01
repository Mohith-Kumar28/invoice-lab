"use client";

import { useInvoiceStore } from "@/store/invoice.store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/shared/DatePicker";
import { LineItemsTable } from "./LineItemsTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TemplateKey } from "@/features/templates/renderers";

export function InvoiceForm() {
  const { invoice, updateInvoice } = useInvoiceStore();

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Invoice Details</h1>
      </div>

      <Accordion multiple defaultValue={["section-1", "section-2", "section-3", "section-4", "section-5", "section-6"]} className="w-full">
        {/* SECTION 1: Invoice Details */}
        <AccordionItem value="section-1" className="bg-card rounded-xl border px-4 mb-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
            1. Invoice Details
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={invoice.invoiceNumber || ""}
                  onChange={(e) => updateInvoice({ invoiceNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Invoice Title</Label>
                <Input
                  id="title"
                  value={invoice.title || ""}
                  onChange={(e) => updateInvoice({ title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <DatePicker
                  date={invoice.issueDate ? new Date(invoice.issueDate) : undefined}
                  setDate={(date) => updateInvoice({ issueDate: date || new Date() })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <DatePicker
                  date={invoice.dueDate ? new Date(invoice.dueDate) : undefined}
                  setDate={(date) => updateInvoice({ dueDate: date || new Date() })}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 2: From (Your Business) */}
        <AccordionItem value="section-2" className="bg-card rounded-xl border px-4 mb-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
            2. From (Your Business)
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromBusinessName">Business Name</Label>
                <Input
                  id="fromBusinessName"
                  value={invoice.from?.businessName || ""}
                  onChange={(e) =>
                    updateInvoice({
                      from: { ...invoice.from!, businessName: e.target.value },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={invoice.from?.email || ""}
                    onChange={(e) =>
                      updateInvoice({
                        from: { ...invoice.from!, email: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromPhone">Phone</Label>
                  <Input
                    id="fromPhone"
                    value={invoice.from?.phone || ""}
                    onChange={(e) =>
                      updateInvoice({
                        from: { ...invoice.from!, phone: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 3: Bill To (Client) */}
        <AccordionItem value="section-3" className="bg-card rounded-xl border px-4 mb-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
            3. Bill To (Client)
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="toBusinessName">Client Business Name</Label>
                <Input
                  id="toBusinessName"
                  value={invoice.to?.businessName || ""}
                  onChange={(e) =>
                    updateInvoice({
                      to: { ...invoice.to!, businessName: e.target.value },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="toEmail">Client Email</Label>
                  <Input
                    id="toEmail"
                    type="email"
                    value={invoice.to?.email || ""}
                    onChange={(e) =>
                      updateInvoice({
                        to: { ...invoice.to!, email: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 4: Line Items */}
        <AccordionItem value="section-4" className="bg-card rounded-xl border px-4 mb-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
            4. Line Items
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <LineItemsTable />
          </AccordionContent>
        </AccordionItem>
        {/* SECTION 5: Pricing & Taxes */}
        <AccordionItem value="section-5" className="bg-card rounded-xl border px-4 mb-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
            5. Pricing & Taxes
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount Value</Label>
                <div className="flex gap-2">
                  <select
                    className="flex h-10 w-1/3 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={invoice.discountType || "percentage"}
                    onChange={(e) => updateInvoice({ discountType: e.target.value as "percentage" | "fixed" })}
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">Fixed</option>
                  </select>
                  <Input
                    id="discountValue"
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-2/3"
                    value={invoice.discountValue || 0}
                    onChange={(e) => updateInvoice({ discountValue: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingFee">Shipping Fee</Label>
                <Input
                  id="shippingFee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={invoice.shippingFee || 0}
                  onChange={(e) => updateInvoice({ shippingFee: Number(e.target.value) })}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 6: Design & Theme */}
        <AccordionItem value="section-6" className="bg-card rounded-xl border px-4 mb-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
            6. Design & Theme
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
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
                          if (val.startsWith('#') && (val.length === 4 || val.length === 7)) {
                            updateInvoice({ colorTheme: val });
                          } else {
                            updateInvoice({ colorTheme: val });
                          }
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
