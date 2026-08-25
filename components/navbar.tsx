"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Currency, SYMBOLS, storeCurrency, getStoredCurrency } from "../lib/currency";
import { Lang, LANG_META, getStoredLang, storeLang } from "../lib/i18n";

const NAV_ITEMS = [
  {
    name: "Modules",
    links: [
      { href: "/modules", label: "All modules" },
      { href: "/grow/workspace", label: "GROW" },
      { href: "/academy", label: "Academy" },
      { href: "/academy/campuses", label: "Free tech campuses" },
      { href: "/discover", label: "Discover" },
      { href: "/ombudsman", label: "Ombudsman" },
      { href: "/partner", label: "Partner" },
      { href: "/rides", label: "Rides" },
    ]
  },
  {
    name: "AI Tools",
    links: [
      { href: "/uju-cycle", label: "UJU Cycle™" },
      { href: "/ikenga", label: "Ikenga™" },
      { href: "/ask-ujris", label: "Ask UJRIS™" },
    ]
  },
  {
    name: "Marketplace",
    links: [
      { href: "/marketplace", label: "🛍️ Buy Gambia" },
      { href: "/marketplace/dashboard", label: "📊 Trust Dashboard" },
      { href: "/marketplace/currency-exchange", label: "💱 Forex Exchange" },
      { href: "/marketplace/orders", label: "📦 My Orders" },
      { href: "/marketplace/disputes", label: "⚖️ Dispute Centre" },
      { href: "/seller/register", label: "➕ Become a Seller" },
      { href: "/website-builder", label: "🌐 Website Builder" },
    ]
  },
  {
    name: "Resources",
    links: [
      { href: "/resources", label: "All briefings" },
      { href: "/resources/gbos", label: "GBoS snapshot (CORE)" },
      { href: "/resources/nawec", label: "Energy map (GROW)" },
      { href: "/resources/waste", label: "Waste planner (GROW)" },
      { href: "/resources/giepa", label: "GIEPA desk (GROW)" },
      { href: "/resources/fintech", label: "Fintech briefing (GROW)" },
      { href: "/resources/digital-skills", label: "Digital skills (ACADEMY)" },
      { href: "/resources/airport", label: "Airport (DISCOVER)" },
      { href: "/resources/cybersecurity", label: "Cyber notes (GOVERN)" },
    ],
  },
  {
    name: "Sectors",
    links: [
      { href: "/energy", label: "⚡ Energy" },
      { href: "/agriculture", label: "🌾 Agriculture" },
      { href: "/smart-agriculture", label: "  🧮 Smart Agriculture" },
      { href: "/smart-livestock", label: "  🧮 Smart Livestock" },
      { href: "/housing", label: "🏠 Housing" },
      { href: "/health", label: "🏥 Health" },
      { href: "/fintech", label: "💰 Fintech" },
      { href: "/saas", label: "💻 SaaS" },
      { href: "/waste", label: "♻️ Waste" },
      { href: "/tourism", label: "✈️ Tourism" },
    ]
  },
  {
    name: "Services",
    links: [
      { href: "/services/logistics", label: "🚚 Logistics & Cargo" },
      { href: "/services/equipment-hire", label: "🔧 Equipment Hire" },
      { href: "/services/professionals", label: "👨‍💼 Professionals" },
      { href: "/services/car-hire", label: "🚗 Car Hire & Transfers" },
      { href: "/calculators/tax-import", label: "📊 Tax & Import Duty" },
    ]
  },
  {
    name: "Documents",
    links: [
      { href: "/documents/compose", label: "✍️ Compose Document" },
      { href: "/my-emails", label: "📬 Email Outbox" },
    ]
  },
];

