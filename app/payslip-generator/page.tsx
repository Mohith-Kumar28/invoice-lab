import type { Metadata } from "next";
import { Suspense } from "react";
import { APP_NAME } from "@/lib/site";
import { PayslipGeneratorClient } from "./PayslipGeneratorClient";

export const metadata: Metadata = {
  title: `Payslip Generator | ${APP_NAME}`,
  description:
    "Create a payslip in minutes, export to PDF, and keep your data local-first in your browser.",
};

export default function PayslipGeneratorPage() {
  return (
    <>
      <h1 className="sr-only">Payslip Generator</h1>
      <Suspense
        fallback={<div className="fixed inset-0 top-14 bg-background" />}
      >
        <PayslipGeneratorClient />
      </Suspense>
    </>
  );
}
