import { KeyRotator } from '../lib/keyRotator';
import type { RoastResult, GitHubProfile, GitHubRepo, HeatLevel, Language } from '../../src/types';
import { buildRoastPrompt } from '../lib/promptBuilder';

const rotator = new KeyRotator('OPENROUTER_API_KEY');
const MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-8b-instruct:free';
const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function generateWithOpenRouter(
  profile: GitHubProfile,
  repos: GitHubRepo[],
  heatLevel: HeatLevel,
  language: Language
): Promise<RoastResult> {
  if (!rotator.hasKeys) {
    throw new Error('No OPENROUTER_API_KEY configured.');
  }

  rotator.reset();

  while (true) {
    const apiKey = rotator.currentKey;
    try {
      const { system, user } = buildRoastPrompt(profile, repos, heatLevel, language);

      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
          'X-Title': 'GitHub Profile Roaster',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.9,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const err: any = new Error(errBody?.error?.message || `OpenRouter API error: ${res.status}`);
        err.status = res.status;
        throw err;
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error('Empty response from OpenRouter API');

      return JSON.parse(text.trim()) as RoastResult;
    } catch (err: any) {
      const isRateLimit = err?.status === 429 || err?.message?.includes('rate');
      if (isRateLimit && rotator.rotate()) {
        console.warn(`[OpenRouter] Key exhausted. Rotating to next key.`);
        continue;
      }
      throw err;
    }
  }
}
