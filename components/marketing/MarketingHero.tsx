import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type HeroAction = {
  href: string;
  label: string;
  variant?: "default" | "secondary" | "outline";
};

type HeroBullet = {
  icon?: ReactNode;
  text: string;
};

type MarketingHeroProps = {
  badge?: ReactNode;
  title: ReactNode;
  description: string;
  primaryAction: HeroAction;
  secondaryAction?: HeroAction;
  tertiaryAction?: HeroAction;
  bullets?: HeroBullet[];
  visual: ReactNode;
  className?: string;
  backdropClassName?: string;
};

export function MarketingHero({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  bullets,
  visual,
  className,
  backdropClassName,
}: MarketingHeroProps) {
  return (
    <header className={cn("relative overflow-hidden", className)}>
      <div
        className={cn(
          "absolute inset-0 bg-[radial-gradient(900px_circle_at_18%_-12%,hsl(var(--primary))/0.16,transparent_55%),radial-gradient(900px_circle_at_82%_0%,hsl(var(--secondary))/0.14,transparent_52%),radial-gradient(700px_circle_at_55%_110%,hsl(var(--accent))/0.10,transparent_48%)]",
          backdropClassName
        )}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,hsl(var(--background))/0.70,transparent_35%,hsl(var(--background)))]" />
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-16 relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            {badge ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-3 py-1 text-sm text-muted-foreground">
                {badge}
              </div>
            ) : null}
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
              {description}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
              <Button
                nativeButton={false}
                render={<Link href={primaryAction.href} />}
                size="lg"
                className="h-11 px-6"
                variant={primaryAction.variant ?? "default"}
              >
                {primaryAction.label}
              </Button>
              {secondaryAction ? (
                <Button
                  nativeButton={false}
                  render={<Link href={secondaryAction.href} />}
                  size="lg"
                  className="h-11 px-6"
                  variant={secondaryAction.variant ?? "outline"}
                >
                  {secondaryAction.label}
                </Button>
              ) : null}
              {tertiaryAction ? (
                <Button
                  nativeButton={false}
                  render={<Link href={tertiaryAction.href} />}
                  size="lg"
                  className="h-11 px-6"
                  variant={tertiaryAction.variant ?? "outline"}
                >
                  {tertiaryAction.label}
                </Button>
              ) : null}
            </div>
            {bullets?.length ? (
              <ul className="mt-8 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {bullets.map((b) => (
                  <li
                    key={b.text}
                    className="flex items-center gap-2 min-w-0"
                  >
                    {b.icon ? (
                      <span className="text-primary shrink-0">{b.icon}</span>
                    ) : null}
                    <span className="truncate">{b.text}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="lg:col-span-5">{visual}</div>
        </div>
      </div>
    </header>
  );
}
