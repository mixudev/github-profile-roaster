import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateRoast } from '../server/providers/index';
import type { HeatLevel, Language } from '../src/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { profile, repos, heatLevel, language } = req.body;

    if (!profile) {
      return res.status(400).json({ error: 'Missing GitHub profile data in request body.' });
    }

    const validHeat: HeatLevel[] = ['singe', 'burn', 'nuclear'];
    const validLang: Language[] = ['en', 'id'];

    const heat: HeatLevel = validHeat.includes(heatLevel) ? heatLevel : 'nuclear';
    const lang: Language = validLang.includes(language) ? language : 'id';

    const { roast, provider } = await generateRoast(profile, repos || [], heat, lang);

    return res.json({ roast, provider });
  } catch (error: any) {
    console.error('[Roast] Error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate roast. Check your API keys or try a preset.',
    });
  }
}
