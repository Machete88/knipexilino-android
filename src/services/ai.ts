/**
 * AI Service
 * Providers: OpenAI | Anthropic | Gemini
 * Configure via .env: OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY
 */
export type AiTask = 'summary' | 'reply' | 'translation' | 'embedding';

export async function runAiTask(task: AiTask, input: string): Promise<string> {
  // TODO: implement provider selection + actual API calls
  return `[${task}] ${input.slice(0, 400)}`;
}

export async function generateSummary(text: string): Promise<string> {
  return runAiTask('summary', text);
}

export async function generateReplyDraft(text: string): Promise<string> {
  return runAiTask('reply', text);
}
