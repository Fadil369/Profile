#!/bin/bash
# Deploy script for elfadil.com profile landing
# Usage: ./deploy.sh

set -e

# Load Cloudflare credentials
source /home/fadil369/CLOUDFLARE_API_KEY.env
export CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_KEY"
export CLOUDFLARE_ACCOUNT_ID="d7b99530559ab4f2545e9bdc72a7ab9b"

# Build
echo "🔧 Building..."
cd /home/fadil369/Fadil369-profile/landing
rm -rf dist
npm run build

# Deploy
echo "🚀 Deploying to Cloudflare..."
npx --prefix /home/fadil369/Fadil369-profile/landing wrangler deploy --config=/home/fadil369/Fadil369-profile/wrangler.jsonc

# Verify
echo "✅ Verifying..."
curl -s -o /dev/null -w "index: %{http_code}\n" "https://profile.brainsait-fadil.workers.dev"
curl -s -o /dev/null -w "leverage: %{http_code}\n" "https://profile.brainsait-fadil.workers.dev/the_leverage_point.html"
curl -s -o /dev/null -w "image: %{http_code}\n" "https://profile.brainsait-fadil.workers.dev/assets/img/prof_pic.jpg"

echo "✅ Deploy complete!"
