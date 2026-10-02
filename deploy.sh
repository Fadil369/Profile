#!/usr/bin/env bash
# Build and deploy the existing profile Worker, then verify its real custom domain.
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
if [[ -z "${CLOUDFLARE_API_TOKEN:-}" && -f /home/fadil369/CLOUDFLARE_API_KEY.env ]]; then
  source /home/fadil369/CLOUDFLARE_API_KEY.env
  export CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_KEY"
fi
npm --prefix landing ci
npm --prefix landing run build
npx --yes wrangler@4.135.0 deploy --config wrangler.jsonc
for path in / /en /ar/projects /sitemap.xml /the_leverage_point /assets/img/prof_pic.jpg; do
  status=$(curl --silent --show-error --max-time 30 --output /dev/null --write-out '%{http_code}' "https://elfadil.com$path")
  [[ "$status" == 200 ]] || { echo "Verification failed: $path returned $status" >&2; exit 1; }
  echo "Verified $path ($status)"
done
status=$(curl --silent --show-error --max-time 30 --output /dev/null --write-out '%{http_code}' https://elfadil.com/__deployment_missing_page)
[[ "$status" == 404 ]] || { echo "Expected real 404, received $status" >&2; exit 1; }
echo "Deployment and public route checks passed."
