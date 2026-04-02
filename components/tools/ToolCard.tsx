import Link from "next/link";
import type { ReactNode } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ToolCardProps = {
  href: string;
  title: string;
  description: string;
  icon?: ReactNode;
  badge?: string;
};

export function ToolCard({
  href,
  title,
  description,
  icon,
  badge,
}: ToolCardProps) {
  return (
    <Link href={href} className="block">
      <Card className="hover:shadow-md transition-shadow h-full">
        <CardHeader>
          {icon ? (
            <div className="h-10 w-10 text-primary mb-2">{icon}</div>
          ) : null}
          <div className="flex items-center gap-2">
            <CardTitle>{title}</CardTitle>
            {badge ? (
              <span className="border rounded-full text-xs px-2 py-0.5 text-muted-foreground">
                {badge}
              </span>
            ) : null}
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
