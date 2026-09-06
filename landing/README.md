# elfadil.com — landing app

The React + Vite app that is now the entire site (`https://elfadil.com`). It builds to `landing/dist/`, which the root [`wrangler.jsonc`](../wrangler.jsonc) serves as Cloudflare Workers static assets.

## Develop

```sh
npm install
npm run dev
```

## Build

From the **repo root**:

```sh
npm run build
```

This runs `vite build` here into `landing/dist/`. Deploy with `npm run deploy` from the repo root, or let the `deploy.yml` GitHub Actions workflow do it on push to `main`.
