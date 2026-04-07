import Link from "next/link";
import { GitHubIssueButton } from "@/components/shared/GitHubIssueButton";
import { APP_NAME } from "@/lib/site";

const TOOL_LINKS = [
  {
    label: "Invoice Generator",
    landingHref: "/invoice-generator",
    toolHref: "/invoice-generator/tool",
  },
  {
    label: "Payslip Generator",
    landingHref: "/payslip-generator",
    toolHref: "/payslip-generator/tool",
  },
  {
    label: "QR Code Generator",
    landingHref: "/qr-code-generator",
    toolHref: "/qr-code-generator/tool",
  },
] as const;

const SEO_LINKS = [
  { label: "About", href: "/" },
  { label: "robots.txt", href: "/robots.txt" },
  { label: "sitemap.xml", href: "/sitemap.xml" },
  { label: "llms.txt", href: "/llms.txt" },
] as const;

const FEATURE_BADGES = [
  "Invoice generator",
  "Payslip generator",
  "QR code generator",
  "PDF export",
  "PDF preview",
  "Invoice templates",
  "Payslip templates",
  "QR code with logo",
  "QR code for printing",
  "CMYK QR export",
  "RGB export",
  "Autosave",
  "Saved history (last 50)",
  "Shareable links",
  "No signup",
  "Local-first",
  "Client-side",
] as const;

export function Footer() {
  return (
    <footer className="border-t bg-muted/10">
      <div className="container mx-auto px-4 md:px-8 py-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="text-base font-semibold tracking-tight">
              {APP_NAME}
            </div>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Local-first tools that run in your browser. No signup. Autosave
              and saved history (last 50) per tool.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {FEATURE_BADGES.map((b) => (
                <span
                  key={b}
                  className="rounded-full border bg-background/60 px-3 py-1"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="text-sm font-medium">Tools</div>
            <ul className="mt-3 space-y-2 text-sm">
              {TOOL_LINKS.map((t) => (
                <li key={t.landingHref} className="flex items-center gap-3">
                  <Link
                    href={t.landingHref}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t.label}
                  </Link>
                  <span className="text-muted-foreground/50">•</span>
                  <Link
                    href={t.toolHref}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Tool
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-sm font-medium">SEO</div>
            <ul className="mt-3 space-y-2 text-sm">
              {SEO_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#faq"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li className="pt-1">
                <GitHubIssueButton />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} {APP_NAME}.
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link
              href="/invoice-generator"
              className="hover:text-foreground transition-colors"
            >
              Invoice generator
            </Link>
            <Link
              href="/payslip-generator"
              className="hover:text-foreground transition-colors"
            >
              Payslip generator
            </Link>
            <Link
              href="/qr-code-generator"
              className="hover:text-foreground transition-colors"
            >
              QR code generator
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
