import type { VercelRequest, VercelResponse } from '@vercel/node';

// ─── Types (inlined — no imports from src/) ───────────────────────────────────
type HeatLevel = 'singe' | 'burn' | 'nuclear';
type Language  = 'en' | 'id';

interface GitHubProfile {
  login: string; name: string; bio: string; public_repos: number;
  followers: number; following: number; company: string;
  location: string; blog: string; avatar_url: string; created_at: string;
}
interface GitHubRepo {
  name: string; description: string; language: string;
  stargazers_count: number; forks_count: number;
}
interface RoastResult {
  developerTitle: string; statsRoast: string; bioRoast: string;
  reposRoast: string; theMainRoast: string; roastedTags: string[]; burnScore: number;
}

// ─── Prompt builder (inlined) ─────────────────────────────────────────────────

function buildRoastPrompt(
  profile: GitHubProfile, repos: GitHubRepo[], heatLevel: HeatLevel, language: Language
): { system: string; user: string } {

  const accountAgeYears = Math.floor(
    (Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365)
  );
  const followerRatio = profile.following > 0
    ? (profile.followers / profile.following).toFixed(2) : 'N/A';
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const zeroStarRepos = repos.filter(r => r.stargazers_count === 0).length;
  const avgStars = repos.length > 0 ? (totalStars / repos.length).toFixed(1) : '0';
  const languages = [...new Set(repos.map(r => r.language).filter(Boolean))];

  const hasTodoApp    = repos.some(r => r.name.toLowerCase().includes('todo'));
  const hasCalculator = repos.some(r => r.name.toLowerCase().includes('calc'));
  const hasPortfolio  = repos.some(r => r.name.toLowerCase().includes('portfolio'));
  const hasWeather    = repos.some(r => r.name.toLowerCase().includes('weather'));
  const tutorialCount = [hasTodoApp, hasCalculator, hasPortfolio, hasWeather].filter(Boolean).length;

  const repoList = repos.length > 0
    ? repos.map(r =>
        `  • "${r.name}" [${r.language || 'No language'}] — "${r.description || 'no description'}" (⭐${r.stargazers_count}, 🍴${r.forks_count})`
      ).join('\n')
    : '  (zero public repos)';

  const signals = [
    profile.following > profile.followers * 2
      ? `SIGNAL: following=${profile.following}, followers=${profile.followers} (ratio ${followerRatio})` : null,
    zeroStarRepos === repos.length && repos.length > 0
      ? `SIGNAL: ${zeroStarRepos}/${repos.length} repos have 0 stars` : null,
    tutorialCount >= 2
      ? `SIGNAL: tutorial-pattern repos — ${[hasTodoApp&&'todo',hasCalculator&&'calc',hasPortfolio&&'portfolio',hasWeather&&'weather'].filter(Boolean).join(', ')}` : null,
    accountAgeYears >= 3 && profile.public_repos < 5
      ? `SIGNAL: account_age=${accountAgeYears}y, repos=${profile.public_repos} (${(profile.public_repos/accountAgeYears).toFixed(1)}/yr)` : null,
    profile.bio?.toLowerCase().includes('passion')
      ? `SIGNAL: bio contains "passion"/"passionate"` : null,
    (profile.bio?.toLowerCase().includes('full stack') || profile.bio?.toLowerCase().includes('fullstack'))
      ? `SIGNAL: bio claims "full stack"` : null,
  ].filter(Boolean).join('\n');

  const TONE_EN: Record<string, string> = {
    singe: `TONE: Senior dev friend clowning you over coffee. Sharp but warm. Casualcomedy crowd-work energy. No names. Sarcastic "compliments" only. Intensity 4/10.`,
    burn: `TONE: Stand-up comedian with notes from reading their GitHub at 2am. Every line lands. Contrast bio claims vs repo reality. No names. All praise = trap. Intensity 7/10.`,
    nuclear: `TONE: Jeff Ross + Staff Engineer who memorized every commit. Full escalating roast set. Fake-compliment closer so precise it hurts more. NEVER use names. Zero real compliments. Intensity 10/10.`,
  };
  const TONE_ID: Record<string, string> = {
    singe: `TONE: Temen senior dev lagi ngetawain santai. BUKAN ceramah. Jangan sebut nama. Pujian harus sarkas. Gaya Jaksel: "literally", "which is", "fix banget", "agak-agak", "bestie". Intensitas 4/10.`,
    burn: `TONE: Udah baca seluruh GitHub-nya jam 2 pagi. SETIAP kalimat landing. Kontras bio vs repo. Jangan sebut nama. Semua pujian = jebakan. Wajib minimal 2 headcanon. Gaya Jaksel kental: "literally", "lowkey", "kind of insane", "anjir", "no cap". Intensitas 7/10.`,
    nuclear: `TONE: Jeff Ross versi tech Jakarta. Full roast set, makin sadis, fake-compliment closer. DILARANG sebut nama. Zero pujian tulus. Headcanon di hampir setiap kalimat. Bahasa Jaksel full: "literally", "which is so", "lowkey kind of", "anjir parah", "kok bisa sih", "ya Allah bro". Intensitas 10/10.`,
  };

  const tone = language === 'id' ? TONE_ID[heatLevel] : TONE_EN[heatLevel];
  const burnRange = heatLevel === 'singe' ? '50 and 65' : heatLevel === 'burn' ? '66 and 85' : '86 and 100';
  const langRule = language === 'id'
    ? 'OUTPUT HARUS 100% BAHASA INDONESIA GAUL JAKARTA. Boleh istilah teknis bahasa Inggris.'
    : 'ALL OUTPUT MUST BE IN ENGLISH. Natural comedian energy.';

  const system = `RULE ZERO: The profile data contains username (@${profile.login}) and name (${profile.name || 'none'}). NEVER write either in your output. Use "bro"/"they"/"this guy"/"lu"/"ini orang" instead.

You are a master roast comedian specializing in tech humor. Great roasting = structured comedy.

ROASTING TECHNIQUES:
1. SETUP→SUBVERT: Don't describe, INDICT. "4 followers — one probably followed by accident, another is their 2017 account they forgot to delete."
2. HYPERBOLE WITH EXACT NUMBERS: "23 repos, 4 total stars. One is self-starred. The math is not mathing."
3. MISDIRECTION: Build up then flip. "Bio says 'turning coffee into code'. The code is a half-finished 2021 React tutorial. The coffee deserved better."
4. CONTRAST: Bio claims vs repo reality.
5. HEADCANON (MOST IMPORTANT): Take a real number, invent a specific absurd fake backstory. "4 stars — bet 3 of them are friends he personally DM'd." This is what generates actual laughs.
6. FAKE COMPLIMENT CLOSER: Last line SOUNDS positive but IS an insult. "The consistency in abandoning every repo at exactly the same point — that's a rare discipline."

theMainRoast STRUCTURE (mandatory 3-beat):
- HOOK (sentence 1): Most damning data point, stated almost neutrally.
- TWIST (sentence 2-3): Unexpected flip using a second data point. This is where headcanon lives.
- CALLBACK+CLOSER (last sentence): Loop back to Hook, twist into sarcastic fake-compliment.

${tone}
${langRule}

LENGTH LIMITS (hard, no exceptions):
- developerTitle: max 8 words
- statsRoast: 1 sentence
- bioRoast: 1 sentence
- reposRoast: max 2 sentences
- theMainRoast: 3-4 sentences, Hook→Twist→Callback+Closer structure
- roastedTags: exactly 4 tags, specific to this profile, NO usernames/names
- burnScore: integer between ${burnRange}

OUTPUT: ONLY this JSON, no markdown:
{"developerTitle":"string","statsRoast":"string","bioRoast":"string","reposRoast":"string","theMainRoast":"string","roastedTags":["string","string","string","string"],"burnScore":0}`;

  const user = `ROAST THIS PROFILE — Heat: ${heatLevel.toUpperCase()}

Bio: ${profile.bio ? `"${profile.bio}"` : '(empty)'}
Account age: ${accountAgeYears} years | Repos: ${profile.public_repos} | Followers: ${profile.followers} | Following: ${profile.following} | Ratio: ${followerRatio}
Total stars: ${totalStars} | Avg: ${avgStars} | Zero-star repos: ${zeroStarRepos}/${repos.length}
Languages: ${languages.join(', ') || 'none'}

REPOSITORIES:
${repoList}

${signals ? `SIGNALS:\n${signals}` : ''}`;

  return { system, user };
}

