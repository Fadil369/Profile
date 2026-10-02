# Preview and deployment

The existing Cloudflare Worker is `profile`, serving `elfadil.com/*` from
`landing/dist` through its `ASSETS` binding. This rebuild uses that Worker and
does not require a second Worker, database, or secret.

## Local build

From the repository root:

```bash
npm --prefix landing ci
npm --prefix landing run build
npx --yes wrangler@4.135.0 dev --ip 127.0.0.1 --port 8794 --inspector-port 9238 --local
```

The build compiles TypeScript, builds browser assets, then prerenders the React
application into Arabic and English HTML. The standard content is in the HTML
before JavaScript loads. Three.js is a separate, progressively loaded browser
module. Verify routing against Wrangler as well as Vite: Vite's development
fallback does not prove production HTTP status codes.

## Reviewable preview

Upload a version of the existing Worker without promoting it:

```bash
npx wrangler versions upload --preview-alias workspace-review
```

The checked-in `preview_urls: true` permits version preview URLs while keeping
the main `workers.dev` route disabled. Before the first review upload, confirm
Preview URLs are enabled for `profile` in Cloudflare's Domains & Routes settings.
If the existing setting is disabled, enabling previews is the only routing
setting needed; the `elfadil.com/*` production route stays on its active version.
Use the actual URL and version ID returned by the upload, not a guessed hostname.

Preview responses include `X-Robots-Tag: noindex, nofollow`, and preview
`robots.txt` disallows crawling. This discourages indexing; it is not access
control. No credentials or private source content belong in a preview.

The GitHub workflow builds pull requests and pushes, and uploads a preview for
trusted repository branches. Fork pull requests build without Cloudflare secrets.
It never promotes a version from a push or pull-request event.

## Promotion and rollback

Production requires the owner's explicit authorization after the preview's
critical journeys pass. Record the currently active version before promotion:

```bash
npx wrangler deployments list
npx wrangler versions deploy REVIEWED_VERSION_UUID@100% --yes
```

Replace `REVIEWED_VERSION_UUID` with the exact tested version. The GitHub workflow
also has a manual `promote` action requiring that UUID and the `production`
environment; repository administrators can require environment reviewers.

The active production version recorded during the rebuild's initial audit was
`15911ded-1feb-4709-871d-84c931a08033`. Re-check it before promotion because other
deployments may have occurred. Roll back to the recorded previous version with:

```bash
npx wrangler versions deploy PREVIOUS_VERSION_UUID@100% --yes
```

Versions include the Worker and its assets. No storage migrations are introduced
by this change. The ordinary `npm run deploy` command deploys directly to
production; use version upload for review previews.

## Route contract

- `/` is the Arabic entry, canonicalized in metadata to `/ar`.
- `/ar` and `/en` expose equivalent standard pages and workspace controls.
- Language routes include `about`, `projects`, `brainsait`, `writing`, `contact`,
  `faq`, and `terminal`, plus individual project and article slugs.
- `/the_leverage_point` serves the existing HTML publication.
- `/echo-danah` remains a truthful project-information destination.
- Unknown paths return HTTP 404 and localized recovery content.
- Trailing slashes and document `index.html` URLs redirect to their canonical
  extensionless path, preserving query strings.
- `/__pulse` retains a bounded allowlist of public destinations. Arbitrary URLs,
  non-HTTPS destinations, and redirects outside that set cannot be probed.

The preserved `/the_leverage_point` publication labels its archived assistant unavailable. The action displays a local explanation and makes no AI request. Never add a client-side credential to this document.

See Cloudflare's [version previews](https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/)
and [static HTML routing](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/)
documentation for the deployment and asset behavior used here.

## Audit release, 22 September 2026

See [the audit and release record](AUDIT-2026-09-22.md) for current routing, tests, limitations, and rollback. The same `profile` Worker now also redirects `www.elfadil.com/*` to the apex, preserving the path and query. Run `npm --prefix landing test` against the local server before deployment. The user explicitly authorized the production audit/fix/deploy in this session.
