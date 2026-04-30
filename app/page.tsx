import {
  ArrowRight,
  BadgeCheck,
  FileSignature,
  FileText,
  Lock,
  QrCode,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import {
  InvoiceVisual,
  PayslipVisual,
  QrCodeVisual,
} from "@/components/marketing/ToolVisuals";
import {
  APP_NAME,
  GITHUB_ISSUES_URL,
  GITHUB_REPO_URL,
  SITE_URL,
} from "@/lib/site";

const CANONICAL_URL = `${SITE_URL}/`;

const FAQ = [
  {
    q: `Is ${APP_NAME} free?`,
    a: `Yes. ${APP_NAME} is free to use. You can generate documents and export PDFs without creating an account.`,
  },
  {
    q: "Where is my data stored?",
    a: "In your browser storage. Your documents are generated on your device.",
  },
  {
    q: "Do you upload invoices or payslips to a backend?",
    a: `No. ${APP_NAME} is local-first and does not run a backend that stores your document data.`,
  },
  {
    q: "Why did you build this?",
    a: `I built ${APP_NAME} to make fast, clean document tools that don’t require signup and keep data local-first.`,
  },
  {
    q: "Is this open source? Can I contribute?",
    a: `Yes. ${APP_NAME} is open source. You can contribute new features or improvements on GitHub: ${GITHUB_REPO_URL}`,
  },
  {
    q: "Where can I report a bug or request a feature?",
    a: `Please open an issue on GitHub: ${GITHUB_ISSUES_URL}`,
  },
  {
    q: "Does it work offline?",
    a: "After the site loads once, many parts can keep working if your connection drops. For best results, keep the tab open while editing.",
  },
  {
    q: "How do I clear saved data?",
    a: "Saved drafts live in your browser storage. You can clear site data from your browser settings to remove saved history.",
  },
  {
    q: "Can I use it on mobile?",
    a: "Yes. The landing pages and tools are responsive and work on mobile and desktop.",
  },
] as const;

export const metadata: Metadata = {
  title: `${APP_NAME} — Free Invoice, Payslip & QR Tools`,
  description:
    "Create professional invoices, payslips, and QR codes in minutes. Local-first, privacy-friendly, and built for fast PDF export.",
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    type: "website",
    url: CANONICAL_URL,
    title: `${APP_NAME} — Free Invoice, Payslip & QR Tools`,
    description:
      "Create professional invoices, payslips, and QR codes in minutes. Local-first, privacy-friendly, and built for fast PDF export.",
  },
  twitter: {
    card: "summary",
    title: `${APP_NAME} — Free Invoice, Payslip & QR Tools`,
    description:
      "Create professional invoices, payslips, and QR codes in minutes. Local-first, privacy-friendly, and built for fast PDF export.",
  },
};

