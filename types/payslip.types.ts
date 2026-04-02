import type { PdfBrand } from "@/hooks/usePdfBrand";

export type TaxRegime = "new" | "old";

export type PayslipTemplateKey = "modern" | "classic" | "minimal" | "bold";

export type PayslipLine = {
  id: string;
  name: string;
  amount: number;
  isAuto?: boolean;
};

export type Payslip = {
  id: string;
  employer: {
    companyName: string;
    companyAddress: string;
    logo?: string;
  };
  employee: {
    employeeName: string;
    employeeCode: string;
    uan: string;
    dateOfJoining?: Date;
    panNumber: string;
    department: string;
    bankName: string;
    bankAccountNumber: string;
  };
  payPeriod: {
    month: number;
    year: number;
    payableDays: number;
    leaveBalance: number;
    lopDays: number;
  };
  taxRegime: TaxRegime;
  earnings: PayslipLine[];
  deductions: PayslipLine[];
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  template: PayslipTemplateKey;
  colorTheme: string;
  showLogo: boolean;
  showRibbon: boolean;
  showFooter: boolean;
  showPageNumbers: boolean;
  showWatermark: boolean;
  pdfFileName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  pdfBrand?: PdfBrand;
};
