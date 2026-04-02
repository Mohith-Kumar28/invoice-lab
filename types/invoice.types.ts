export interface Invoice {
  // Meta
  id: string; // UUID

  // Section 1: Invoice Details
  invoiceNumber: string; // e.g. INV-0042
  title: string; // e.g. TAX INVOICE, RECEIPT
  issueDate: Date;
  dueDate: Date;
  deliveryDate?: Date;
  poNumber?: string;
  currency: string;
  status?:
    | "draft"
    | "sent"
    | "paid"
    | "overdue"
    | "cancelled"
    | "partial"
    | "refunded"
    | "void";

  // Section 2: From (Business/Sender)
  from: {
    logo?: string; // base64 or URL
    businessName: string;
    contactName?: string;
    email: string;
    phone?: string;
    address: Address;
    taxId?: string; // VAT/GST/EIN
    website?: string;
  };

  // Section 3: To (Client/Recipient)
  to: {
    logo?: string;
    businessName: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address: Address;
    taxId?: string;
  };

  // Section 4: Line Items
  lineItems: LineItem[];

  // Section 5: Pricing & Taxes
  subtotal: number; // computed
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number; // computed
  taxLines: TaxLine[]; // support multiple tax lines (GST, VAT, etc.)
  shippingFee: number;
  total: number; // computed

  partialPayments?: PartialPayment[];
  amountPaid: number; // computed
  amountDue: number; // computed

  // Section 6: Payment Details
  paymentTerms?: PaymentTerm; // Net 30, Due on receipt, etc.
  paymentMethods: string[]; // Bank transfer, PayPal, Crypto, etc.
  paymentMode?: "upi" | "bank" | "url";
  bankDetails?: BankDetails;
  paymentLink?: string;
  lateFeePolicy?: string;

  // Section 7: Notes & Terms
  notes?: string; // visible on invoice
  deliverables?: string; // newline-separated
  terms?: string; // terms & conditions

  // Section 8: Signature
  signature?: string; // base64 SVG/PNG
  signatureTyped?: string;
  signatureName?: string;
  signatureRole?: string;
  showSignature: boolean;
  signatureMode?: "draw" | "type" | "upload";

  // Section 9: Design & Branding
  template: string;
  colorTheme: string;
  fontPairing: string;
  showLogo: boolean;
  showRibbon: boolean;
  showFooter: boolean;
  showPageNumbers: boolean;
  showWatermark: boolean;

  upiQr?: string;
  pdfFileName?: string;
  pdfBrand?: {
    primary: string;
    secondary: string;
    accent: string;
  };

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface LineItem {
  id: string;
  description: string;
  details?: string; // sub-description
  quantity: number;
  unit?: string; // hours, pcs, kg, days, etc.
  unitPrice: number;
  taxRate?: number; // per-line tax override
  discountPercent?: number; // per-line discount
  amount: number; // computed
}

export interface TaxLine {
  id: string;
  name: string; // e.g. "GST", "VAT", "Service Tax"
  rate: number;
  amount: number; // computed
  compound: boolean; // applied on top of other taxes
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface BankDetails {
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  ifsc?: string;
  routingNumber?: string;
  swift?: string;
  iban?: string;
  upi?: string; // Indian UPI
}

export interface PartialPayment {
  id: string;
  amount: number;
  date: Date;
  note?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
}

export type PaymentTerm =
  | "due_on_receipt"
  | "net_7"
  | "net_15"
  | "net_30"
  | "net_45"
  | "net_60"
  | "net_90"
  | "custom";
