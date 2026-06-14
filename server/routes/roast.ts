import { Router } from 'express';
import { generateRoast } from '../providers/index';
import type { HeatLevel, Language } from '../../src/types';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { profile, repos, heatLevel, language } = req.body;

    if (!profile) {
      return res.status(400).json({ error: 'Missing GitHub profile data in request body.' });
    }

    const validHeat: HeatLevel[] = ['singe', 'burn', 'nuclear'];
    const validLang: Language[] = ['en', 'id'];

    const heat: HeatLevel = validHeat.includes(heatLevel) ? heatLevel : 'nuclear';
    const lang: Language = validLang.includes(language) ? language : 'en';

    const { roast, provider } = await generateRoast(profile, repos || [], heat, lang);

    res.json({ roast, provider });
  } catch (error: any) {
    console.error('[Roast] Error generating roast:', error);

    // Friendly fallback JSON so the UI shows a structured error
    res.status(500).json({
      error: error.message || 'Failed to generate roast. Check your API keys or try a preset.',
    });
  }
});

export default router;
