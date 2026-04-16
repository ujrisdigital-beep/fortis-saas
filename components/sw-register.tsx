"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          // SW registered successfully
        })
        .catch((err) => {
          console.warn("SW registration failed:", err);
        });
    }

    // Listen for sync requests from SW
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "SYNC_OFFLINE") {
          syncOfflineSubmissions();
        }
      });
    }
  }, []);

  return null;
}

function syncOfflineSubmissions() {
  const keysToSync: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith("offline_uju_") || key.startsWith("offline_ikenga_") || key.startsWith("offline_ujris_"))) {
      keysToSync.push(key);
    }
  }

  keysToSync.forEach(async (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const data = JSON.parse(raw) as Record<string, unknown>;

      let endpoint = "/api/ask-ujris";
      if (key.startsWith("offline_uju_")) endpoint = "/api/uju-cycle";
      if (key.startsWith("offline_ikenga_")) endpoint = "/api/ikenga";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        localStorage.removeItem(key);
      }
    } catch {
      // Will retry on next sync
    }
  });
}
