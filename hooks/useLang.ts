"use client";
import { useState, useEffect, useCallback } from "react";
import { Lang, TKey, t as translate, getStoredLang, storeLang } from "../lib/i18n";

export const LS_LANG_KEY = "fortis_lang";

export function useLang() {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    setLangState(getStoredLang());
    const handler = (e: StorageEvent) => {
      if (e.key === LS_LANG_KEY) setLangState((e.newValue as Lang) ?? "en");
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const setLang = useCallback((l: Lang) => {
    storeLang(l);
    setLangState(l);
    window.dispatchEvent(new StorageEvent("storage", { key: LS_LANG_KEY, newValue: l }));
  }, []);

  const t = useCallback((key: TKey) => translate(key, lang), [lang]);

  return { lang, setLang, t };
}
