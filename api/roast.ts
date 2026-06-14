import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { HeatLevel, Language, RoastResult, GitHubProfile, GitHubRepo } from '../src/types';
import { buildRoastPrompt } from '../server/lib/promptBuilder';

// ─── Key helper ──────────────────────────────────────────────────────────────

function getKeys(envVar: string): string[] {
  const raw = process.env[envVar] || '';
  return raw.split(',').map(k => k.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
}

// ─── Providers ───────────────────────────────────────────────────────────────

async function tryGemini(profile: GitHubProfile, repos: GitHubRepo[], heat: HeatLevel, lang: Language): Promise<RoastResult> {
  const keys = getKeys('GEMINI_API_KEY');
  if (!keys.length) throw new Error('No GEMINI_API_KEY configured.');
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const { system, user } = buildRoastPrompt(profile, repos, heat, lang);

  for (const key of keys) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: [{ parts: [{ text: user }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );
    if (res.status === 429 || res.status === 403) continue;
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e?.error?.message || `Gemini error ${res.status}`);
    }
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty Gemini response');
    return JSON.parse(text.trim()) as RoastResult;
  }
  throw new Error('All Gemini keys exhausted');
}

async function tryOpenAICompat(
  baseUrl: string, envKey: string, envModel: string, defaultModel: string,
  profile: GitHubProfile, repos: GitHubRepo[], heat: HeatLevel, lang: Language
): Promise<RoastResult> {
  const keys = getKeys(envKey);
  if (!keys.length) throw new Error(`No ${envKey} configured.`);
  const model = process.env[envModel] || defaultModel;
  const { system, user } = buildRoastPrompt(profile, repos, heat, lang);

  for (const key of keys) {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
        response_format: { type: 'json_object' },
        temperature: 0.9,
        max_tokens: 1024,
      }),
    });
    if (res.status === 429) continue;
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e?.error?.message || `${envKey} error ${res.status}`);
    }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error(`Empty response from ${envKey}`);
    return JSON.parse(text.trim()) as RoastResult;
  }
  throw new Error(`All ${envKey} keys exhausted`);
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

async function generateRoast(
  profile: GitHubProfile, repos: GitHubRepo[], heat: HeatLevel, lang: Language
): Promise<{ roast: RoastResult; provider: string }> {
  const primary = process.env.AI_PROVIDER || 'gemini';

  const providers: Array<{ name: string; fn: () => Promise<RoastResult> }> = [
    { name: 'gemini',     fn: () => tryGemini(profile, repos, heat, lang) },
    { name: 'groq',       fn: () => tryOpenAICompat('https://api.groq.com/openai/v1/chat/completions',        'GROQ_API_KEY',       'GROQ_MODEL',       'llama-3.3-70b-versatile',              profile, repos, heat, lang) },
    { name: 'grok',       fn: () => tryOpenAICompat('https://api.x.ai/v1/chat/completions',                   'GROK_API_KEY',       'GROK_MODEL',       'grok-3-mini',                          profile, repos, heat, lang) },
    { name: 'openrouter', fn: () => tryOpenAICompat('https://openrouter.ai/api/v1/chat/completions',          'OPENROUTER_API_KEY', 'OPENROUTER_MODEL', 'meta-llama/llama-3.3-8b-instruct:free', profile, repos, heat, lang) },
    { name: 'openai',     fn: () => tryOpenAICompat('https://api.openai.com/v1/chat/completions',             'OPENAI_API_KEY',     'OPENAI_MODEL',     'gpt-4o-mini',                          profile, repos, heat, lang) },
  ];

  // Primary first, then rest
  const order = [
    providers.find(p => p.name === primary)!,
    ...providers.filter(p => p.name !== primary),
  ].filter(Boolean);

  let lastErr: Error | null = null;
  for (const { name, fn } of order) {
    try {
      console.log(`[AI] Trying: ${name}`);
      const roast = await fn();
      console.log(`[AI] Success: ${name}`);
      return { roast, provider: name };
    } catch (e: any) {
      lastErr = e;
      console.warn(`[AI] ${name} failed: ${e.message}`);
    }
  }
  throw lastErr || new Error('All AI providers exhausted.');
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { profile, repos, heatLevel, language } = req.body;
    if (!profile) return res.status(400).json({ error: 'Missing profile data.' });

    const validHeat: HeatLevel[] = ['singe', 'burn', 'nuclear'];
    const validLang: Language[]  = ['en', 'id'];
    const heat = validHeat.includes(heatLevel) ? heatLevel : 'nuclear';
    const lang = validLang.includes(language)  ? language  : 'id';

    const { roast, provider } = await generateRoast(profile, repos || [], heat, lang);
    return res.json({ roast, provider });
  } catch (error: any) {
    console.error('[Roast]', error);
    return res.status(500).json({ error: error.message || 'Failed to generate roast.' });
  }
}