export default function HomePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="w-full">
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>

      <MarketingHero
        badge={
          <>
            <BadgeCheck className="h-4 w-4 text-primary" />
            Free • Local-first • No signup
          </>
        }
        title={
          <>
            {APP_NAME}
            <span className="text-muted-foreground"> — document tools</span>
          </>
        }
        description="Create invoices, payslips, and QR codes in minutes. Clean layouts, fast export, and a privacy-first workflow that stays on your device."
        primaryAction={{
          href: "/invoice-generator",
          label: "Create invoice",
        }}
        secondaryAction={{
          href: "/payslip-generator",
          label: "Generate payslip",
          variant: "outline",
        }}
        tertiaryAction={{
          href: "/qr-code-generator",
          label: "Generate QR",
          variant: "outline",
        }}
        bullets={[
          { icon: <FileText className="h-4 w-4" />, text: "Invoice templates" },
          {
            icon: <FileSignature className="h-4 w-4" />,
            text: "Payslip layouts",
          },
          { icon: <QrCode className="h-4 w-4" />, text: "QR for anything" },
          { icon: <Lock className="h-4 w-4" />, text: "Privacy-first" },
        ]}
        visual={
          <div className="relative mx-auto max-w-lg">
            <div className="absolute -inset-4 bg-[radial-gradient(700px_circle_at_40%_20%,hsl(var(--primary))/0.10,transparent_55%)] blur-2xl" />
            <div className="relative">
              <div className="hidden sm:block absolute -left-6 top-10 w-[92%] rotate-[-6deg] opacity-80">
                <PayslipVisual />
              </div>
              <div className="absolute -right-6 top-14 w-[86%] rotate-[7deg] opacity-85">
                <QrCodeVisual />
              </div>
              <div className="relative w-full">
                <InvoiceVisual />
              </div>
            </div>
          </div>
        }
      />

      <section className="w-full bg-muted/10">
        <div className="container mx-auto px-4 md:px-6 py-14 md:py-20">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Pick a tool. Generate. Export.
              </h2>
              <p className="mt-2 text-muted-foreground max-w-2xl">
                Each tool has an SEO landing page with features and FAQs, plus a
                focused editor for fast PDF export.
              </p>
            </div>
       
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <Link href="/invoice-generator" className="group">
              <div className="rounded-2xl border border-border/40 bg-background/60 backdrop-blur overflow-hidden transition-shadow group-hover:shadow-md">
                <div className="p-5">
                  <div className="text-sm font-medium">Invoice Generator</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Line items, taxes, discounts, signature, and payment options
                    — export a clean PDF.
                  </div>
                </div>
                <div className="border-t border-border/40 bg-muted/10 p-6">
                  <div className="scale-[0.92] origin-top">
                    <InvoiceVisual />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/payslip-generator" className="group">
              <div className="rounded-2xl border border-border/40 bg-background/60 backdrop-blur overflow-hidden transition-shadow group-hover:shadow-md">
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">Payslip Generator</div>
                    <span className="border border-border/40 rounded-full text-xs px-2 py-0.5 text-muted-foreground bg-background/50">
                      New
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Generate salary slips with earnings/deductions and export a
                    professional PDF payslip.
                  </div>
                </div>
                <div className="border-t border-border/40 bg-muted/10 p-6">
                  <div className="scale-[0.92] origin-top">
                    <PayslipVisual />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/qr-code-generator" className="group">
              <div className="rounded-2xl border border-border/40 bg-background/60 backdrop-blur overflow-hidden transition-shadow group-hover:shadow-md">
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">QR Code Generator</div>
                    <span className="border border-border/40 rounded-full text-xs px-2 py-0.5 text-muted-foreground bg-background/50">
                      New
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    URLs, Wi‑Fi, email, events, and more — with colors, shapes,
                    and logo support.
                  </div>
                </div>
                <div className="border-t border-border/40 bg-muted/10 p-6">
                  <div className="scale-[0.92] origin-top">
                    <QrCodeVisual />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <MarketingSection
        title="Local-first by design"
        description="Clean output, fast export, and a workflow that keeps your data on your device."
        className="bg-background"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border/40 bg-background/60 p-5">
            <div className="text-sm font-medium">No signup</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Open a tool and start generating. No account required.
            </p>
          </div>
          <div className="rounded-xl border border-border/40 bg-background/60 p-5">
            <div className="text-sm font-medium">Privacy-first</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Documents are generated in the browser. No backend storage.
            </p>
          </div>
          <div className="rounded-xl border border-border/40 bg-background/60 p-5">
            <div className="text-sm font-medium">Export-ready</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Produce polished PDFs you can send instantly.
            </p>
          </div>
        </div>
        <div className="mt-8 rounded-2xl border border-border/40 bg-[radial-gradient(900px_circle_at_18%_0%,hsl(var(--primary))/0.12,transparent_55%),radial-gradient(700px_circle_at_82%_110%,hsl(var(--accent))/0.10,transparent_55%)] p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Step 1</div>
              <div className="text-sm font-medium">Fill details</div>
              <div className="text-sm text-muted-foreground">
                Enter business/client data or payslip details.
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Step 2</div>
              <div className="text-sm font-medium">Style the output</div>
              <div className="text-sm text-muted-foreground">
                Pick a template, tweak layout, and add branding where needed.
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Step 3</div>
              <div className="text-sm font-medium">Export</div>
              <div className="text-sm text-muted-foreground">
                Download a PDF or a QR image in seconds.
              </div>
            </div>
          </div>
        </div>
      </MarketingSection>

      <section id="faq" className="w-full">
        <div className="container mx-auto px-4 md:px-6 py-14 md:py-20">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">FAQ</h2>
              <p className="text-muted-foreground">
                Quick answers about pricing, privacy, and compatibility.
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

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                nativeButton={false}
                render={<Link href="/invoice-generator" />}
                size="lg"
                className="h-11 px-6"
              >
                Create invoice
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/qr-code-generator" />}
                size="lg"
                variant="outline"
                className="h-11 px-6"
              >
                Generate QR
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