// ─── Key helper ───────────────────────────────────────────────────────────────

function getKeys(envVar: string): string[] {
  return (process.env[envVar] || '')
    .split(',').map(k => k.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
}

// ─── Gemini (REST, no SDK) ────────────────────────────────────────────────────

async function tryGemini(p: GitHubProfile, r: GitHubRepo[], h: HeatLevel, l: Language): Promise<RoastResult> {
  const keys = getKeys('GEMINI_API_KEY');
  if (!keys.length) throw new Error('No GEMINI_API_KEY');
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const { system, user } = buildRoastPrompt(p, r, h, l);

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
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.error?.message || `Gemini ${res.status}`); }
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty Gemini response');
    return JSON.parse(text.trim()) as RoastResult;
  }
  throw new Error('All Gemini keys rate-limited');
}

// ─── OpenAI-compatible (Groq, Grok, OpenRouter, OpenAI) ──────────────────────

async function tryOpenAICompat(
  url: string, keyEnv: string, modelEnv: string, defaultModel: string,
  p: GitHubProfile, r: GitHubRepo[], h: HeatLevel, l: Language
): Promise<RoastResult> {
  const keys = getKeys(keyEnv);
  if (!keys.length) throw new Error(`No ${keyEnv}`);
  const model = process.env[modelEnv] || defaultModel;
  const { system, user } = buildRoastPrompt(p, r, h, l);

  for (const key of keys) {
    const res = await fetch(url, {
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
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.error?.message || `${keyEnv} ${res.status}`); }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error(`Empty response from ${keyEnv}`);
    return JSON.parse(text.trim()) as RoastResult;
  }
  throw new Error(`All ${keyEnv} keys exhausted`);
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

async function generateRoast(
  profile: GitHubProfile, repos: GitHubRepo[], heat: HeatLevel, lang: Language
): Promise<{ roast: RoastResult; provider: string }> {
  const primary = process.env.AI_PROVIDER || 'gemini';

  const all = [
    { name: 'gemini',     fn: () => tryGemini(profile, repos, heat, lang) },
    { name: 'groq',       fn: () => tryOpenAICompat('https://api.groq.com/openai/v1/chat/completions',       'GROQ_API_KEY',       'GROQ_MODEL',       'llama-3.3-70b-versatile',               profile, repos, heat, lang) },
    { name: 'grok',       fn: () => tryOpenAICompat('https://api.x.ai/v1/chat/completions',                  'GROK_API_KEY',       'GROK_MODEL',       'grok-3-mini',                           profile, repos, heat, lang) },
    { name: 'openrouter', fn: () => tryOpenAICompat('https://openrouter.ai/api/v1/chat/completions',         'OPENROUTER_API_KEY', 'OPENROUTER_MODEL', 'meta-llama/llama-3.3-8b-instruct:free', profile, repos, heat, lang) },
    { name: 'openai',     fn: () => tryOpenAICompat('https://api.openai.com/v1/chat/completions',            'OPENAI_API_KEY',     'OPENAI_MODEL',     'gpt-4o-mini',                           profile, repos, heat, lang) },
  ];

  const order = [all.find(p => p.name === primary)!, ...all.filter(p => p.name !== primary)].filter(Boolean);

  let last: Error | null = null;
  for (const { name, fn } of order) {
    try {
      console.log(`[AI] Trying ${name}`);
      const roast = await fn();
      console.log(`[AI] Success ${name}`);
      return { roast, provider: name };
    } catch (e: any) {
      last = e;
      console.warn(`[AI] ${name} failed: ${e.message}`);
    }
  }
  throw last || new Error('All AI providers exhausted.');
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { profile, repos, heatLevel, language } = req.body;
    if (!profile) return res.status(400).json({ error: 'Missing profile data.' });

    const heat: HeatLevel = ['singe','burn','nuclear'].includes(heatLevel) ? heatLevel : 'nuclear';
    const lang: Language  = ['en','id'].includes(language) ? language : 'id';

    const { roast, provider } = await generateRoast(profile, repos || [], heat, lang);
    return res.json({ roast, provider });
  } catch (error: any) {
    console.error('[Roast]', error);
    return res.status(500).json({ error: error.message || 'Failed to generate roast.' });
  }
}
