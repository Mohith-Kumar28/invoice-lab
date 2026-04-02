"use client";

import type { DocumentProps } from "@react-pdf/renderer";
import { ExternalLink, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PdfRenderer = dynamic(
  () =>
    import("@react-pdf/renderer").then((mod) => {
      const { usePDF } = mod;
      return function PdfWrapper({
        document: doc,
        onUrl,
      }: {
        document: ReactElement<DocumentProps>;
        onUrl?: (url?: string) => void;
      }) {
        const [instance, update] = usePDF({ document: doc });
        const [stableUrl, setStableUrl] = useState<string | undefined>(
          undefined,
        );

        useEffect(() => {
          update(doc);
        }, [doc, update]);

        useEffect(() => {
          if (instance.url) setStableUrl(instance.url);
        }, [instance.url]);

        useEffect(() => {
          onUrl?.(stableUrl);
        }, [stableUrl, onUrl]);

        if (!stableUrl && instance.loading) {
          return (
            <div className="flex h-full w-full items-center justify-center bg-muted/5">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          );
        }

        if (instance.error) {
          return (
            <div className="p-4 text-destructive">
              Error rendering PDF
              {instance.error ? `: ${String(instance.error)}` : ""}
            </div>
          );
        }

        if (!stableUrl) {
          return (
            <div className="flex h-full w-full items-center justify-center bg-muted/5">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          );
        }

        return (
          <div className="relative h-full w-full bg-background">
            <iframe
              src={stableUrl ?? undefined}
              title="PDF preview"
              className="border-none w-full h-full"
            />
            {instance.loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-[1px]">
                <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
              </div>
            ) : null}
          </div>
        );
      };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-muted/5">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  },
);

type PdfPreviewPaneProps = {
  document: ReactElement<DocumentProps>;
  fileName: string;
  computedFileName: string;
  onFileNameChange: (value: string) => void;
  onFileNameBlur?: () => void;
};

export function PdfPreviewPane({
  document,
  fileName,
  computedFileName,
  onFileNameChange,
  onFileNameBlur,
}: PdfPreviewPaneProps) {
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="w-full flex flex-col flex-1 min-h-0 bg-background">
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-b bg-background/80 backdrop-blur shrink-0">
          <div className="flex-1 min-w-0">
            <Input
              value={fileName}
              placeholder={computedFileName}
              onChange={(e) => onFileNameChange(e.target.value)}
              onBlur={onFileNameBlur}
              className="h-8"
            />
          </div>
          <div className="flex items-center gap-2">
            {pdfUrl ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(pdfUrl, "_blank", "noopener,noreferrer")
                }
              >
                <ExternalLink className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Open</span>
              </Button>
            ) : null}
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <PdfRenderer onUrl={setPdfUrl} document={document} />
        </div>
      </div>
    </div>
  );
}
