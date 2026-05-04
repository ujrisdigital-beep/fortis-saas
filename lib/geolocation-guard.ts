// lib/geolocation-guard.ts
// GDPA 2018 / UK GDPR compliant geolocation — only after payment + mutual consent
// Geolocation is NEVER auto-triggered. Must be explicitly requested post-payment.

export interface LocationConsent {
  orderId: string;
  buyerConsented: boolean;
  sellerConsented: boolean;
  consentedAt: Date | null;
  expiresAt: Date | null;
  token: string | null;
}

// In-memory consent store (production: use DB)
const CONSENT_STORE = new Map<string, LocationConsent>();

/**
 * Check whether an order has received mutual consent for geolocation sharing.
 * Neither party's location is revealed until BOTH have consented.
 */
export function hasLocationConsent(orderId: string): boolean {
  const entry = CONSENT_STORE.get(orderId);
  if (!entry) return false;
  if (!entry.buyerConsented || !entry.sellerConsented) return false;
  if (!entry.expiresAt) return false;
  return new Date() < entry.expiresAt;
}

/**
 * Record consent from one party. Returns true when BOTH parties have consented.
 * Token is generated only after mutual consent — not before.
 */
export function recordConsent(
  orderId: string,
  party: 'buyer' | 'seller'
): { mutualConsent: boolean; token: string | null } {
  const existing = CONSENT_STORE.get(orderId) ?? {
    orderId,
    buyerConsented: false,
    sellerConsented: false,
    consentedAt: null,
    expiresAt: null,
    token: null,
  };

  if (party === 'buyer') existing.buyerConsented = true;
  if (party === 'seller') existing.sellerConsented = true;

  const mutualConsent = existing.buyerConsented && existing.sellerConsented;
  if (mutualConsent && !existing.token) {
    // Generate ephemeral token — valid 24 hours only
    existing.token = crypto.randomUUID();
    existing.consentedAt = new Date();
    existing.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  CONSENT_STORE.set(orderId, existing);
  return { mutualConsent, token: existing.token };
}

/**
 * Revoke geolocation consent for an order (e.g. on dispute or delivery).
 */
export function revokeConsent(orderId: string): void {
  const entry = CONSENT_STORE.get(orderId);
  if (entry) {
    entry.buyerConsented = false;
    entry.sellerConsented = false;
    entry.token = null;
    entry.expiresAt = null;
    CONSENT_STORE.set(orderId, entry);
  }
}

/**
 * Validate a location token. Returns true only if token matches and hasn't expired.
 */
export function validateLocationToken(orderId: string, token: string): boolean {
  const entry = CONSENT_STORE.get(orderId);
  if (!entry || !entry.token) return false;
  if (entry.token !== token) return false;
  if (!entry.expiresAt || new Date() > entry.expiresAt) return false;
  return true;
}

/**
 * Client-side helper — request geolocation ONLY if token is valid.
 * Call this in React components post-payment, never on page load.
 */
export async function requestLocationIfConsented(
  orderId: string,
  token: string
): Promise<GeolocationPosition | null> {
  if (typeof window === 'undefined') return null;
  if (!('geolocation' in navigator)) return null;

  // Validate token server-side before requesting position
  const res = await fetch(`/api/marketplace/order/${orderId}/confirm-location`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      () => resolve(null),
      { maximumAge: 60000, timeout: 10000, enableHighAccuracy: false }
    );
  });
}
