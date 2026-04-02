import Script from "next/script";

export function GoogleTag({ gtagId: gtagIdProp }: { gtagId?: string }) {
  const gtagId = gtagIdProp ?? process.env.NEXT_PUBLIC_GTAG_ID;

  if (!gtagId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
        strategy="beforeInteractive"
        async
      />
      <Script id="gtag-init" strategy="beforeInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gtagId}');`}
      </Script>
    </>
  );
}
