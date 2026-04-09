/**
 * Semantic Search Service
 * Uses embeddings (OpenAI text-embedding-3-small or local)
 * to find relevant documents by meaning, not just keyword.
 */
import { DocumentItem } from '../types/document';

export async function searchDocuments(
  query: string,
  documents: DocumentItem[]
): Promise<DocumentItem[]> {
  // TODO: implement vector embeddings + cosine similarity
  const q = query.toLowerCase();
  return documents.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      d.extractedText?.toLowerCase().includes(q) ||
      d.summary?.toLowerCase().includes(q) ||
      d.tags?.some((t) => t.toLowerCase().includes(q))
  );
}
