/**
 * Lazy pdf.js on GOVERN/evidence only. Tesseract / Transformers stay fail-closed.
 * Never invents text.
 */

export async function extractPdfText(
  bytes: Uint8Array,
): Promise<{ ok: true; text: string; pages: number } | { ok: false; reason: string }> {
  if (bytes.length < 5 || String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) !== "%PDF") {
    return { ok: false, reason: "not_a_pdf" };
  }
  try {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const task = pdfjs.getDocument({
      data: bytes,
      disableWorker: true,
      isEvalSupported: false,
      useSystemFonts: true,
    });
    const doc = await task.promise;
    const parts: string[] = [];
    const limit = Math.min(doc.numPages, 30);
    for (let i = 1; i <= limit; i += 1) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const line = content.items
        .map((item) => ("str" in item ? String(item.str) : ""))
        .join(" ")
        .trim();
      if (line) parts.push(line);
    }
    const text = parts.join("\n").trim();
    if (!text) return { ok: false, reason: "no_text_layer" };
    return { ok: true, text, pages: doc.numPages };
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
