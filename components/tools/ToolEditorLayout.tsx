"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

    return (
      <div className="fixed inset-0 top-14 flex flex-col md:flex-row overflow-hidden bg-background">
        <div className="w-full md:w-1/2 h-full flex flex-col border-r border-border bg-muted/10">
          {actions}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
            {form}
          </div>
        </div>

        <div className="hidden md:flex w-full md:w-1/2 h-full bg-background overflow-hidden">
          {preview}
        </div>

        {preview ? (
          <div className="md:hidden fixed bottom-4 right-4 z-50">
            <Sheet>
              <SheetTrigger
                render={
                  <button
                    type="button"
                    className="bg-primary text-primary-foreground shadow-lg rounded-full px-6 py-3 font-semibold"
                  >
                    {mobilePreviewLabel}
                  </button>
                }
              />
              <SheetContent
                side="bottom"
                className="h-[85vh] p-0 rounded-t-xl flex flex-col"
              >
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
