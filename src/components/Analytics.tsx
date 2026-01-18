import { useEffect } from 'react';

interface AnalyticsProps {
  consent: 'unknown' | 'accepted' | 'rejected';
}

export function GoogleAnalytics({ consent }: AnalyticsProps) {
  useEffect(() => {
    if (consent === 'accepted') {
      // -----------------------------------------------------------
      // PASTE YOUR GOOGLE ANALYTICS CODE HERE (Replace this block)
      // Example:
      //
      // const script1 = document.createElement('script');
      // script1.async = true;
      // script1.src = "https://www.googletagmanager.com/gtag/js?id=YOUR-ID-HERE";
      // document.head.appendChild(script1);
      //
      // const script2 = document.createElement('script');
      // script2.innerHTML = `
      //   window.dataLayer = window.dataLayer || [];
      //   function gtag(){dataLayer.push(arguments);}
      //   gtag('js', new Date());
      //   gtag('config', 'YOUR-ID-HERE');
      // `;
      // document.head.appendChild(script2);
      // -----------------------------------------------------------

      // Google tag (gtag.js)
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = "https://www.googletagmanager.com/gtag/js?id=G-MP82NQ73WD";
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-MP82NQ73WD');
      `;
      document.head.appendChild(script2);
      
      console.log('Google Analytics consent granted. (Integration pending user code)');
    }
  }, [consent]);

  return null;
}
