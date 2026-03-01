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

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok', port: PORT, distExists: fs.existsSync(distPath) });
});

// Serve static files from dist
app.use(express.static(distPath));

// Handle SPA routing - serve index.html for all unmatched routes
app.use((req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  console.log(`Serving index.html from: ${indexPath}`);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`Error serving index.html: ${err}`);
      res.status(500).send('Error');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Server error: ${err}`);
  res.status(500).send('Server error');
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
  console.error(`Server listen error: ${err}`);
  process.exit(1);
});
