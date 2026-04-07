import {
  ArrowRight,
  BadgeCheck,
  Brush,
  Globe,
  Lock,
  QrCode,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME, SITE_URL } from "@/lib/site";

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

      <header className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_-10%,hsl(var(--primary))/0.16,transparent_55%),radial-gradient(900px_circle_at_80%_0%,hsl(var(--primary))/0.10,transparent_50%)]" />
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-16 relative">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-sm text-muted-foreground">
                <BadgeCheck className="h-4 w-4 text-primary" />
                <span>
                  QR code generator • CMYK QR export • Unlimited usage
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                QR Code Generator
                <span className="text-muted-foreground"> — Custom + Logo</span>
              </h1>

              <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
                Generate QR codes for URLs, Wi‑Fi, email, events, and UPI.
                Customize colors and shapes, add a logo, and export print-ready
                QR files.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  nativeButton={false}
                  render={<Link href="/qr-code-generator/tool" />}
                  size="lg"
                  className="h-11 px-6"
                >
                  Generate QR
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  nativeButton={false}
                  render={<Link href="#qr-features" />}
                  variant="secondary"
                  size="lg"
                  className="h-11 px-6"
                >
                  QR code features
                </Button>
              </div>

              <ul className="mt-8 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <li className="flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-primary" />
                  QR input types: {QR_INPUT_TYPES.slice(0, 6).join(", ")}…
                </li>
                <li className="flex items-center gap-2">
                  <Brush className="h-4 w-4 text-primary" />
                  Colors, shapes, and logo support
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-primary" />
                  Export formats: {QR_OUTPUT_FORMATS.join(" · ")}
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Local-first (runs in your browser)
                </li>
              </ul>
            </div>

            <aside className="lg:col-span-5">
              <div className="rounded-xl border bg-background/70 backdrop-blur">
                <div className="p-6">
                  <h2 className="text-sm font-medium">
                    QR code generator specs
                  </h2>
                  <dl className="mt-4 grid gap-4 text-sm">
                    <div className="grid grid-cols-5 gap-3">
                      <dt className="col-span-2 text-muted-foreground">
                        Input
                      </dt>
                      <dd className="col-span-3">
                        {QR_INPUT_TYPES.join(" · ")} (event: iCal/Google)
                      </dd>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      <dt className="col-span-2 text-muted-foreground">
                        Output
                      </dt>
                      <dd className="col-span-3">
                        {QR_OUTPUT_FORMATS.join(" · ")} downloads
                      </dd>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      <dt className="col-span-2 text-muted-foreground">
                        Print
                      </dt>
                      <dd className="col-span-3">
                        RGB + CMYK (CMYK for JPEG/TIFF)
                      </dd>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      <dt className="col-span-2 text-muted-foreground">
                        Customize
                      </dt>
                      <dd className="col-span-3">
                        Colors, shapes, dots/corners, and logo
                      </dd>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      <dt className="col-span-2 text-muted-foreground">
                        Storage
                      </dt>
                      <dd className="col-span-3">
                        Local-first autosave + saved QR list (last 50)
                      </dd>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      <dt className="col-span-2 text-muted-foreground">
                        Share
                      </dt>
                      <dd className="col-span-3">
                        Share a link to open the same QR setup
                      </dd>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      <dt className="col-span-2 text-muted-foreground">
                        Usage
                      </dt>
                      <dd className="col-span-3">
                        Unlimited QR codes, no signup required
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </header>

      <section id="qr-features" className="w-full">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="text-2xl font-bold tracking-tight">
                QR code generator features for web and print
              </h2>
              <p className="mt-3 text-muted-foreground">
                Make a custom QR code, export it as PNG/JPEG/TIFF/SVG, and keep
                everything local. This QR code generator is built for reliable
                scans and clean branding.
              </p>
              <div className="mt-6 border-t pt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  Fully client-side. Runs in your browser, and the project is
                  designed to be open-source.
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-8 md:grid-cols-2">
                <article className="space-y-3">
                  <h3 className="text-lg font-semibold">Supported QR inputs</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>URL, raw text, phone, SMS</li>
                    <li>Wi‑Fi QR code, email QR code</li>
                    <li>Twitter / tweet QR code</li>
                    <li>Event QR (iCal / Google)</li>
                    <li>UPI QR</li>
                  </ul>
                </article>

                <article className="space-y-3">
                  <h3 className="text-lg font-semibold">Export formats</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>PNG (quick sharing)</li>
                    <li>JPEG (print-friendly)</li>
                    <li>TIFF (print workflows)</li>
                    <li>SVG (vector)</li>
                    <li>RGB + CMYK (CMYK for JPEG/TIFF)</li>
                    <li>Share a link to open the same QR setup</li>
                  </ul>
                </article>
              </div>

              <div className="mt-10 rounded-xl border bg-muted/10 p-6">
                <h3 className="text-lg font-semibold">Customization</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Style the QR code to match your brand, then export the format
                  you need.
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
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
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
          </div>
        </div>
      </section>

      <section id="faq" className="border-t bg-muted/10">
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">FAQ</h2>
              <p className="text-muted-foreground">
                Quick answers about QR codes, customization, and privacy.
              </p>
            </div>

            <div className="divide-y rounded-lg border bg-background">
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
