export async function fetchJson(url: string, timeoutMs = 8000): Promise<{ ok: true; data: unknown } | { ok: false; reason: string }> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      headers: { Accept: "application/json", "User-Agent": "FORTIS-OS/1.0 (+https://fortisos.cloud)" },
    });
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    return { ok: true, data: await res.json() };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "network" };
  }
}
