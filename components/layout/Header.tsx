import Link from "next/link";
import { GitHubIssueButton } from "@/components/shared/GitHubIssueButton";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { APP_NAME } from "@/lib/site";
import { TOOL_NAV_LINKS } from "@/lib/tools";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-2 px-3 md:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block whitespace-nowrap font-bold capitalize">
              {APP_NAME}
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
            <span className="text-muted-foreground/50">•</span>
            <span>Made with ❤️ and AI 🤖</span>
            <GitHubIssueButton />
          </div>
        </div>

        <nav className="flex items-center gap-2 text-xs font-medium sm:gap-4 sm:text-sm">
          {TOOL_NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap text-foreground/60 transition-colors hover:text-foreground/80"
            >
              <span className="sm:hidden">{l.mobileLabel}</span>
              <span className="hidden sm:inline">{l.label}</span>
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
