import type { Metadata } from "next";
import { Suspense } from "react";
import { APP_NAME } from "@/lib/site";
import { QrCodeGeneratorClient } from "./QrCodeGeneratorClient";

export const metadata: Metadata = {
  title: `QR Code Generator | ${APP_NAME}`,
  description:
    "Generate stylish QR codes for URLs, Wi‑Fi, email, events and more. Customize colors, shapes and add a logo — all local-first in your browser.",
};

export default function QrCodeGeneratorPage() {
  return (
    <>
      <h1 className="sr-only">QR Code Generator</h1>
      <Suspense fallback={<div className="fixed inset-0 top-14 bg-background" />}>
        <QrCodeGeneratorClient />
      </Suspense>
    </>
  );
}

