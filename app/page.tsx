import {
  ArrowRight,
  BadgeCheck,
  FileSignature,
  FileText,
  Gauge,
  Lock,
  Palette,
  QrCode,
  Save,
} from "lucide-react";
import Link from "next/link";
import { ToolCard } from "@/components/tools/ToolCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/site";

export default function HomePage() {
  return (
    <div className="w-full">
      <section className="border-b bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="mx-auto max-w-4xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/50 px-3 py-1 text-sm text-muted-foreground">
              <BadgeCheck className="h-4 w-4 text-primary" />
              Free • Local-first • No signup
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {APP_NAME}{" "}
              <span className="text-muted-foreground">
                — Free Business Tools
              </span>
            </h1>
            <p className="text-muted-foreground md:text-lg">
              Create professional documents in minutes. Customize design, export
              a PDF, and keep your data on your device.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Button
                nativeButton={false}
                render={<Link href="/invoice-generator" />}
                size="lg"
                className="h-11 px-6"
              >
                Create Invoice
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/payslip-generator" />}
                variant="secondary"
                size="lg"
                className="h-11 px-6"
              >
                Generate Payslip
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="#faq" />}
                variant="outline"
                size="lg"
                className="h-11 px-6"
              >
                FAQ
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Tools</h2>
            <p className="text-muted-foreground">
              A growing collection of local-first utilities.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ToolCard
              href="/invoice-generator"
              title="Invoice Generator"
              description="Create and export professional invoices with templates, discounts, taxes, signatures and payment options."
              icon={<FileText />}
            />
            <ToolCard
              href="/payslip-generator"
              title="Payslip Generator"
              description="Design clean payslips with multiple template styles, auto-save and full PDF export."
              icon={<FileSignature />}
              badge="New"
            />
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Gauge className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Fast PDF Export</CardTitle>
                <CardDescription>
                  Render and download a polished PDF right from your browser.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Lock className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Privacy-first</CardTitle>
                <CardDescription>
                  We don’t run a backend that stores your invoices or client
                  data.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Palette className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Design & Branding</CardTitle>
                <CardDescription>
                  Pick a template style, tweak colors, and control what appears
                  on the PDF.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid gap-6 mt-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <QrCode className="h-10 w-10 text-primary mb-2" />
                <CardTitle>UPI Payments</CardTitle>
                <CardDescription>
                  Add a UPI ID to generate a QR code that opens a UPI app with
                  the invoice amount.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>
                  Works with UPI deep links (upi://pay) so the payment app can
                  prefill amount and note.
                </div>
                <div>
                  For non-INR invoices, use bank details or a payment URL.
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Save className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Auto-save</CardTitle>
                <CardDescription>
                  Invoices are saved locally after you stop typing, so you don’t
                  lose progress.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>Saved invoices stay in your browser storage.</div>
                <div>
                  Logos/signatures are not stored with saved invoices to keep
                  storage small.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/10">
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>What’s included</CardTitle>
                <CardDescription>
                  Core features aimed at freelancers, founders, and small teams.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>
                  Invoice details, client details, line items, discounts, taxes,
                  shipping
                </div>
                <div>Design toggles: logos, footer, page number, watermark</div>
                <div>Signature: draw, type, or upload</div>
                <div>Payment: UPI QR, bank details, or payment URL</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Privacy & storage</CardTitle>
                <CardDescription>How your data is handled.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>Your invoices are generated in your browser.</div>
                <div>
                  Saved invoices live in local browser storage and can be
                  cleared by you at any time.
                </div>
                <div>
                  Large assets like logos/signatures aren’t saved inside saved
                  invoices to avoid storage limits.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="faq" className="w-full">
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-14 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is {APP_NAME} free?</AccordionTrigger>
              <AccordionContent>
                Yes. You can create invoices and export PDFs without paying or
                creating an account.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Where is my data stored?</AccordionTrigger>
              <AccordionContent>
                In your browser storage. {APP_NAME} does not send your invoice
                data to a backend for storage.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Why isn’t my logo saved with saved invoices?
              </AccordionTrigger>
              <AccordionContent>
                Logos and signatures can be large. They are kept out of saved
                invoices to avoid browser storage limits.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                Does the PDF include a watermark?
              </AccordionTrigger>
              <AccordionContent>
                Watermark is a display option. You can toggle it in Design &
                Branding.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>How does UPI QR work?</AccordionTrigger>
              <AccordionContent>
                When you select UPI payment and enter a UPI ID, {APP_NAME}{" "}
                generates a QR with a upi://pay link so a UPI app can open and
                prefill the amount.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="flex justify-center pt-8">
            <Button
              nativeButton={false}
              render={<Link href="/invoice-generator" />}
              size="lg"
              className="h-11 px-6"
            >
              Create an Invoice
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
