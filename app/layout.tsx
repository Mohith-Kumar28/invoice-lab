import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleTagManager } from "@/components/shared/GoogleTagManager";
import { GoogleTag } from "@/components/shared/GoogleTag";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Header } from "@/components/layout/Header";
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
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gtagId = process.env.NEXT_PUBLIC_GTAG_ID;
  const useGtm = Boolean(gtmId);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
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
          {useGtm ? <GoogleTagManager /> : gtagId ? <GoogleTag /> : null}
        </ThemeProvider>
      </body>
    </html>
  );
}
