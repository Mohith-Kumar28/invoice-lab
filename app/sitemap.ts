import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://invoiceforge.app", priority: 1.0, changeFrequency: "weekly" },
    { url: "https://invoiceforge.app/invoice-generator", priority: 0.9, changeFrequency: "weekly" },
  ];
}
