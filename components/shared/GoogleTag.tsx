"use client";

import Script from "next/script";

export function GoogleTag() {
  const gtagId = process.env.NEXT_PUBLIC_GTAG_ID;

  if (!gtagId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
        strategy="lazyOnload"
      />
      <Script id="gtag-init" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gtagId}');`}
      </Script>
    </>
  );
}

