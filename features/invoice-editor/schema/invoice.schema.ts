import { z } from "zod";

export const addressSchema = z.object({
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
});

export const bankDetailsSchema = z.object({
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  swift: z.string().optional(),
  iban: z.string().optional(),
  upi: z.string().optional(),
});

export const lineItemSchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(1, "Description is required"),
  details: z.string().optional(),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  unit: z.string().optional(),
  unitPrice: z.coerce.number().min(0, "Price cannot be negative"),
  taxRate: z.coerce.number().min(0).optional(),
  discountPercent: z.coerce.number().min(0).max(100).optional(),
  amount: z.number(), // Computed
});

export const taxLineSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Tax name is required"),
  rate: z.coerce.number().min(0, "Rate cannot be negative"),
  amount: z.number(), // Computed
  compound: z.boolean(),
});

export const partialPaymentSchema = z.object({
  id: z.string().uuid(),
  amount: z.coerce.number().min(0, "Amount cannot be negative"),
  date: z.coerce.date(),
  note: z.string().optional(),
});

export const customFieldSchema = z.object({
  id: z.string().uuid(),
  label: z.string().optional().or(z.literal("")),
  value: z.string().optional().or(z.literal("")),
});

export const invoiceSchema = z
  .object({
    id: z.string().uuid(),
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    title: z.string().default("INVOICE"),
    status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]),
    template: z.string(),
    colorTheme: z.string(),
    currency: z.string(),
    locale: z.string(),

    issueDate: z.coerce.date(),
    dueDate: z.coerce.date(),
    deliveryDate: z.coerce.date().optional(),

    from: z.object({
      logo: z.string().optional(),
      businessName: z.string().min(1, "Business name is required"),
      contactName: z.string().optional(),
      email: z.string().email("Invalid email address").or(z.literal("")),
      phone: z.string().optional(),
      address: addressSchema,
      taxId: z.string().optional(),
      website: z.string().optional(),
      bankDetails: bankDetailsSchema.optional(),
      customFields: z.array(customFieldSchema).optional(),
    }),

    to: z.object({
      businessName: z.string().min(1, "Client business name is required"),
      contactName: z.string().optional(),
      email: z
        .string()
        .email("Invalid email address")
        .optional()
        .or(z.literal("")),
      phone: z.string().optional(),
      address: addressSchema,
      taxId: z.string().optional(),
      poNumber: z.string().optional(),
      customFields: z.array(customFieldSchema).optional(),
    }),

    lineItems: z.array(lineItemSchema),

    subtotal: z.number(),
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: z.coerce.number().min(0),
    discountAmount: z.number(),
    taxLines: z.array(taxLineSchema),
    shippingFee: z.coerce.number().min(0),
    total: z.number(),

    paymentTerms: z.enum([
      "due_on_receipt",
      "net_7",
      "net_15",
      "net_30",
      "net_45",
      "net_60",
      "net_90",
      "custom",
    ]),
    paymentMethods: z.array(z.string()),
    paymentInstructions: z.string().optional(),
    partialPayments: z.array(partialPaymentSchema).optional(),
    amountPaid: z.number(),
    amountDue: z.number(),

    notes: z.string().optional(),
    deliverables: z.string().optional(),
    terms: z.string().optional(),
    signature: z.string().optional(),
    attachments: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          url: z.string(),
        }),
      )
      .optional(),

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    sentAt: z.coerce.date().optional(),
    paidAt: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      // Due date should not be before issue date
      return data.dueDate >= data.issueDate;
    },
    {
      message: "Due date cannot be before issue date",
      path: ["dueDate"],
    },
  );

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
