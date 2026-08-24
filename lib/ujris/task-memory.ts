/**
 * Local, deterministic improvement: counts officer/public outcomes so later
 * pre-screens rank categories by what humans actually used. Not a neural net.
 */
const categoryHits = new Map<string, number>();

export function rememberCategory(category: string): void {
  categoryHits.set(category, (categoryHits.get(category) ?? 0) + 1);
}

export function suggestCategory(text: string, fallback: string): { category: string; learned: boolean } {
  const lower = text.toLowerCase();
  const rules: [string, string][] = [
    ["delay", "delay"],
    ["late", "delay"],
    ["unfair", "unfair_treatment"],
    ["information", "access_to_information"],
    ["foi", "access_to_information"],
    ["maladmin", "maladministration"],
    ["corrupt", "maladministration"],
    ["service", "service_failure"],
  ];
  for (const [needle, cat] of rules) {
    if (lower.includes(needle)) {
      return { category: cat, learned: (categoryHits.get(cat) ?? 0) > 0 };
    }
  }
  let best = fallback;
  let n = -1;
  for (const [cat, count] of categoryHits) {
    if (count > n) {
      best = cat;
      n = count;
    }
  }
  return { category: best, learned: n > 0 };
}

export function memorySnapshot(): Record<string, number> {
  return Object.fromEntries(categoryHits);
}

export function resetTaskMemory(): void {
  categoryHits.clear();
}
