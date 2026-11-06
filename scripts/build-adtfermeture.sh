#!/usr/bin/env bash
# Compile le site vitrine (source/adtfermeture.fr) et remplace le contenu publié (sites/adtfermeture.fr).
set -euo pipefail
cd "$(dirname "$0")/../source/adtfermeture.fr"
npm ci --no-audit --no-fund
npx tsc --noEmit -p tsconfig.app.json
npx vite build
rm -rf ../../sites/adtfermeture.fr
cp -a dist ../../sites/adtfermeture.fr
echo "Site compilé dans sites/adtfermeture.fr : committer et pousser pour le mettre en ligne."
