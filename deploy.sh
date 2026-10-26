#!/usr/bin/env bash
# Deploy the landing to elfadil.brainsait.de on the BrainSAIT server (docroot /var/www/elfadil).
#   ./deploy.sh                 build the committed tree, back up, sync, smoke-test production
#   ./deploy.sh --allow-dirty   deploy uncommitted changes (release.json is then marked dirty)
# Rollback: the script prints the backup it made; `rsync -a --delete <backup>/ /var/www/elfadil/`.
# (deploy-cloudflare.sh is the older Cloudflare Workers deploy for profile.brainsait-fadil.workers.dev.)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
DOCROOT=/var/www/elfadil
SITE=https://elfadil.brainsait.de
BACKUPS="$HOME/backups"
REGISTRY_TEST=/var/www/registry/bin/test-egfr.php

cd "$ROOT"
if [[ "${1:-}" != "--allow-dirty" && -n "$(git status --porcelain -- landing)" ]]; then
  echo "✗ landing/ has uncommitted changes — commit first (release.json must name a reproducible commit) or pass --allow-dirty" >&2
  exit 1
fi

echo "▸ build $(git rev-parse --short HEAD) ($(git rev-parse --abbrev-ref HEAD))"
cd landing
[[ -d node_modules ]] || npm ci --silent
npx tsc -b
# The toolkit app claims the same eGFR equation as the registry cockpit — keep that claim honest.
if [[ -f "$REGISTRY_TEST" ]]; then php "$REGISTRY_TEST" > /dev/null && echo "✓ registry eGFR regression test"; fi
rm -rf dist
npx vite build --logLevel error
[[ -f dist/release.json && -f dist/bpr.php && -f dist/pulse.php ]] || { echo "✗ build is missing release.json / bpr.php / pulse.php" >&2; exit 1; }

STAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p "$BACKUPS"
cp -a "$DOCROOT" "$BACKUPS/elfadil-$STAMP"
ls -1dt "$BACKUPS"/elfadil-* | tail -n +6 | xargs -r rm -rf   # keep the 5 newest
echo "✓ backup $BACKUPS/elfadil-$STAMP"

# No --delete: hashed bundles from the previous release stay for visitors who are mid-session.
rsync -a --exclude='_routes.json' dist/ "$DOCROOT/"
echo "✓ synced to $DOCROOT"

echo "▸ smoke tests against $SITE"
fail=0
check() { if eval "$2"; then echo "  ✓ $1"; else echo "  ✗ $1"; fail=1; fi; }
INDEX=$(curl -fsS "$SITE/")
JS=$(grep -o 'assets/index-[^"]*\.js' <<<"$INDEX" | head -1)
check "index serves the new bundle ($JS)" "[[ -f dist/$JS ]]"
check "release.json names this commit" "curl -fsS $SITE/release.json | grep -q \"\$(git rev-parse HEAD)\""
check "served bundle matches the manifest hash" "[[ \"\$(curl -fsS $SITE/$JS | sha256sum | cut -d' ' -f1)\" == \"\$(python3 -c 'import json,sys;print(json.load(open(\"dist/release.json\"))[\"files\"][sys.argv[1]])' $JS)\" ]]"
for r in api research fhir; do check "bpr.php?r=$r" "curl -fsS -o /dev/null '$SITE/bpr.php?r=$r'"; done
check "bpr.php refuses unknown routes" "[[ \$(curl -s -o /dev/null -w '%{http_code}' '$SITE/bpr.php?r=x') == 404 ]]"
check "SPA fallback" "curl -fsS -o /dev/null $SITE/any/deep/link"
check "the_leverage_point" "curl -fsS -o /dev/null $SITE/the_leverage_point"

if (( fail )); then
  echo "✗ smoke tests failed — roll back with: rsync -a --delete $BACKUPS/elfadil-$STAMP/ $DOCROOT/" >&2
  exit 1
fi
echo "✓ deployed $(git rev-parse --short HEAD) — rollback: rsync -a --delete $BACKUPS/elfadil-$STAMP/ $DOCROOT/"
