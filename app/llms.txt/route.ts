import { APP_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

function buildLlmsText() {
  return `# ${APP_NAME}

Site: ${SITE_URL}

## Summary.
${APP_NAME} is a local-first collection of free business tools that run in your browser (client-side). No signup. No backend database for your documents by default.

## Tools

### Invoice Generator
URL: ${SITE_URL}/invoice-generator
Editor: ${SITE_URL}/invoice-generator/tool
Keywords: invoice generator, PDF invoice, invoice template, free invoice generator
Purpose: Create invoices and export a PDF invoice.
Inputs: Business/client details, line items, discounts, taxes, shipping, notes/terms, signature.
Payments: UPI QR (INR), bank details, payment URL.
Templates: modern, minimal.
Output: PDF preview + PDF download.
Storage: Autosave in browser storage + saved invoices list (last 50).
Share: Share a link to open the same invoice draft (no backend upload).

### Payslip Generator (Salary Slip PDF)
URL: ${SITE_URL}/payslip-generator
Editor: ${SITE_URL}/payslip-generator/tool
Keywords: payslip generator, salary slip PDF, payslip template
Purpose: Generate a salary slip and export a PDF payslip.
Inputs: Employer/employee details, pay period, earnings, deductions, totals, optional signature.
Templates: modern, minimal.
Output: PDF preview + PDF download.
Storage: Autosave in browser storage + saved payslips list (last 50).
Share: Share a link to open the same payslip draft (no backend upload).

### QR Code Generator (Custom + Logo)
URL: ${SITE_URL}/qr-code-generator
Editor: ${SITE_URL}/qr-code-generator/tool
Keywords: qr code generator, qr code generator for printing, cmyk qr code, qr code with logo
Purpose: Generate custom QR codes for web and print, including CMYK export for printing.
Inputs: raw, url, phone, sms, twitter, tweet, wifi, email, event (iCal/Google), upi.
Customization: colors, shapes, logo.
Output formats: PNG, JPEG, TIFF, SVG.
Color space: RGB and CMYK (CMYK supported for JPEG/TIFF).
Usage: Unlimited usage, no signup required.
Storage: Autosave in browser storage + saved QR list (last 50).
Share: Share a link to open the same QR setup (no backend upload).

## Crawling & indexing
- robots.txt: ${SITE_URL}/robots.txt
- sitemap.xml: ${SITE_URL}/sitemap.xml
- llms.txt: ${SITE_URL}/llms.txt

## Privacy
These tools are local-first. Data is generated and stored on your device in browser storage by default.`;
}

export function GET() {
  return new Response(buildLlmsText(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
