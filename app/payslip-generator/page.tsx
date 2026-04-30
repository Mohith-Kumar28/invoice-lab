import {
  ArrowRight,
  BadgeCheck,
  FileSignature,
  Lock,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { PayslipVisual } from "@/components/marketing/ToolVisuals";
import { Button } from "@/components/ui/button";
import {
  APP_NAME,
  GITHUB_ISSUES_URL,
  GITHUB_REPO_URL,
  SITE_URL,
} from "@/lib/site";

const CANONICAL_URL = `${SITE_URL}/payslip-generator`;

const TEMPLATES = ["modern", "minimal"] as const;

const FAQ = [
  {
    q: "Is this salary slip / payslip generator free?",
    a: "Yes. It’s free to use and runs in your browser.",
  },
  {
    q: "Is my data private?",
    a: "Yes. The tool is local-first, so your payslip data stays on your device in your browser storage.",
  },
  {
    q: "Can I export a PDF payslip?",
    a: "Yes. You can generate and download a PDF payslip from the tool.",
  },
  {
    q: "Can I customize the layout and details?",
    a: "Yes. You can enter employer/employee details and customize the payslip content before exporting.",
  },
  {
    q: "Is this payslip generator fully client-side?",
    a: "Yes. It runs in your browser, and your payslip data stays local to your device.",
  },
  {
    q: "Can I share a payslip draft?",
    a: "Yes. You can share a link that opens the same payslip draft on another device (without uploading your payslip data to a backend).",
  },
  {
    q: "Why did you build this payslip generator?",
    a: "I built it to generate clean, consistent salary slips quickly, with local-first drafts and simple PDF export.",
  },
  {
    q: "Is this open source? Can I contribute?",
    a: `Yes. It’s open source and you can contribute features or fixes on GitHub: ${GITHUB_REPO_URL}`,
  },
  {
    q: "Where can I request features or report issues?",
    a: `Please open an issue on GitHub: ${GITHUB_ISSUES_URL}`,
  },
] as const;

export const metadata: Metadata = {
  title: `Payslip Generator (Salary Slip PDF) | ${APP_NAME}`,
  description:
    "Generate a clean salary slip in minutes. Add employer/employee details, earnings and deductions, then export a PDF payslip — local-first in your browser.",
  keywords: [
    "payslip generator",
    "salary slip generator",
    "salary slip pdf",
    "payslip template",
    "generate payslip",
  ],
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    type: "website",
    url: CANONICAL_URL,
    title: `Payslip Generator (Salary Slip PDF) | ${APP_NAME}`,
    description:
      "Generate a clean salary slip in minutes. Add employer/employee details, earnings and deductions, then export a PDF payslip — local-first in your browser.",
  },
  twitter: {
    card: "summary",
    title: `Payslip Generator (Salary Slip PDF) | ${APP_NAME}`,
    description:
      "Generate a clean salary slip in minutes. Add employer/employee details, earnings and deductions, then export a PDF payslip — local-first in your browser.",
  },
};

export const dynamic = "force-dynamic";

export default function PayslipGeneratorLandingPage() {
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
    name: "Payslip Generator",
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
            Payslip generator • Salary slip PDF • Local-first
          </>
        }
        title={
          <>
            Payslip Generator
            <span className="text-muted-foreground"> — salary slip PDF</span>
          </>
        }
        description="Generate a clean salary slip in minutes. Add employer/employee details, earnings and deductions, then export a PDF payslip for records."
        primaryAction={{
          href: "/payslip-generator/tool",
          label: "Generate payslip",
        }}
        secondaryAction={{
          href: "#payslip-features",
          label: "Payslip features",
          variant: "outline",
        }}
        bullets={[
          {
            icon: <FileSignature className="h-4 w-4" />,
            text: `Templates: ${TEMPLATES.join(" · ")}`,
          },
          {
            icon: <FileSignature className="h-4 w-4" />,
            text: "PDF export + preview",
          },
          { icon: <Lock className="h-4 w-4" />, text: "Local-first autosave" },
          { icon: <Lock className="h-4 w-4" />, text: "Runs in your browser" },
        ]}
        visual={<PayslipVisual />}
      />

      <MarketingSection
        id="payslip-features"
        title="Clean payslips with a clear breakdown"
        description="Generate salary slips with earnings and deductions, then export a consistent PDF."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border/40 bg-background/60 backdrop-blur p-6">
            <h3 className="text-lg font-semibold">Details included</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Employer + employee details</li>
              <li>Pay period and payment date</li>
              <li>Earnings, deductions, totals</li>
              <li>Net pay summary</li>
              <li>Optional signature on PDF</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border/40 bg-background/60 backdrop-blur p-6">
            <h3 className="text-lg font-semibold">Output + storage</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>PDF payslip preview + download</li>
              <li>Local-first autosave in browser storage</li>
              <li>Saved payslips list for quick reuse</li>
              <li>No signup, no backend storage</li>
              <li>Share a link to open the same payslip draft</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border/40 bg-[radial-gradient(900px_circle_at_15%_0%,hsl(var(--secondary))/0.12,transparent_55%)] p-6">
          <h3 className="text-lg font-semibold">Payslip templates</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose a payslip template style and export a consistent salary slip
            PDF every time.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-border/40 bg-background/70 px-3 py-1 text-sm"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/payslip-generator/tool" />}
              className="h-11 px-6"
            >
              Generate salary slip PDF
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="#faq" />}
              variant="outline"
              className="h-11 px-6"
            >
              Payslip generator FAQ
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
                Quick answers about salary slips, privacy, and PDF export.
              </p>
            </div>

            <div className="divide-y rounded-2xl border border-border/40 bg-background/60 backdrop-blur">
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
                render={<Link href="/payslip-generator/tool" />}
                size="lg"
                className="h-11 px-6 w-full sm:w-auto"
              >
                Generate payslip
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
