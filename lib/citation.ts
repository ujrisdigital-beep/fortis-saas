// lib/citation.ts — Citation generator for FORTIS OS content

export function generateCitation(
  source: string,
  title: string,
  url: string,
  date: Date
): string {
  const formatted = date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const year = date.getFullYear();
  return `${source} (${year}). "${title}". Retrieved ${formatted}, from ${url}. © ${source}. Reproduced for educational purposes under the fair use provisions of the Gambia Copyright Act 2004 and UK CDPA 1988.`;
}

export function generateAPA(
  author: string,
  year: number,
  title: string,
  source: string,
  url: string
): string {
  return `${author} (${year}). ${title}. ${source}. ${url}`;
}

export function generateFootnote(
  source: string,
  title: string,
  url: string,
  accessDate: Date
): string {
  return `Source: ${source}, "${title}", available at: ${url} (accessed ${accessDate.toLocaleDateString("en-GB")})`;
}
