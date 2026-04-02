"use client";

import { useEffect, useState } from "react";
import { resolveCssVarColor } from "@/lib/css-vars";

export type PdfBrand = {
  primary: string;
  secondary: string;
  accent: string;
};

export function resolvePdfBrand(): PdfBrand {
  const primary = resolveCssVarColor("--primary") || "rgb(0, 56, 224)";
  const secondary = resolveCssVarColor("--secondary") || "rgb(255, 255, 0)";
  const accent = resolveCssVarColor("--accent") || "rgb(55, 65, 81)";
  return { primary, secondary, accent };
}

export function usePdfBrand() {
  const [pdfBrand, setPdfBrand] = useState<PdfBrand>(() => resolvePdfBrand());

  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    const obs = new MutationObserver(() => setPdfBrand(resolvePdfBrand()));
    obs.observe(el, { attributes: true, attributeFilter: ["class", "style"] });
    setPdfBrand(resolvePdfBrand());
    return () => obs.disconnect();
  }, []);

  return pdfBrand;
}
