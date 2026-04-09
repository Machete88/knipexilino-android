/**
 * AI Service — OpenRouter
 * Compatible with any OpenAI-API model via https://openrouter.ai
 * Keys: stored in expo-secure-store, never in code.
 */
import * as SecureStore from 'expo-secure-store';

export type AiTask = 'summary' | 'reply' | 'translation' | 'embedding';

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';
const DEFAULT_MODEL = 'mistralai/mistral-7b-instruct';

const PROMPTS: Record<AiTask, (input: string) => string> = {
  summary: (t) =>
    `Fasse das folgende Dokument auf Deutsch in 2-3 Sätzen zusammen:\n\n${t}`,
  reply: (t) =>
    `Schreibe einen höflichen, professionellen Antwortentwurf auf Deutsch für dieses Schreiben:\n\n${t}`,
  translation: (t) =>
    `Übersetze den folgenden deutschen Text ins Englische:\n\n${t}`,
  embedding: (t) => t,
};

export async function getApiKey(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('openrouter_api_key');
  } catch {
    return null;
  }
}

export async function setApiKey(key: string): Promise<void> {
  await SecureStore.setItemAsync('openrouter_api_key', key);
}

export async function getModel(): Promise<string> {
  try {
    return (await SecureStore.getItemAsync('openrouter_model')) ?? DEFAULT_MODEL;
  } catch {
    return DEFAULT_MODEL;
  }
}

export async function setModel(model: string): Promise<void> {
  await SecureStore.setItemAsync('openrouter_model', model);
}

export async function runAiTask(task: AiTask, input: string): Promise<string> {
  const apiKey = await getApiKey();
  if (!apiKey) {
    return `[Kein API-Key] Bitte OpenRouter-Key in den Einstellungen hinterlegen.`;
  }

  const model = await getModel();
  const prompt = PROMPTS[task](input.slice(0, 3000));

  try {
    const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/Machete88/knipexilino-android',
        'X-Title': 'Knipexilino',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 512,
        temperature: 0.4,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return `[API-Fehler ${res.status}] ${err.slice(0, 200)}`;
    }

    const json = await res.json();
    return json.choices?.[0]?.message?.content?.trim() ?? '[Leere Antwort]';
  } catch (e: any) {
    return `[Netzwerkfehler] ${e?.message ?? 'Unbekannt'}`;
  }
}

export const generateSummary = (text: string) => runAiTask('summary', text);
export const generateReplyDraft = (text: string) => runAiTask('reply', text);
export const generateTranslation = (text: string) => runAiTask('translation', text);
