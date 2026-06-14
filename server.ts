import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

// Load .env before starting anything
dotenv.config();

import githubRouter from './server/routes/github';
import roastRouter from './server/routes/roast';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Mount API routes
  app.use('/api/github', githubRouter);
  app.use('/api/roast', roastRouter);

  // Dev: use Vite middleware | Prod: serve built static files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    const provider = process.env.AI_PROVIDER || 'gemini';
    console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
    console.log(`🤖 Primary AI provider: ${provider.toUpperCase()}`);
    console.log(`🔑 Multi-key rotation: enabled`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
