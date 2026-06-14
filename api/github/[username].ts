import type { VercelRequest, VercelResponse } from '@vercel/node';

function getGitHubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'User-Agent': 'GitHub-Profile-Roaster/2.0',
    Accept: 'application/vnd.github.v3+json',
  };
  const token = process.env.GITHUB_TOKEN?.trim().replace(/^["']|["']$/g, '');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const username = req.query.username as string;

  if (!username || username.length > 39) {
    return res.status(400).json({ error: 'Invalid GitHub username.' });
  }

  try {
    const headers = getGitHubHeaders();

    const userRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      { headers }
    );

    if (!userRes.ok) {
      if (userRes.status === 404)
        return res.status(404).json({ error: 'GitHub user not found! Check the username and try again.' });
      if (userRes.status === 403 || userRes.status === 429)
        return res.status(429).json({
          error: 'GitHub API rate limit hit. Add a GITHUB_TOKEN to get 5000 req/hr, or use the preset demos!',
        });
      return res.status(userRes.status).json({ error: `GitHub API error: ${userRes.statusText}` });
    }

    const userData = await userRes.json();

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
    } catch {
      // repos optional, continue without
    }

    return res.json({
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
    return res.status(500).json({ error: error.message || 'Failed to fetch GitHub profile.' });
  }
}
