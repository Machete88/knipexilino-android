import { DocumentItem } from '../types/document';

/**
 * Keyword search with structure for future vector/embedding upgrade.
 * TODO: replace haystack filter with embedding cosine-similarity.
 */
export async function searchDocuments(
  query: string,
  documents: DocumentItem[]
): Promise<DocumentItem[]> {
  const q = query.trim().toLowerCase();
  if (!q) return documents;

  return documents.filter((doc) => {
    const haystack = [
      doc.title,
      doc.extractedText,
      doc.summary,
      doc.replyDraft,
      doc.translation,
      ...(doc.tags ?? []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(q);
  });
}
