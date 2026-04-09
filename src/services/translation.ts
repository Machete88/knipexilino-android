/**
 * Translation Service
 * Primary: DeepL API
 * Fallback: OpenRouter AI translation
 */
import * as SecureStore from 'expo-secure-store';
import { runAiTask } from './ai';

export async function getDeeplKey(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('deepl_api_key');
  } catch {
    return null;
  }
}

export async function setDeeplKey(key: string): Promise<void> {
  await SecureStore.setItemAsync('deepl_api_key', key);
}

export async function translateText(
  text: string,
  targetLang: string = 'EN'
): Promise<string> {
  const deeplKey = await getDeeplKey();

  if (deeplKey) {
    try {
      const res = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          Authorization: `DeepL-Auth-Key ${deeplKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: [text.slice(0, 5000)],
          target_lang: targetLang.toUpperCase(),
        }),
      });

      if (res.ok) {
        const json = await res.json();
        return json.translations?.[0]?.text ?? '[Leere Übersetzung]';
      }
    } catch (_) {}
  }

  // Fallback: OpenRouter AI
  return runAiTask('translation', text);
}

export const SUPPORTED_LANGUAGES = [
  { code: 'EN', name: 'Englisch' },
  { code: 'DE', name: 'Deutsch' },
  { code: 'FR', name: 'Französisch' },
  { code: 'ES', name: 'Spanisch' },
  { code: 'IT', name: 'Italienisch' },
  { code: 'PL', name: 'Polnisch' },
  { code: 'NL', name: 'Niederländisch' },
  { code: 'PT', name: 'Portugiesisch' },
  { code: 'RU', name: 'Russisch' },
  { code: 'ZH', name: 'Chinesisch' },
  { code: 'JA', name: 'Japanisch' },
];
