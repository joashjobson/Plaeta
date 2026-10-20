# Plaeta

The Plaeta website (at `/`) and app (at `/app/`), running on a Cloudflare Worker.

- `dist/` is the built site. `src/worker.js` answers `/api/...` and runs the daily paper expiry job.
- `wrangler.toml` holds the plain settings, such as `AI_PROVIDER`. Keys are Secrets in the Cloudflare dashboard, never in a file.
- This folder is made by `npm run build:deploy` from the source zip. Change the source, then rebuild, rather than editing these files.
