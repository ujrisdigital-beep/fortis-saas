"use client";
import { useEffect } from "react";

export default function CopyrightProtection() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    function showNotice(message: string) {
      const existing = document.getElementById("fortis-legal-notice");
      if (existing) existing.remove();

      const el = document.createElement("div");
      el.id = "fortis-legal-notice";
      el.style.cssText =
        "position:fixed;bottom:20px;right:20px;background:#1B4D3E;color:#C4943A;padding:12px 20px;border-radius:10px;z-index:99999;font-size:13px;font-family:sans-serif;box-shadow:0 4px 16px rgba(0,0,0,0.3);max-width:340px;animation:fortis-fade 4s ease-in-out forwards";
      el.innerHTML = `<strong>⚖️ FORTIS OS™</strong><br/>${message}<br/><span style="font-size:11px;opacity:0.7">© FORTIS INVICTA LTD · legal@fortisos.gm</span>`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showNotice("All rights reserved. Unauthorised reproduction is prohibited under Gambia Copyright Act 2004.");
      return false;
    };

    const handleKeydown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      // Block: Ctrl+U (view source), Ctrl+S (save), Ctrl+Shift+I/J (devtools)
      if (
        ctrl &&
        (e.key === "u" || e.key === "U" ||
         e.key === "s" || e.key === "S" ||
         (e.shiftKey && (e.key === "i" || e.key === "I" || e.key === "j" || e.key === "J" || e.key === "c" || e.key === "C")))
      ) {
        e.preventDefault();
        showNotice("FORTIS OS™ contains trade secrets. Unauthorised access to source code is prohibited under Cybercrime Act 2021.");
        return false;
      }
      // F12 (DevTools)
      if (e.key === "F12") {
        e.preventDefault();
        showNotice("FORTIS OS™ trade secret protection active. Access to developer tools is monitored.");
        return false;
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeydown);

    // DevTools dimension detection
    let devtoolsOpen = false;
    const devtoolsCheck = setInterval(() => {
      const threshold = 160;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          fetch("/api/security/reverse-engineering-attempt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "devtools_opened",
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              url: window.location.pathname,
            }),
          }).catch(() => {});
        }
      } else {
        devtoolsOpen = false;
      }
    }, 2000);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeydown);
      clearInterval(devtoolsCheck);
    };
  }, []);

  return (
    <style>{`
      @keyframes fortis-fade {
        0%,70% { opacity:1; transform:translateY(0); }
        100% { opacity:0; transform:translateY(-10px); pointer-events:none; }
      }
    `}</style>
  );
}
