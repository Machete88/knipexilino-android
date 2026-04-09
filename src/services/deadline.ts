/**
 * Deadline Detection Service
 * Parses German-format dates (dd.mm.yyyy) from OCR-extracted text.
 * TODO: extend with AI-based deadline extraction for natural language dates.
 */
export async function detectDeadline(text: string): Promise<string | null> {
  // German date pattern: dd.mm.yyyy
  const match = text.match(/\b(\d{2}\.\d{2}\.\d{4})\b/);
  return match ? match[1] : null;
}

export async function detectAllDeadlines(text: string): Promise<string[]> {
  const matches = [...text.matchAll(/\b(\d{2}\.\d{2}\.\d{4})\b/g)];
  return matches.map((m) => m[1]);
}
