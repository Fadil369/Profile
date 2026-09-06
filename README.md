# Dr. Mohamed El Fadil — Profile Site

Source for [elfadil.com](https://elfadil.com) — a bilingual (Arabic/English) personal site for Dr. Mohamed El Fadil, Founder & CEO of [BrainSAIT](https://brainsait.org).

## Stack

- **App:** React + TypeScript, built with Vite — see [`landing/`](./landing)
- **Hosting:** Cloudflare Workers (static assets), configured in [`wrangler.jsonc`](./wrangler.jsonc)
- **CI/CD:** GitHub Actions ([`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)) builds `landing/` and runs `wrangler deploy` on every push to `main`; pull requests get a preview version upload.

This repo previously also hosted a Jekyll-based academic site (blog, CV, publications, bibliography) alongside the React app. That Jekyll site has been removed — the React app in `landing/` is now the entire site.

## Local development

```bash
npm --prefix landing install
npm --prefix landing run dev
```

## Build

```bash
npm run build
```

Outputs to `landing/dist/`, which is what `wrangler.jsonc` serves as static assets.

## Deploy

Deploys automatically via GitHub Actions on push to `main`. To deploy manually:

```bash
npm run deploy
```

Requires Cloudflare credentials (`CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`) either as environment variables or via `wrangler login`.
