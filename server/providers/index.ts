import type { RoastResult, GitHubProfile, GitHubRepo, HeatLevel, Language, AIProvider } from '../../src/types';
import { generateWithGemini } from './gemini';
import { generateWithGrok } from './grok';
import { generateWithGroq } from './groq';
import { generateWithOpenRouter } from './openrouter';
import { generateWithOpenAI } from './openai';

export type { AIProvider };

/**
 * Generate roast using the configured AI provider.
 * Always tries all providers — skips on any failure and falls back to next.
 */
export async function generateRoast(
  profile: GitHubProfile,
  repos: GitHubRepo[],
  heatLevel: HeatLevel,
  language: Language
): Promise<{ roast: RoastResult; provider: AIProvider }> {
  const primary = (process.env.AI_PROVIDER || 'gemini') as AIProvider;

  // Full list with primary first
  const allProviders: AIProvider[] = ['gemini', 'groq', 'grok', 'openrouter', 'openai'];
  const order: AIProvider[] = [primary, ...allProviders.filter((p) => p !== primary)];

  let lastError: Error | null = null;

  for (const provider of order) {
    try {
      console.log(`[AI] Trying provider: ${provider}`);
      let roast: RoastResult;

      if (provider === 'gemini') {
        roast = await generateWithGemini(profile, repos, heatLevel, language);
      } else if (provider === 'grok') {
        roast = await generateWithGrok(profile, repos, heatLevel, language);
      } else if (provider === 'groq') {
        roast = await generateWithGroq(profile, repos, heatLevel, language);
      } else if (provider === 'openrouter') {
        roast = await generateWithOpenRouter(profile, repos, heatLevel, language);
      } else {
        roast = await generateWithOpenAI(profile, repos, heatLevel, language);
      }

      console.log(`[AI] Success with provider: ${provider}`);
      return { roast, provider };
    } catch (err: any) {
      lastError = err;
      console.warn(`[AI] Provider ${provider} failed (${err?.status ?? 'unknown'}: ${err.message}). Trying next...`);
    }
  }

  throw lastError || new Error('All AI providers exhausted. Check your API keys and models.');
}
