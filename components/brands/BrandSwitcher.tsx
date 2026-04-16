"use client";

/**
 * BrandSwitcher — Tenant-isolated brand selector.
 * Allows a user to switch between brands they are a member of.
 * Persists the active brand in sessionStorage.
 */

import { useState, useEffect } from "react";

export interface BrandOption {
  id: string;
  name: string;
  handle: string;
  niche: string;
  primaryColor?: string | null;
  logoUrl?: string | null;
}

interface Props {
  brands: BrandOption[];
  activeBrandId?: string;
  onSwitch: (brandId: string) => void;
}

export const ACTIVE_BRAND_KEY = "fortis_active_brand";

export function getStoredBrandId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ACTIVE_BRAND_KEY);
}

export function setStoredBrandId(brandId: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ACTIVE_BRAND_KEY, brandId);
}

export default function BrandSwitcher({ brands, activeBrandId, onSwitch }: Props) {
  const [open, setOpen] = useState(false);
  const activeBrand = brands.find((b) => b.id === activeBrandId) ?? brands[0];

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  if (!activeBrand) {
    return (
      <div style={styles.emptyState}>
        No brands yet —{" "}
        <a href="/brands/new" style={{ color: "#C9A84C" }}>
          Create one
        </a>
      </div>
    );
  }

  function handleSwitch(brandId: string) {
    setStoredBrandId(brandId);
    onSwitch(brandId);
    setOpen(false);
  }

  return (
    <div style={{ position: "relative", fontFamily: "system-ui, sans-serif" }}>
      {/* Trigger Button */}
      <button onClick={() => setOpen((o) => !o)} style={styles.trigger}>
        <Avatar brand={activeBrand} size={28} />
        <div style={{ textAlign: "left" }}>
          <p style={styles.triggerName}>{activeBrand.name}</p>
          <p style={styles.triggerHandle}>@{activeBrand.handle}</p>
        </div>
        <span style={{ marginLeft: "auto", color: "#7a8f82", fontSize: "0.8rem" }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={styles.dropdown}>
          <p style={styles.dropdownLabel}>SWITCH BRAND</p>
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => handleSwitch(b.id)}
              style={{
                ...styles.dropdownItem,
                background: b.id === activeBrandId ? "#1e3527" : "transparent",
              }}
            >
              <Avatar brand={b} size={24} />
              <div style={{ textAlign: "left" }}>
                <p style={styles.itemName}>{b.name}</p>
                <p style={styles.itemNiche}>{b.niche}</p>
              </div>
              {b.id === activeBrandId && (
                <span style={{ marginLeft: "auto", color: "#22c55e", fontSize: "0.7rem" }}>●</span>
              )}
            </button>
          ))}
          <div style={styles.dropdownDivider} />
          <a href="/brands/new" style={styles.addBrand}>
            + Add Brand
          </a>
        </div>
      )}
    </div>
  );
}

function Avatar({ brand, size }: { brand: BrandOption; size: number }) {
  const color = brand.primaryColor ?? "#C9A84C";
  const initials = brand.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (brand.logoUrl) {
    return (
      <img
        src={brand.logoUrl}
        alt={brand.name}
        width={size}
        height={size}
        style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        color: "#112419",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: size * 0.38,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

const styles = {
  emptyState: {
    fontSize: "0.82rem",
    color: "#7a8f82",
    padding: "0.5rem 0",
  } as React.CSSProperties,
  trigger: {
    display: "flex",
    alignItems: "center",
    gap: "0.65rem",
    background: "#112419",
    border: "1px solid #1e3527",
    borderRadius: "0.6rem",
    padding: "0.5rem 0.75rem",
    cursor: "pointer",
    width: "100%",
    color: "#e8f0ea",
  } as React.CSSProperties,
  triggerName: {
    margin: 0,
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#e8f0ea",
    lineHeight: 1.2,
  } as React.CSSProperties,
  triggerHandle: {
    margin: 0,
    fontSize: "0.72rem",
    color: "#7a8f82",
  } as React.CSSProperties,
  dropdown: {
    position: "absolute" as const,
    top: "calc(100% + 0.4rem)",
    left: 0,
    right: 0,
    background: "#0d1f14",
    border: "1px solid #1e3527",
    borderRadius: "0.6rem",
    padding: "0.5rem",
    zIndex: 100,
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  },
  dropdownLabel: {
    fontSize: "0.65rem",
    letterSpacing: "0.1em",
    color: "#7a8f82",
    fontWeight: 700,
    padding: "0.25rem 0.5rem",
    margin: "0 0 0.25rem",
  } as React.CSSProperties,
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    width: "100%",
    border: "none",
    borderRadius: "0.4rem",
    padding: "0.5rem 0.6rem",
    cursor: "pointer",
    color: "#e8f0ea",
    marginBottom: "0.1rem",
  } as React.CSSProperties,
  itemName: {
    margin: 0,
    fontSize: "0.82rem",
    fontWeight: 600,
    lineHeight: 1.2,
  } as React.CSSProperties,
  itemNiche: {
    margin: 0,
    fontSize: "0.7rem",
    color: "#7a8f82",
  } as React.CSSProperties,
  dropdownDivider: {
    height: 1,
    background: "#1e3527",
    margin: "0.4rem 0",
  } as React.CSSProperties,
  addBrand: {
    display: "block",
    padding: "0.45rem 0.6rem",
    color: "#C9A84C",
    fontSize: "0.82rem",
    fontWeight: 600,
    textDecoration: "none",
    borderRadius: "0.4rem",
  } as React.CSSProperties,
};
