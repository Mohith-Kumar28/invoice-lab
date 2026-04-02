# Payslip Generator

## Layout
- Left panel: multi-section form (accordion)
- Right panel: live PDF preview (React-PDF)
- Mobile: preview opens in a bottom sheet via “Preview PDF”

## Sections & Fields

### Employer Details
- Company Name
- Company Address
- Company Logo (Optional)
  - Upload logo
  - Max size: 2MB
  - Recommended: PNG or SVG with transparent background

### Employee Details
- Employee Name
- Employee Code
- UAN
- Date of Joining
- PAN Number
- Department
- Bank Name
- Bank Account Number

### Pay Period & Leave
- Month
- Year
- Payable Days
- Leave Balance
- LOP Days (Loss of Pay days)

### Tax Regime
- New Regime / Old Regime

### Earnings
- Repeating rows:
  - Earning Name
  - Amount (₹)
- Add Custom Earning

### Deductions
- Repeating rows:
  - Deduction Name
  - Amount (₹)
- Income Tax deduction:
  - Auto-calculated based on tax regime & slabs (editable)
- Add Custom Deduction

### Summary (Calculated)
- Gross Pay = sum(Earnings)
- Deductions = sum(Deductions)
- Net Pay = Gross Pay − Deductions

### Design & Branding
- Template (Modern / Classic / Minimal / Bold)
- Color Theme (used in PDF header/bands)
- Display Options
  - Ribbon
  - Footer
  - Page Numbers
  - Watermark
  - Logo

## Actions
- Generate Payslip
  - Validates required inputs (company name, employee name)
  - Generates a PDF and downloads it
- Saved Payslips
  - Automatically saves the latest 50 payslips while you edit
- Reset
  - Clears the current payslip state back to defaults

## Notes on Tax Calculation
- The “Income Tax” deduction is auto-updated when:
  - Earnings change, or
  - Tax regime changes
- Current implementation uses a simplified slab-based annual tax estimate derived from monthly gross × 12, then spreads to monthly.
- This is not a substitute for statutory payroll computation (no exemptions, surcharges, or per-employee declaration handling).
