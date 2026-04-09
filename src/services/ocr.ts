/**
 * OCR Service
 * Mode 1: Google Vision API (cloud) — key from SecureStore
 * Mode 2: Placeholder for local Tesseract (future)
 */
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';

export async function getVisionKey(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('google_vision_key');
  } catch {
    return null;
  }
}

export async function setVisionKey(key: string): Promise<void> {
  await SecureStore.setItemAsync('google_vision_key', key);
}

export async function runOcrFromImage(uri: string): Promise<string> {
  const apiKey = await getVisionKey();

  if (!apiKey) {
    // Graceful fallback: return placeholder
    return `[OCR-Platzhalter] Kein Google Vision Key hinterlegt. Text aus: ${uri}`;
  }

  try {
    // Read image as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const res = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [
            {
              image: { content: base64 },
              features: [{ type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1 }],
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      return `[Vision API Fehler ${res.status}]`;
    }

    const json = await res.json();
    const text =
      json.responses?.[0]?.fullTextAnnotation?.text ??
      json.responses?.[0]?.textAnnotations?.[0]?.description ??
      '[Kein Text erkannt]';

    return text.trim();
  } catch (e: any) {
    return `[OCR-Fehler] ${e?.message ?? 'Netzwerkfehler'}`;
  }
}

export async function runOcrFromPdf(uri: string): Promise<string> {
  // PDFs — extract first page as image via expo-print or similar in future
  return `[PDF-OCR-Platzhalter] Datei: ${uri}`;
}
