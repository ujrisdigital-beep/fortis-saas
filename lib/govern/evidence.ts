export function scanEvidence(input: { bytes: Uint8Array; scannerConfigured: boolean }) {
  if (!input.scannerConfigured) {
    return { accepted: false as const, reason: "malware_scanner_unavailable" };
  }
  if (input.bytes.length === 0) {
    return { accepted: false as const, reason: "empty_object" };
  }
  return { accepted: true as const, checksumReady: true };
}
