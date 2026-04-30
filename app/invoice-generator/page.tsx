import {
  ArrowRight,
  BadgeCheck,
  FileText,
  Lock,
  Palette,
  QrCode,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { InvoiceVisual } from "@/components/marketing/ToolVisuals";
import { Button } from "@/components/ui/button";
import {
  APP_NAME,
  GITHUB_ISSUES_URL,
  GITHUB_REPO_URL,
  SITE_URL,
} from "@/lib/site";

const CANONICAL_URL = `${SITE_URL}/invoice-generator`;

const TEMPLATES = ["modern", "minimal"] as const;

const FAQ = [
  {
    q: "Is this invoice generator free?",
    a: "Yes. It’s free to use and runs in your browser.",
  },
  {
    q: "Do you store my invoices or client data?",
    a: "No. The tool is local-first, so your data stays on your device in your browser storage.",
  },
  {
    q: "Can I export a PDF invoice?",
    a: "Yes. You can generate and download a polished PDF invoice from the tool.",
  },
  {
    q: "Can I add taxes, discounts, and payment details?",
    a: "Yes. You can add line items, discounts, taxes, and payment details like UPI QR, bank details, or a payment URL.",
  },
  {
    q: "Can I share an invoice draft?",
    a: "Yes. You can share a link that opens the same invoice draft on another device (without uploading your invoice data to a backend).",
  },
  {
    q: "Why did you build this invoice generator?",
    a: `I built this invoice generator to be fast, local-first, and easy to use without accounts or subscriptions.`,
  },
  {
    q: "Is this invoice generator open source? Can I contribute?",
    a: `Yes. It’s open source and contributions are welcome: ${GITHUB_REPO_URL}`,
  },
  {
    q: "Where can I request features or report issues?",
    a: `Please open an issue on GitHub: ${GITHUB_ISSUES_URL}`,
  },
] as const;

export const metadata: Metadata = {
  title: `Free Invoice Generator (PDF) | ${APP_NAME}`,
  description:
    "Create professional invoices in minutes. Add line items, discounts, taxes, and payment details, then export a clean PDF — local-first in your browser.",
  keywords: [
    "invoice generator",
    "free invoice generator",
    "pdf invoice generator",
    "invoice template",
    "create invoice",
  ],
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    type: "website",
    url: CANONICAL_URL,
    title: `Free Invoice Generator (PDF) | ${APP_NAME}`,
    description:
      "Create professional invoices in minutes. Add line items, discounts, taxes, and payment details, then export a clean PDF — local-first in your browser.",
  },
  twitter: {
    card: "summary",
    title: `Free Invoice Generator (PDF) | ${APP_NAME}`,
    description:
      "Create professional invoices in minutes. Add line items, discounts, taxes, and payment details, then export a clean PDF — local-first in your browser.",
  },
};

export const dynamic = "force-dynamic";

export default function InvoiceGeneratorLandingPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Invoice Generator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: 0, priceCurrency: "INR" },
    url: CANONICAL_URL,
  };

  return (
    <main className="w-full">
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">
        {JSON.stringify(softwareJsonLd)}
      </script>

      <MarketingHero
        badge={
          <>
            <BadgeCheck className="h-4 w-4 text-primary" />
            Free invoice generator • Local-first • No signup
          </>
        }
        title={
          <>
            Invoice Generator
            <span className="text-muted-foreground"> — PDF invoice</span>
          </>
        }
        description="Create a professional invoice in minutes. Add line items, discounts, taxes, and payment details, then export a clean PDF invoice your client can pay from."
        primaryAction={{
          href: "/invoice-generator/tool",
          label: "Generate invoice",
        }}
        secondaryAction={{
          href: "#invoice-features",
          label: "Invoice features",
          variant: "outline",
        }}
        bullets={[
          { icon: <FileText className="h-4 w-4" />, text: "Invoice templates" },
          { icon: <Palette className="h-4 w-4" />, text: "Branding controls" },
          { icon: <QrCode className="h-4 w-4" />, text: "UPI QR + bank + link" },
          { icon: <Lock className="h-4 w-4" />, text: "Runs in your browser" },
        ]}
        visual={<InvoiceVisual />}
      />

      <MarketingSection
        id="invoice-features"
        title="Everything you need to send a PDF invoice"
        description="A fast invoice generator with the essentials, plus export and payment-friendly add‑ons."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-background/60 backdrop-blur p-6">
            <h3 className="text-lg font-semibold">Invoice essentials</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Business + client details</li>
              <li>Line items, quantity, rate</li>
              <li>Discounts, taxes, shipping</li>
              <li>Notes, terms, and footer</li>
              <li>Signature: draw, type, or upload</li>
            </ul>
          </div>
          <div className="rounded-2xl border bg-background/60 backdrop-blur p-6">
            <h3 className="text-lg font-semibold">Payments + export</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>UPI QR (INR), bank details, or payment URL</li>
              <li>Instant PDF invoice export</li>
              <li>Local-first autosave + saved invoices list</li>
              <li>Share a link to open the same invoice draft</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border bg-[radial-gradient(900px_circle_at_15%_0%,hsl(var(--primary))/0.12,transparent_55%)] p-6">
          <h3 className="text-lg font-semibold">Supported invoice templates</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick a layout that matches your brand. This invoice generator
            supports:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border bg-background/70 px-3 py-1 text-sm"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/invoice-generator/tool" />}
              className="h-11 px-6"
            >
              Create a PDF invoice
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="#faq" />}
              variant="outline"
              className="h-11 px-6"
            >
              Invoice generator FAQ
            </Button>
          </div>
        </div>
      </MarketingSection>

      <section id="faq" className="border-t bg-muted/10">
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">FAQ</h2>
              <p className="text-muted-foreground">
                Quick answers about invoices, privacy, and PDF export.
              </p>
            </div>

            <div className="divide-y rounded-2xl border bg-background/60 backdrop-blur">
              {FAQ.map((f) => (
                <details key={f.q} className="p-5">
                  <summary className="cursor-pointer font-medium">
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>

            <div className="pt-2">
              <Button
                nativeButton={false}
                render={<Link href="/invoice-generator/tool" />}
                size="lg"
                className="h-11 px-6 w-full sm:w-auto"
              >
                Generate invoice
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
