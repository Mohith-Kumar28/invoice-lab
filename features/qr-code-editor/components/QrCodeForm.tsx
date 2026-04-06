"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { QrAdvancedSection } from "@/features/qr-code-editor/components/sections/QrAdvancedSection";
import { QrContentSection } from "@/features/qr-code-editor/components/sections/QrContentSection";
import { QrStyleSection } from "@/features/qr-code-editor/components/sections/QrStyleSection";

export function QrCodeForm() {
  const initial = ["section-1", "section-2"];
  const [openSections, setOpenSections] = useState<string[]>(initial);

  useEffect(() => {
    const handler = () => setOpenSections(["section-1", "section-2", "section-3"]);
    window.addEventListener("qr:showErrors", handler);
    return () => window.removeEventListener("qr:showErrors", handler);
  }, []);
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">QR Code Generator</h1>
      </div>

      <Accordion
        multiple
        value={openSections}
        onValueChange={(val) => setOpenSections(val as string[])}
        className="w-full space-y-12"
      >
        <AccordionItem
          value="section-1"
          className="bg-card rounded-xl border px-4 shadow-sm"
        >
          <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
            1. Content
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-3">
            <QrContentSection />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="section-2"
          className="bg-card rounded-xl border px-4 shadow-sm"
        >
          <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
            2. Style
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-3">
            <QrStyleSection />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="section-3"
          className="bg-card rounded-xl border px-4 shadow-sm"
        >
          <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
            3. Advanced
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-3">
            <QrAdvancedSection />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
