import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { GoogleTag } from "@/components/shared/GoogleTag";
import { GoogleTagManager } from "@/components/shared/GoogleTagManager";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { APP_NAME } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: `${APP_NAME} - Free Online Invoice Generator`,
  description: "Create stunning invoices in seconds. Free forever.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const analyticsMode = process.env.NEXT_PUBLIC_ANALYTICS_MODE;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gtagId = process.env.NEXT_PUBLIC_GTAG_ID || "G-WL85BW3HTX";
  const useGtm = analyticsMode === "gtm" && Boolean(gtmId);
  const useGtag = analyticsMode !== "gtm";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>{useGtag ? <GoogleTag gtagId={gtagId} /> : null}</head>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Analytics />
        {useGtm ? (
          <noscript>
            <iframe
              title="Google Tag Manager"
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          {useGtm ? <GoogleTagManager /> : null}
        </ThemeProvider>
      </body>
    </html>
  );
}
