import { GoogleGenAI } from '@google/genai';
import { KeyRotator } from '../lib/keyRotator';
import type { RoastResult, GitHubProfile, GitHubRepo, HeatLevel, Language } from '../../src/types';
import { buildRoastPrompt } from '../lib/promptBuilder';

const rotator = new KeyRotator('GEMINI_API_KEY');
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

export async function generateWithGemini(
  profile: GitHubProfile,
  repos: GitHubRepo[],
  heatLevel: HeatLevel,
  language: Language
): Promise<RoastResult> {
  if (!rotator.hasKeys) {
    throw new Error('No GEMINI_API_KEY configured.');
  }

  rotator.reset();

  while (true) {
    const apiKey = rotator.currentKey;
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'github-roaster' } },
      });

      const { system, user } = buildRoastPrompt(profile, repos, heatLevel, language);

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: user,
        config: {
          systemInstruction: system,
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      if (!text) throw new Error('Empty response from Gemini API');

      return JSON.parse(text.trim()) as RoastResult;
    } catch (err: any) {
      const isRateLimit =
        err?.status === 429 ||
        err?.message?.includes('quota') ||
        err?.message?.includes('rate') ||
        err?.message?.includes('RESOURCE_EXHAUSTED');

      if (isRateLimit && rotator.rotate()) {
        console.warn(`[Gemini] Key exhausted. Rotating to next key (${rotator.totalKeys} total).`);
        continue;
      }
      throw err;
    }
  }
}
