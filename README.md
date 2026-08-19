# jasonedward.me

Jason Edward's founder site and writing archive.

## Local development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
PORT=3000 node server.js
```

## Regression checks

```sh
npm test
```

The site is an Astro static build served by `server.js` on Railway. The server test verifies published routes plus genuine 404 responses for unknown pages and missing assets. Blog entries live in `src/content/blog/`; RSS and sitemap generation are part of the production build.
