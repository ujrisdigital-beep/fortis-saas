/**
 * Keep Partner leads on FORTIS so commission can be taken when commerce is live.
 * Heuristic only — determined people can still leak contacts offline.
 */

export type LeakKind = "whatsapp" | "phone" | "email" | "off_platform_pay" | "meet_offline";

export type LeakHit = { kind: LeakKind; excerpt: string };

const PATTERNS: Array<{ kind: LeakKind; re: RegExp }> = [
  { kind: "whatsapp", re: /wa\.me\/|whats\s*app|whatsapp|watsapp|\bwa\b\s*\+?220/i },
  { kind: "phone", re: /(\+?220[\s-]?\d{6,8}|\b7[0-9]{6,8}\b)/ },
  { kind: "email", re: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i },
  { kind: "off_platform_pay", re: /pay\s+(me|us|outside|direct)|send\s+(wave|qmoney|afrimoney)|outside\s+the\s+platform|cash\s+only\s+to\s+my/i },
  { kind: "meet_offline", re: /call\s+me|text\s+me|meet\s+me\s+(at|in)\s+(senegambia|serrekunda|kanifing)/i },
];

export function detectOffPlatformLeak(text: string): LeakHit[] {
  const hits: LeakHit[] = [];
  for (const p of PATTERNS) {
    const m = text.match(p.re);
    if (m) hits.push({ kind: p.kind, excerpt: m[0].slice(0, 40) });
  }
  return hits;
}

export function redactLeaks(text: string): string {
  let out = text;
  out = out.replace(/https?:\/\/wa\.me\/\S+/gi, "[blocked:whatsapp]");
  out = out.replace(/whats\s*app|whatsapp|watsapp/gi, "[blocked:whatsapp]");
  out = out.replace(/\+?220[\s-]?\d{6,8}/g, "[blocked:phone]");
  out = out.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[blocked:email]");
  return out;
}

export function screenLeadMessage(text: string) {
  const hits = detectOffPlatformLeak(text);
  const blocked = hits.some((h) => h.kind === "whatsapp" || h.kind === "off_platform_pay" || h.kind === "phone");
  return {
    hits,
    blocked,
    storedBody: blocked ? redactLeaks(text) : text.trim(),
    notice: blocked
      ? "Contact details and off-platform pay instructions are stripped. Finish the job on FORTIS so commission and (when live) escrow stay here."
      : null,
  };
}

export const LEAD_CONTAINMENT_POLICY = {
  publicMerchantContacts: false,
  whatsappRail: false,
  commissionBpsWhenLive: 800,
  enforcement:
    "KYB merchants who steer clients to WhatsApp, Wave-to-personal, or cash-off-platform can be suspended. Heuristic filters are not a guarantee.",
};