const CURRENCIES: Currency[] = ["GMD", "USD", "GBP", "EUR"];
const LANGS: Lang[] = ["en", "fr", "wo", "mn", "ff"];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currency, setCurrencyState] = useState<Currency>("GMD");
  const [lang, setLangState] = useState<Lang>("en");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setCurrencyState(getStoredCurrency());
    setLangState(getStoredLang());
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const setCurrency = (c: Currency) => {
    storeCurrency(c);
    setCurrencyState(c);
    window.dispatchEvent(new StorageEvent("storage", { key: "fortis_currency", newValue: c }));
  };

  const setLang = (l: Lang) => {
    storeLang(l);
    setLangState(l);
    window.dispatchEvent(new StorageEvent("storage", { key: "fortis_lang", newValue: l }));
  };

  return (
    <>
      {/* Top Quick Access Bar */}
      <div className="hidden lg:block bg-[#1B4D3E] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <Link href="/subscription" className="hover:text-[#D4AF37] transition">💰 Pricing</Link>
            <Link href="/funding" className="hover:text-[#D4AF37] transition">🎯 Grants</Link>
            <Link href="/resources/nawec" className="hover:text-[#D4AF37] transition">🗺️ NAWEC Map</Link>
            <Link href="/resources/waste" className="hover:text-[#D4AF37] transition">♻️ Waste Hub</Link>
          </div>
          <div>
            <span>🇬🇲 The Gambia's Digital OS</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg" : "bg-white"} ${scrolled ? "mt-0" : "mt-0 lg:mt-7"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img 
                src="/images/fortis-logo.png" 
                alt="Fortis Invicta" 
                className="h-10 w-auto"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <span className="text-[#1B4D3E] font-bold text-lg hidden sm:block">FORTIS OS</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.name} className="relative group">
                  <button className="px-3 py-2 text-gray-700 hover:text-[#1B4D3E] font-medium text-sm flex items-center gap-1 group">
                    {item.name}
                    <svg className="w-3 h-3 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    {item.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-[#1B4D3E]/5 hover:text-[#1B4D3E] text-sm"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Language */}
              <div className="relative group">
                <button className="px-2 py-1 text-gray-600 hover:text-[#1B4D3E] text-sm">
                  {LANG_META[lang].flag}
                </button>
                <div className="absolute top-full right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {LANGS.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`block w-full text-left px-3 py-2 text-sm hover:bg-[#1B4D3E]/5 ${lang === l ? "text-[#1B4D3E] font-bold" : "text-gray-700"}`}
                    >
                      {LANG_META[l].flag} {LANG_META[l].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency */}
              <div className="relative group">
                <button className="px-2 py-1 text-gray-600 hover:text-[#1B4D3E] font-bold text-sm">
                  {SYMBOLS[currency]}
                </button>
                <div className="absolute top-full right-0 mt-1 w-24 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`block w-full text-left px-3 py-2 text-sm hover:bg-[#1B4D3E]/5 ${currency === c ? "text-[#1B4D3E] font-bold" : "text-gray-700"}`}
                    >
                      {SYMBOLS[c]} {c}
                    </button>
                  ))}
                </div>
              </div>

              <Link href="/pay/transfer" className="bg-[#D4AF37] text-[#0A1C2E] px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#C49C2E] transition shadow-md">
                Pay by transfer
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-600 text-2xl focus:outline-none"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-20 overflow-y-auto lg:hidden">
          <div className="px-4 py-4 space-y-4 pb-24">
            {NAV_ITEMS.map((item) => (
              <div key={item.name} className="border-b border-gray-100">
                <div className="py-2 text-gray-800 font-semibold text-base">{item.name}</div>
                <div className="pl-3 pb-3 space-y-1">
                  {item.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-3 text-gray-600 hover:text-[#1B4D3E] hover:bg-[#1B4D3E]/5 rounded-lg transition"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Language & Currency */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-xs text-gray-400 mb-2">LANGUAGE</p>
                <div className="flex gap-2 flex-wrap">
                  {LANGS.map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setMobileMenuOpen(false); }}
                      className={`px-3 py-1.5 rounded-full text-sm ${lang === l ? "bg-[#1B4D3E] text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      {LANG_META[l].flag}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">CURRENCY</p>
                <div className="flex gap-2 flex-wrap">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setCurrency(c); setMobileMenuOpen(false); }}
                      className={`px-3 py-1.5 rounded-full text-sm ${currency === c ? "bg-[#1B4D3E] text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      {SYMBOLS[c]} {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/subscription"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full bg-[#D4AF37] text-[#0A1C2E] text-center py-3 rounded-lg font-bold mt-4"
            >
              Get Access
            </Link>
          </div>
        </div>
      )}
    </>
  );
}