import { Router } from 'express';

const router = Router();

/**
 * Build GitHub API headers lazily per-request so that
 * dotenv.config() has already populated process.env by the time
 * the first request comes in.
 */
function getGitHubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'User-Agent': 'GitHub-Profile-Roaster/2.0',
    Accept: 'application/vnd.github.v3+json',
  };
  // Token read at request time, not at module load time
  const token = process.env.GITHUB_TOKEN?.trim().replace(/^["']|["']$/g, '');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    if (!username || username.length > 39) {
      return res.status(400).json({ error: 'Invalid GitHub username.' });
    }

    const headers = getGitHubHeaders();

    // Fetch profile
    const userRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      { headers }
    );

    if (!userRes.ok) {
      if (userRes.status === 404) {
        return res.status(404).json({ error: 'GitHub user not found! Check the username and try again.' });
      }
      if (userRes.status === 403 || userRes.status === 429) {
        return res.status(429).json({
          error: 'GitHub API rate limit hit. Add a GITHUB_TOKEN in .env to get 5000 req/hr, or use the preset demos!',
        });
      }
      return res.status(userRes.status).json({ error: `GitHub API error: ${userRes.statusText}` });
    }

    const userData = await userRes.json();

    // Fetch top repos
    let repos: any[] = [];
    try {
      const reposRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`,
        { headers }
      );
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        repos = reposData.map((r: any) => ({
          name: r.name,
          description: r.description || 'No description provided.',
          language: r.language || 'Markdown/Text',
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
        }));
      }
    } catch (err) {
      console.warn('[GitHub] Failed to fetch repos, continuing with profile only.', err);
    }

    res.json({
      profile: {
        login: userData.login,
        name: userData.name || userData.login,
        bio: userData.bio || 'No biography provided on their profile.',
        public_repos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        company: userData.company || 'None listed',
        location: userData.location || 'Floating in the Cloud',
        blog: userData.blog || 'None listed',
        avatar_url: userData.avatar_url,
        created_at: userData.created_at,
      },
      repos,
    });
  } catch (error: any) {
    console.error('[GitHub] Error fetching profile:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch GitHub profile.' });
  }
});

export default router;
