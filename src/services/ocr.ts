/**
 * OCR Service
 * Providers: Tesseract (local) | Google Vision API
 * Configure via .env: GOOGLE_VISION_API_KEY, TESSERACT_LANGUAGE
 */
export async function runOcrFromImage(uri: string): Promise<string> {
  // TODO: integrate expo-camera + tesseract.js or Google Vision API
  return `OCR placeholder text extracted from ${uri}`;
}

export async function runOcrFromPdf(uri: string): Promise<string> {
  // TODO: integrate react-native-pdf or similar to extract pages → OCR
  return `PDF OCR placeholder for ${uri}`;
}
