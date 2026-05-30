"use client";

import { useEffect, useRef } from "react";

export default function SidebarAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://www.highperformanceformat.com/d1bfa51e747c0b77cc00b948a610099d/invoke.js";
    script.async = true;
    containerRef.current.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div ref={containerRef} className="hidden xl:block w-[160px] shrink-0">
      <div className="sticky top-24">
        <script
          dangerouslySetInnerHTML={{
            __html: `atOptions = {
              'key' : 'd1bfa51e747c0b77cc00b948a610099d',
              'format' : 'iframe',
              'height' : 600,
              'width' : 160,
              'params' : {}
            };`,
          }}
        />
        <div id="ad-container" style={{ width: 160, height: 600 }} />
      </div>
    </div>
  );
}
