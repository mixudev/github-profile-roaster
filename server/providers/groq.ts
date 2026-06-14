import { KeyRotator } from '../lib/keyRotator';
import type { RoastResult, GitHubProfile, GitHubRepo, HeatLevel, Language } from '../../src/types';
import { buildRoastPrompt } from '../lib/promptBuilder';

const rotator = new KeyRotator('GROQ_API_KEY');
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const BASE_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function generateWithGroq(
  profile: GitHubProfile,
  repos: GitHubRepo[],
  heatLevel: HeatLevel,
  language: Language
): Promise<RoastResult> {
  if (!rotator.hasKeys) {
    throw new Error('No GROQ_API_KEY configured.');
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
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.9,
          max_tokens: 1024,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const err: any = new Error(errBody?.error?.message || `Groq API error: ${res.status}`);
        err.status = res.status;
        throw err;
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error('Empty response from Groq API');

      return JSON.parse(text.trim()) as RoastResult;
    } catch (err: any) {
      const isRateLimit = err?.status === 429 || err?.message?.toLowerCase().includes('rate');
      if (isRateLimit && rotator.rotate()) {
        console.warn('[Groq] Key exhausted. Rotating to next key.');
        continue;
      }
      throw err;
    }
  }
}
