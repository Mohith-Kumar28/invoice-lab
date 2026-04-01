import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Zap, Palette, Globe, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/30 flex-1">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none max-w-3xl">
              Create stunning invoices in seconds. Free forever.
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              No signup required. 100% free, secure, and client-side. Download PDF instantly and look professional to your clients.
            </p>
            <div className="space-x-4 mt-6">
              <Button render={<Link href="/" />} size="lg" className="h-12 px-8 text-lg font-semibold">
                Create Invoice Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything you need</h2>
            <p className="mt-4 text-muted-foreground md:text-xl">Simple but powerful tools for freelancers and agencies.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>Generate professional PDFs instantly right in your browser.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>100% Secure</CardTitle>
                <CardDescription>Your data never leaves your device. Everything is saved locally.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Palette className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Customizable</CardTitle>
                <CardDescription>7 premium templates with custom colors and fonts to match your brand.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Globe className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Global Support</CardTitle>
                <CardDescription>150+ currencies and multiple tax lines (GST, VAT, etc.) supported.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Save className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Auto-Save</CardTitle>
                <CardDescription>Never lose your work. Invoices are automatically saved as you type.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <CardTitle>No Watermarks</CardTitle>
                <CardDescription>Completely free without any annoying watermarks or limits.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
        <div className="container px-4 md:px-6 mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
          </div>
          <Accordion className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is InvoiceForge completely free?</AccordionTrigger>
              <AccordionContent>
                Yes! InvoiceForge is 100% free to use. There are no premium tiers, hidden fees, or watermarks on your generated PDFs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Do I need to create an account?</AccordionTrigger>
              <AccordionContent>
                No signup is required. You can start creating invoices immediately. Your data is stored securely in your local browser storage.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is my invoice data secure?</AccordionTrigger>
              <AccordionContent>
                Yes, your data never leaves your device. We do not use any backend databases to store your business or client information.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
