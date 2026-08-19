import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');

console.log(`Dist path: ${distPath}`);
console.log(`Dist exists: ${fs.existsSync(distPath)}`);
console.log(`Starting server on port ${PORT}`);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', port: PORT, distExists: fs.existsSync(distPath) });
});

// Astro emits nested index.html files for extensionless routes. Resolve those
// directly so both /blog and /blog/ return the generated page with status 200.
app.get('*', (req, res, next) => {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(req.path);
  } catch {
    return next();
  }

  if (path.extname(decodedPath)) return next();

  const relativePath = decodedPath.replace(/^\/+|\/+$/g, '');
  const indexPath = path.resolve(distPath, relativePath, 'index.html');
  if (!indexPath.startsWith(`${distPath}${path.sep}`)) return next();

  fs.stat(indexPath, (error, stats) => {
    if (error || !stats.isFile()) return next();
    return res.sendFile(indexPath);
  });
});

// Serve only assets and files that actually exist. Directory redirects are
// disabled because generated page directories are handled above.
app.use(express.static(distPath, {
  fallthrough: true,
  redirect: false,
}));

app.use((_req, res) => {
  res.status(404).type('text/plain').send('Not found');
});

app.use((err, _req, res, _next) => {
  // Express decodes wildcard parameters before route handlers run. Invalid
  // percent-encoding therefore arrives here as a URIError and is a client
  // request problem, not an internal server failure.
  if (err instanceof URIError || err?.name === 'URIError') {
    return res.status(400).type('text/plain').send('Bad request');
  }

  console.error(`Server error: ${err}`);
  return res.status(500).type('text/plain').send('Server error');
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
  console.error(`Server listen error: ${err}`);
  process.exit(1);
});
