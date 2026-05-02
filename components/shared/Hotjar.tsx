import Script from "next/script";

export function Hotjar({
  hjid: hjidProp,
  hjsv: hjsvProp,
}: {
  hjid?: number | string;
  hjsv?: number | string;
}) {
  const hjid = hjidProp ?? process.env.NEXT_PUBLIC_HOTJAR_ID ?? "6703198";
  const hjsv = hjsvProp ?? process.env.NEXT_PUBLIC_HOTJAR_SV ?? "6";

  if (!hjid) return null;

  return (
    <Script id="hotjar" strategy="beforeInteractive">
      {`(function(h,o,t,j,a,r){
h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
h._hjSettings={hjid:${hjid},hjsv:${hjsv}};
a=o.getElementsByTagName('head')[0];
r=o.createElement('script');r.async=1;
r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
    </Script>
  );
}
