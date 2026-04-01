import Link from 'next/link';
import { FileText } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-8 mx-auto justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="font-bold inline-block">
            InvoiceForge
          </span>
        </Link>
        
        <div className="hidden sm:flex text-xs text-muted-foreground items-center">
          Made with ❤️ for freelancers & agencies
        </div>

        <nav className="flex items-center space-x-4 sm:space-x-6 text-sm font-medium">
          <Link
            href="/about"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            About
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
