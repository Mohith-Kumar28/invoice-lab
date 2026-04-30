import {
  ArrowRight,
  BadgeCheck,
  Brush,
  Lock,
  QrCode,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { QrCodeVisual } from "@/components/marketing/ToolVisuals";
import { Button } from "@/components/ui/button";
import {
  APP_NAME,
  GITHUB_ISSUES_URL,
  GITHUB_REPO_URL,
  SITE_URL,
} from "@/lib/site";

const CANONICAL_URL = `${SITE_URL}/qr-code-generator`;

const QR_INPUT_TYPES = [
  "raw",
  "url",
  "phone",
  "sms",
  "twitter",
  "tweet",
  "wifi",
  "email",
  "event",
  "upi",
] as const;

const QR_OUTPUT_FORMATS = ["png", "jpeg", "tiff", "svg"] as const;

const FAQ = [
  {
    q: "Is this QR code generator free?",
    a: "Yes. It’s free to use and runs in your browser.",
  },
  {
    q: "What can I generate QR codes for?",
    a: "URLs, Wi‑Fi, email, events and more.",
  },
  {
    q: "Can I customize colors and add a logo?",
    a: "Yes. You can customize styling and add a logo for brand-friendly QR codes.",
  },
  {
    q: "Do you upload my data?",
    a: "No. It’s local-first, so your content stays on your device in your browser.",
  },
  {
    q: "What file formats can I export?",
    a: "You can export QR codes as PNG, JPEG, TIFF, or SVG. For print workflows, CMYK export is supported for JPEG/TIFF.",
  },
  {
    q: "Can I share a QR code configuration?",
    a: "Yes. You can share a link that opens the same QR setup on another device (without uploading your QR content to a backend).",
  },
  {
    q: "Why did you build this QR code generator?",
    a: "I built it to create brand-friendly QR codes quickly, with local-first editing and reliable export formats.",
  },
  {
    q: "Is this open source? Can I contribute?",
    a: `Yes. It’s open source and you can contribute improvements on GitHub: ${GITHUB_REPO_URL}`,
  },
  {
    q: "Where can I request features or report issues?",
    a: `Please open an issue on GitHub: ${GITHUB_ISSUES_URL}`,
  },
] as const;

export const metadata: Metadata = {
  title: `QR Code Generator (Custom + Logo) | ${APP_NAME}`,
  description:
    "Generate QR codes for URLs, Wi‑Fi, email, events and more. Customize colors, shapes, and add a logo — local-first in your browser.",
  keywords: [
    "qr code generator",
    "free qr code generator",
    "custom qr code",
    "qr code with logo",
    "wifi qr code",
  ],
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    type: "website",
    url: CANONICAL_URL,
    title: `QR Code Generator (Custom + Logo) | ${APP_NAME}`,
    description:
      "Generate QR codes for URLs, Wi‑Fi, email, events and more. Customize colors, shapes, and add a logo — local-first in your browser.",
  },
  twitter: {
    card: "summary",
    title: `QR Code Generator (Custom + Logo) | ${APP_NAME}`,
    description:
      "Generate QR codes for URLs, Wi‑Fi, email, events and more. Customize colors, shapes, and add a logo — local-first in your browser.",
  },
};

export const dynamic = "force-dynamic";

export default function QrCodeGeneratorLandingPage() {
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
    name: "QR Code Generator",
    applicationCategory: "UtilityApplication",
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
            QR code generator • CMYK export • Unlimited usage
          </>
        }
        title={
          <>
            QR Code Generator
            <span className="text-muted-foreground"> — custom + logo</span>
          </>
        }
        description="Generate QR codes for URLs, Wi‑Fi, email, events, and UPI. Customize colors and shapes, add a logo, and export print‑ready files."
        primaryAction={{ href: "/qr-code-generator/tool", label: "Generate QR" }}
        secondaryAction={{
          href: "#qr-features",
          label: "QR code features",
          variant: "outline",
        }}
        bullets={[
          {
            icon: <QrCode className="h-4 w-4" />,
            text: `Inputs: ${QR_INPUT_TYPES.slice(0, 6).join(", ")}…`,
          },
          { icon: <Brush className="h-4 w-4" />, text: "Colors + logo support" },
          {
            icon: <BadgeCheck className="h-4 w-4" />,
            text: `Exports: ${QR_OUTPUT_FORMATS.join(" · ")}`,
          },
          { icon: <Lock className="h-4 w-4" />, text: "Local-first" },
        ]}
        visual={<QrCodeVisual />}
      />

      <MarketingSection
        id="qr-features"
        title="Reliable scans, clean branding, print-ready exports"
        description="Create a custom QR code, export it, and keep everything local in your browser."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border/40 bg-background/60 backdrop-blur p-6">
            <h3 className="text-lg font-semibold">Supported QR inputs</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>URL, raw text, phone, SMS</li>
              <li>Wi‑Fi QR code, email QR code</li>
              <li>Twitter / tweet QR code</li>
              <li>Event QR (iCal / Google)</li>
              <li>UPI QR</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border/40 bg-background/60 backdrop-blur p-6">
            <h3 className="text-lg font-semibold">Export formats</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>PNG (quick sharing)</li>
              <li>JPEG (print-friendly)</li>
              <li>TIFF (print workflows)</li>
              <li>SVG (vector)</li>
              <li>RGB + CMYK (CMYK for JPEG/TIFF)</li>
              <li>Share a link to open the same QR setup</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border/40 bg-[radial-gradient(900px_circle_at_15%_0%,hsl(var(--accent))/0.12,transparent_55%)] p-6">
          <h3 className="text-lg font-semibold">Customization</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Style the QR code to match your brand, then export the format you
            need.
          </p>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Dots + corner shapes
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Foreground/background colors
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Optional logo overlay
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Live preview before download
            </li>
          </ul>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/qr-code-generator/tool" />}
              className="h-11 px-6"
            >
              Generate a QR code
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="#faq" />}
              variant="outline"
              className="h-11 px-6"
            >
              QR code generator FAQ
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
                Quick answers about QR codes, customization, and privacy.
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
                render={<Link href="/qr-code-generator/tool" />}
                size="lg"
                className="h-11 px-6 w-full sm:w-auto"
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
