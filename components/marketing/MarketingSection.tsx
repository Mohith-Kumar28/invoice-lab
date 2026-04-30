import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarketingSectionProps = {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted";
};

export function MarketingSection({
  id,
  title,
  description,
  children,
  className,
  tone = "default",
}: MarketingSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full",
        tone === "muted" ? "bg-muted/10" : "",
        className
      )}
    >
      <div className="container mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-3 text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <div className="lg:col-span-7">{children}</div>
        </div>
      </div>
    </section>
  );
}
