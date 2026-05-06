"use client";

import { Download, X } from "lucide-react";
import * as React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

type SlotProps = { children: React.ReactNode };

function ActionsSlot(_props: SlotProps) {
  return null;
}

function FormSlot(_props: SlotProps) {
  return null;
}

function PreviewSlot(_props: SlotProps) {
  return null;
}

type ToolEditorLayoutProps = {
  children: React.ReactNode;
  mobilePreviewLabel?: string;
};

function getSlotChildren(children: React.ReactNode) {
  let actions: React.ReactNode = null;
  let form: React.ReactNode = null;
  let preview: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<SlotProps>(child)) return;
    if (child.type === ActionsSlot) actions = child.props.children;
    if (child.type === FormSlot) form = child.props.children;
    if (child.type === PreviewSlot) preview = child.props.children;
  });

  return { actions, form, preview };
}

export const ToolEditorLayout = Object.assign(
  function ToolEditorLayout({
    children,
    mobilePreviewLabel = "Preview PDF",
  }: ToolEditorLayoutProps) {
    const { actions, form, preview } = getSlotChildren(children);
    const [mobilePreviewOpen, setMobilePreviewOpen] = React.useState(false);

    return (
      <div className="fixed inset-0 top-14 flex flex-col overflow-hidden bg-background md:flex-row">
        <div className="w-full md:w-1/2 h-full flex flex-col border-r border-border bg-muted/10">
          {actions}
          <div className="flex-1 overflow-y-auto p-4 pb-28 md:p-6 md:pb-6">
            {form}
          </div>
        </div>

        <div className="hidden md:flex w-full md:w-1/2 h-full bg-background overflow-hidden">
          {preview}
        </div>

        {preview ? (
          <div className="md:hidden fixed bottom-[calc(env(safe-area-inset-bottom)+12px)] right-4 z-50">
            <Sheet open={mobilePreviewOpen} onOpenChange={setMobilePreviewOpen}>
              <SheetTrigger
                render={
                  <button
                    type="button"
                    className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg"
                  >
                    {mobilePreviewLabel}
                  </button>
                }
              />
              <SheetContent
                side="bottom"
                showCloseButton={false}
                className="data-[side=bottom]:h-[75svh] data-[side=bottom]:max-h-[75svh] rounded-t-2xl p-0 flex flex-col gap-0"
              >
                <div className="flex items-center justify-between border-b bg-background/90 px-3 py-1.5 backdrop-blur shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("tool:previewDownload"));
                      setMobilePreviewOpen(false);
                    }}
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  <SheetClose
                    render={
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background text-foreground/70 hover:text-foreground"
                      />
                    }
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close preview</span>
                  </SheetClose>
                </div>
                <div className="flex-1 overflow-hidden bg-background">
                  {preview}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : null}
      </div>
    );
  },
  {
    Actions: ActionsSlot,
    Form: FormSlot,
    Preview: PreviewSlot,
  },
);
