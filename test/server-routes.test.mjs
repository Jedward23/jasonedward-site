import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { request } from 'node:http';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function getFreePort() {
  const probe = createServer();
  probe.listen(0, '127.0.0.1');
  await once(probe, 'listening');
  const address = probe.address();
  assert.ok(address && typeof address === 'object');
  const { port } = address;
  await new Promise((resolve, reject) => probe.close((error) => error ? reject(error) : resolve()));
  return port;
}

async function waitForHealth(baseUrl, child, logs) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`server exited early (${child.exitCode})\n${logs.join('')}`);
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return;
    } catch {
      // The listener may not be ready yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`server did not become healthy\n${logs.join('')}`);
}

function requestRawPath(port, requestPath) {
  return new Promise((resolve, reject) => {
    const req = request({ hostname: '127.0.0.1', port, path: requestPath, method: 'GET' }, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve({
        status: response.statusCode,
        contentType: response.headers['content-type'] ?? '',
        body: Buffer.concat(chunks).toString('utf8'),
      }));
    });
    req.on('error', reject);
    req.end();
  });
}

test('serves generated pages and rejects missing or malformed routes safely', async (t) => {
  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const logs = [];
  const child = spawn(process.execPath, ['server.js'], {
    cwd: root,
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (chunk) => logs.push(chunk.toString()));
  child.stderr.on('data', (chunk) => logs.push(chunk.toString()));
  t.after(() => {
    if (child.exitCode === null) child.kill('SIGTERM');
  });

  await waitForHealth(baseUrl, child, logs);

  const health = await fetch(`${baseUrl}/health`);
  assert.equal(health.status, 200);
  assert.equal((await health.json()).status, 'ok');

  for (const route of ['/', '/blog', '/blog/', '/blog/long-horizon-tasks', '/blog/long-horizon-tasks/', '/blog/modular-code-ai-agents', '/rss.xml', '/sitemap-index.xml']) {
    const response = await fetch(`${baseUrl}${route}`, { redirect: 'manual' });
    assert.equal(response.status, 200, `${route} should resolve without a redirect`);
  }

  const portrait = await fetch(`${baseUrl}/jason-profile.jpg`);
  assert.equal(portrait.status, 200);
  assert.match(portrait.headers.get('content-type') ?? '', /^image\/jpeg/);

  const socialCard = await fetch(`${baseUrl}/social-card.png`);
  assert.equal(socialCard.status, 200);
  assert.match(socialCard.headers.get('content-type') ?? '', /^image\/png/);

  for (const route of ['/missing-page', '/missing-asset.png', '/blog/not-a-real-post']) {
    const response = await fetch(`${baseUrl}${route}`);
    const body = await response.text();
    assert.equal(response.status, 404, `${route} should be 404`);
    assert.match(response.headers.get('content-type') ?? '', /^text\/plain/);
    assert.equal(body, 'Not found');
    assert.doesNotMatch(body, /<!doctype html>/i);
  }

  for (const route of ['/%', '/%2', '/bad%ZZ', '/%E0%A4%A', '/blog/%C0%AF']) {
    const response = await requestRawPath(port, route);
    assert.equal(response.status, 400, `${route} should be rejected as a bad request`);
    assert.match(response.contentType, /^text\/plain/);
    assert.equal(response.body, 'Bad request');
  }

  await new Promise((resolve) => setTimeout(resolve, 25));
  assert.doesNotMatch(logs.join(''), /Server error|URIError/, 'malformed client paths must not be logged as server errors');
});
