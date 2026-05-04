"use client";
import { useEffect } from "react";

export default function TradeSecretWatermark() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    // Visible watermark (very faint)
    const watermark = document.createElement("div");
    watermark.id = "fortis-watermark";
    watermark.style.cssText =
      "position:fixed;bottom:6px;left:6px;z-index:9997;font-size:8px;color:rgba(0,0,0,0.08);pointer-events:none;font-family:monospace;user-select:none;letter-spacing:0.5px";
    watermark.textContent = `FORTIS OS™ Trade Secret · © FORTIS INVICTA LTD · legal@fortisos.gm`;
    document.body.appendChild(watermark);

    // Invisible forensic watermark for leak tracing
    const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const forensic = document.createElement("span");
    forensic.setAttribute("data-fortis-uid", uid);
    forensic.setAttribute("data-fortis-ts", new Date().toISOString());
    forensic.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;opacity:0";
    document.body.appendChild(forensic);

    return () => {
      document.getElementById("fortis-watermark")?.remove();
      forensic.remove();
    };
  }, []);

  return null;
}
