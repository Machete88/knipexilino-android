/**
 * Translation Service
 * Provider: DeepL API
 * Configure via .env: DEEPL_API_KEY
 */
export async function translateText(
  text: string,
  targetLang: string = 'DE'
): Promise<string> {
  // TODO: integrate DeepL API or fallback to AI translation
  return `[Translation → ${targetLang}] ${text.slice(0, 400)}`;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'DE', name: 'Deutsch' },
  { code: 'EN', name: 'Englisch' },
  { code: 'FR', name: 'Französisch' },
  { code: 'ES', name: 'Spanisch' },
  { code: 'IT', name: 'Italienisch' },
  { code: 'PL', name: 'Polnisch' },
  { code: 'RU', name: 'Russisch' },
];
