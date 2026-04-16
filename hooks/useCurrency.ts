"use client";
import { useState, useEffect, useCallback } from "react";
import { Currency, getStoredCurrency, storeCurrency, formatCurrency, formatDual } from "../lib/currency";

export function useCurrency() {
  const [currency, setCurrencyState] = useState<Currency>("GMD");

  useEffect(() => {
    setCurrencyState(getStoredCurrency());

    const handler = (e: StorageEvent) => {
      if (e.key === "fortis_currency") setCurrencyState((e.newValue as Currency) ?? "GMD");
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    storeCurrency(c);
    setCurrencyState(c);
    // broadcast to other tabs / components
    window.dispatchEvent(new StorageEvent("storage", { key: "fortis_currency", newValue: c }));
  }, []);

  const fmt = useCallback((gmd: number) => formatCurrency(gmd, currency), [currency]);
  const fmtDual = useCallback((gmd: number) => formatDual(gmd, currency), [currency]);

  return { currency, setCurrency, fmt, fmtDual };
}
