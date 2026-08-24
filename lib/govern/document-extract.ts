/**
 * Fail-closed extractors. pdf.js / tesseract are optional; never invent text.
 */
export async function extractPdfText(bytes: Uint8Array): Promise<{ ok: true; text: string } | { ok: false; reason: string }> {
  try {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs").catch(() => null);
    if (!pdfjs) return { ok: false, reason: "pdfjs_not_installed" };
    return { ok: false, reason: "pdfjs_worker_not_configured" };
  } catch {
    return { ok: false, reason: "pdf_extract_unavailable" };
  }
}

export async function ocrImage(_bytes: Uint8Array): Promise<{ ok: true; text: string } | { ok: false; reason: string }> {
  return { ok: false, reason: "tesseract_not_installed" };
}

export async function embedLocally(_text: string): Promise<{ ok: false; reason: string }> {
  return { ok: false, reason: "transformers_js_not_loaded" };
}
