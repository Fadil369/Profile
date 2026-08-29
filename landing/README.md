# elfadil.com landing page

A React + Vite app that renders the site's homepage (`/`). It's built
separately from the Jekyll site and its output is committed as static
files, so the Cloudflare Pages build (`bundle exec jekyll build`) needs no
Node step.

## Develop

```sh
npm install
npm run dev
```

## Publish a change

From the **repo root**:

```sh
npm run build:landing
```

This runs `vite build` here and copies the result into the parent repo:

- `landing/dist/index.html` → `../index.html` (the site root — Jekyll copies
  any front-matter-less `.html` file through verbatim)
- `landing/dist/assets/*` → `../assets/landing/assets/` (matches the
  `base: "/assets/landing/"` in `vite.config.ts`)

Then commit `index.html`, `assets/landing/`, and whatever changed under
`landing/src/`.

The whole `landing/` directory (source, `node_modules`, `dist`) is excluded
from the Jekyll build via `_config.yml`'s `exclude:` list — only the
published copies at the repo root and under `assets/landing/` are ever
served.

The old Jekyll "about" page (bio, timeline, publications, etc.) still
exists at `/about/` — see `_pages/about.md`.
